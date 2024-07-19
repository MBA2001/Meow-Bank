const {getFirestore,doc,setDoc,getDoc,getDocs,collection,updateDoc,FieldValue} = require('firebase/firestore')
const firestore = getFirestore();

const generateString = require("../util/generateString");


exports.addTransaction = async (req,res)=>{
    
    let newTransaction = {
        customerName: req.body.customerName,
        accountNumber: req.body.accountNumber,
        amount: req.body.amount,
        recieverNumber: req.body.recieverNumber,
        recieverName: req.body.recieverName,
        employeeName: req.body.employeeName,
        type: req.body.type,
        transactionId: generateString(12).trim().trimStart()
    }

    try{

            let checkDoc = await getDoc(doc(firestore,"transactions",newTransaction.transactionId));
            if(checkDoc.exists()){
                newTransaction.accountNumber = generateString(13)
            }
            
            newTransaction.createdAt = new Date().toISOString();
            await setDoc(doc(firestore,"transactions",newTransaction.transactionId),newTransaction);

 
            let document = await getDoc(doc(firestore,"accounts",newTransaction.accountNumber));
            console.log(document);
            let data = document.data();
            console.log(data);
            if(newTransaction.type == "D"){
                await updateDoc(doc(firestore,"accounts",req.body.accountNumber),{accountBalance: Number(data.accountBalance)+Number(newTransaction.amount), numberOfTransactions: data.numberOfTransactions+1});
            }else if(newTransaction.type === "W"){
                await updateDoc(doc(firestore,"accounts",req.body.accountNumber),{accountBalance: Number(data.accountBalance)-Number(newTransaction.amount),numberOfTransactions: data.numberOfTransactions+1});
            }else{
                await updateDoc(doc(firestore,"accounts",req.body.accountNumber),{accountBalance: Number(data.accountBalance)-Number(newTransaction.amount),numberOfTransactions: data.numberOfTransactions+1});
                let document2 = await getDoc(doc(firestore,"accounts",req.body.recieverNumber));
                let data2 = document2.data();
                await updateDoc(doc(firestore,"accounts",req.body.recieverNumber),{accountBalance: Number(data2.accountBalance)+Number(newTransaction.amount),numberOfTransactions: data.numberOfTransactions+1});
            }
            return res.status(200).json({message:"success"});

    }catch(err){
        return res.status(500).json({error:err.message});
    }


}

exports.getTransaction = async (req,res)=>{
    
    try{
        let document = await getDoc(doc(firestore,"transactions",req.params.transactionId));
        console.log(document.data())
        return res.status(200).json(document.data());
    }catch(err){
        return res.status(400).json({error:err.message});
    }
}



exports.getAllTransactions = async (req,res)=>{
    try{

        let documents = await getDocs(collection(firestore,"transactions"));
        let list = documents.docs.map(d => d.data());
    
        return res.status(200).json(list);
    }catch(err){
        return res.status(400).json({error:err.message});
    }
}



exports.getAllTransactionsByAccount = async (req,res) => {
    try{
        let accountTransactions = [];
        let documents = await getDocs(collection(firestore,"transactions"));
        let list = documents.docs.map(d=>d.data());
        list.forEach(transaction => {
            if(transaction.accountNumber == req.params.accountNumber){
                accountTransactions.push(transaction);
            }
        });

        return res.status(200).json(accountTransactions);
    }catch(err){
        return res.status(400).json({error:err.message});
    }
}


exports.getAllTransactionsByCustomer = async (req,res) => {
    try{
        let accountTransactions = [];
        let documents = await getDocs(collection(firestore,"transactions"));
        let list = documents.docs.map(d=>d.data());
        list.forEach(transaction => {
            if(transaction.customerName == req.params.customerName || transaction.recieverName == req.params.customerName){
                accountTransactions.push(transaction);
            }
        });

        return res.status(200).json(accountTransactions);
    }catch(err){
        return res.status(400).json({error:err.message});
    }
}