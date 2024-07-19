const { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    sendEmailVerification, 
    sendPasswordResetEmail
  
} = require("firebase/auth") ;

const {validateLogin,validateSignup} = require("../util/validation");
const {getFirestore,doc,setDoc,getDoc,collection,getDocs} = require('firebase/firestore')
const firestore = getFirestore();



exports.signup = async(req,res)=>{
    const newUser = {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      jobTitle: req.body.jobTitle,
      age: req.body.age
    };
  
    //* Data Validation
    const {errors,valid} = validateSignup(newUser);
    if(!valid) return res.status(400).json(errors);
  
  
    let token;
  
    let checkDoc = await getDoc(doc(firestore,"employees",newUser.name));
    if(checkDoc.exists()){
      return res.status(400).json({name: "this name is already taken"});
    }
  
  
    try{
      const auth = getAuth();
      let signedup = await createUserWithEmailAndPassword(auth,newUser.email,newUser.password);
      token = await signedup.user.getIdToken();
      
      delete newUser.password;
      newUser.createdAt = new Date().toISOString();
      await setDoc(doc(firestore,"employees",newUser.name),newUser);
      
      return res.json({token});
    }catch(err){
      if(err.message == "Firebase: Error (auth/email-already-in-use)."){
        return res.status(400).json({error:"email already in use"});
      }
      return res.status(500).json({error:"something went wrong: "+err.message});
    }
  
  
}


exports.signin = async (req,res) =>{

    const User = {
        email: req.body.email,
        password: req.body.password
    };

    const {errors, valid} = validateLogin(User);
    if(!valid) return res.status(400).json(errors);

    try{
        const auth = getAuth();
        var loggedIn = await signInWithEmailAndPassword(auth,User.email,User.password);

        var token = await loggedIn.user.getIdToken();
        return res.status(200).json({token});
    }catch(error){
        return res.status(403).json({general:"Wrong Email or password"});
    }

}


exports.getAll = async (req,res)=>{

    let documents = await getDocs(collection(firestore,"employees"));
    let list = documents.docs.map(d => d.data());

    return res.status(200).json(list);
}


exports.signOut = async (req,res)=>{
    await signOut(getAuth());
}


