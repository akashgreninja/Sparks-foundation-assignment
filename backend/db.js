const mongoose=require('mongoose')

const database=()=> {
    mongoose.connect('mongodb://localhost:27017/razorpay'),()=>{
        console.log("sucessfully connected ")
    }
}

module.exports=database