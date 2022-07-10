
const express=require('express')
const Razorpay=require('razorpay')
const dotenv=require('dotenv')
var cors = require('cors')
const database = require('./db')

const app=express()
app.use(cors())
app.use(express.json())
dotenv.config()
PORT=5000
database()


app.use(require('./routes/paymentgate'))


app.listen(PORT,()=>{
    console.log(`Example app listening on port http://localhost:${PORT}`)
})