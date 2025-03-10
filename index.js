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
const {signin,signup,getAll,getEmployeeByEmail,signOut,deleteEmployee} = require("./routes/employee");
const {addCustomer,getSingleCustomer,getAllCustomers,deleteCustomer} = require("./routes/customer");
const {addAccount,getAccount,getAllAccounts,getAllAccountsByCustomer,deleteAccount} = require("./routes/account");
const {addTransaction,getTransaction,getAllTransactions,getAllTransactionsByAccount,getAllTransactionsByCustomer} = require("./routes/transaction");
//app initialization
const app = express()
app.use(cors());





//employees
app.post('/login',jsonParser,signin);
app.post('/signup',jsonParser,signup);
app.get('/getall',getAll);
app.get('/getByEmail/:email',getEmployeeByEmail);
app.get('/signout',signOut);
app.delete('/delete/:name',deleteEmployee);

//customer
app.post('/addcustomer',jsonParser, addCustomer);
app.get('/getcustomer/:name',jsonParser,getSingleCustomer);
app.get('/getallcustomers',jsonParser,getAllCustomers);
app.delete('/deletecustomer/:name',deleteCustomer);

//account
app.post('/addaccount',jsonParser, addAccount);
app.get('/getaccount/:accountNumber',jsonParser,getAccount);
app.get('/getallaccounts',jsonParser,getAllAccounts);
app.get('/getbycustomer/:name',jsonParser,getAllAccountsByCustomer);
app.delete('/deleteaccount/:accountNumber',deleteAccount);


//transactions
app.post('/addtransaction',jsonParser,addTransaction);
app.get('/gettransaction/:transactionId',getTransaction);
app.get('/getalltransactions/',getAllTransactions);
app.get('/gettransactionbyaccount/:accountNumber',getAllTransactionsByAccount);
app.get('/gettransactionbycustomer/:customerName',getAllTransactionsByCustomer);

const port = parseInt(process.env.PORT) || 8080
app.listen(port, () => {
  console.log(`Bank app listening on port ${port}`)
})