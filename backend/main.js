//express basic
const express = require('express')
const cors = require('cors');


//utils
const config = require('./util/config');


//firebase
const {initializeApp} = require("firebase/app")
initializeApp(config);
const {getFirestore,doc,setDoc,getDoc} = require('firebase/firestore')
const firestore = getFirestore();

//body parser
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

//routes
const {signin,signup,getAll} = require("./routes/employee");
const {addCustomer,getSingleCustomer,getAllCustomers} = require("./routes/customer");
const {addAccount,getAccount,getAllAccounts,getAllAccountsByCustomer} = require("./routes/account");
const {addTransaction,getTransaction,getAllTransactions,getAllTransactionsByAccount,getAllTransactionsByCustomer} = require("./routes/transaction");
//app initialization
const app = express()
app.use(cors());





//employees
app.post('/login',jsonParser,signin);
app.post('/signup',jsonParser,signup);
app.get('/getall',jsonParser,getAll);


//customer
app.post('/addcustomer',jsonParser, addCustomer);
app.get('/getcustomer/:name',jsonParser,getSingleCustomer);
app.get('/getallcustomers',jsonParser,getAllCustomers);

//account
app.post('/addaccount',jsonParser, addAccount);
app.get('/getaccount/:accountNumber',jsonParser,getAccount);
app.get('/getallaccounts',jsonParser,getAllAccounts);
app.get('/getbycustomer/:name',jsonParser,getAllAccountsByCustomer);


//transactions
app.post('/addtransaction',jsonParser,addTransaction);
app.get('/gettransaction/:transactionId',getTransaction);
app.get('/getalltransactions/',getAllTransactions);
app.get('/gettransactionbyaccount/:accountNumber',getAllTransactionsByAccount);
app.get('/gettransactionbycustomer/:customerName',getAllTransactionsByCustomer);

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Bank app listening on port ${port}`)
})