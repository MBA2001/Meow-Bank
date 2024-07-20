const {getFirestore,doc,setDoc,getDoc,getDocs,collection,updateDoc,FieldValue} = require('firebase/firestore')
const firestore = getFirestore();
const generateString = require("../util/generateString");
const {updateCustomerNetWorth} = require("./transaction");

exports.addAccount = async (req,res)=>{
    
    let newAccount = {
        customerName: req.body.customerName,
        customerEmail: req.body.customerEmail,
        numberOfTransactions: 0,
        accountBalance: req.body.accountBalance,
        accountNumber: generateString(7).trim().trimStart()
    }

    try{
            if(newAccount.accountBalance <0) return res.status(400).json({error:"number is less than zero"});
            let checkDoc = await getDoc(doc(firestore,"accounts",newAccount.accountNumber));
            if(checkDoc.exists()){
              newAccount.accountNumber = generateString(8)
            }
            newAccount.createdAt = new Date().toISOString();
            await setDoc(doc(firestore,"accounts",newAccount.accountNumber),newAccount);

 
            let document = await getDoc(doc(firestore,"customers",req.body.customerName));
            let data = document.data();
            await updateDoc(doc(firestore,"customers",req.body.customerName),{numOfAccounts: data.numOfAccounts+1,netWorth: data.netWorth+Number(req.body.accountBalance)});
            return res.status(200).json({message:"success"});

    }catch(err){
        return res.status(500).json({error:err.message});
    }


}


exports.getAccount = async (req,res)=>{

    try{
        let document = await getDoc(doc(firestore,"accounts",req.params.accountNumber));
        console.log(document.data())
        return res.status(200).json(document.data());
    }catch(err){
        return res.status(400).json({error:err.message});
    }
}


exports.getAllAccounts = async (req,res)=>{
    try{

        let documents = await getDocs(collection(firestore,"accounts"));
        let list = documents.docs.map(d => d.data());
    
        return res.status(200).json(list);
    }catch(err){
        return res.status(400).json({error:err.message});
    }
}

exports.getAllAccountsByCustomer = async (req,res) => {
    try{
        let customerAccounts = [];
        let documents = await getDocs(collection(firestore,"accounts"));
        let list = documents.docs.map(d=>d.data());
        list.forEach(account => {
            if(account.customerName == req.params.name){
                customerAccounts.push(account);
            }
        });

        return res.status(200).json(customerAccounts);
    }catch(err){
        return res.status(400).json({error:err.message});
    }
}


exports.deleteAccount = async(req,res) => {
    try{
        await deleteDoc(doc(firestore,"accounts",req.body.accountNumber));
        updateCustomerNetWorth(req.body.customerName);
        res.status(200).json({message:'success'});
    }catch(err){
        return res.status(400).json(err);
    }
}