const {getFirestore,doc,setDoc,getDoc,getDocs,collection} = require('firebase/firestore')
const firestore = getFirestore();
const {checkEmail} = require("../util/validation");

exports.addCustomer = async (req,res)=>{

    let newCustomer = {
        name: req.body.name,
        email: req.body.email,
        numOfAccounts: 0,
        netWorth: 0
    }


    try{

        if(checkEmail(newCustomer.email)){
            let checkDoc = await getDoc(doc(firestore,"customers",newCustomer.name));
            if(checkDoc.exists()){
              return res.status(400).json({name: "this name is already taken"});
            }
            
            newCustomer.createdAt = new Date().toISOString();
            await setDoc(doc(firestore,"customers",req.body.name),newCustomer);
            return res.status(200).json({message:"success"});

        }
    }catch(err){
        return res.status(500).json({error:err.message});
    }


}


exports.getSingleCustomer = async (req,res) =>{

    try{
        let document = await getDoc(doc(firestore,"customers",req.params.name));
        console.log(document.data())
        return res.status(200).json(document.data());
    }catch(err){
        return res.status(400).json({error:err.message});
    }
}


exports.getAllCustomers = async (req,res)=>{

    try{

        let documents = await getDocs(collection(firestore,"customers"));
        let list = documents.docs.map(d => d.data());
    
        return res.status(200).json(list);
    }catch(err){
        return res.status(400).json({error:err.message});
    }
}


