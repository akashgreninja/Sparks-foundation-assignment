const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const Order = require("../models/schemadb");
const dotenv=require('dotenv')
dotenv.config()
router.get("/get-razorpay-key", (req, res) => {
  res.send({ key: process.env.RAZORPAY_KEY_ID });
});

router.post("/create-order", async (req, res) => {
  const{orderAmount}=req.body
  console.log(orderAmount)
    try{
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });
  const options = {
    amount: orderAmount,
    currency: "INR",
  };
  const order=await instance.orders.create(options);
  if(!order){
    return res.status(400).send("some error occured");
   
  }else{
    res.send(order)
  }


}catch(error){
    return res.status(500).send("some error from our side")
}
});

router.post('/pay-order',async(req,res)=>{
  console.log("payment hit")
    try{
        const{amount,razorpayPaymentId,razorpayOrderId,razorpaySignature}=req.body
        console.log(`this is the amt ${razorpayOrderId}`)
        console.log(`this is the amt ${razorpayPaymentId}`)
        console.log(`this is the amt ${razorpaySignature}`)
        
        const newPayment=Order({
            isPaid:true,
            amount:amount*100,
            razorpay:{
                orderId:razorpayOrderId,
                paymentId:razorpayPaymentId,
                signature:razorpaySignature
            }

        })
        await newPayment.save()
        res.send({msg:"success"})

    }catch(error){
        res.status(500).send("failed boo")

    }
})

router.get('/list-orders',async(req,res)=>{
    const orders=await Order.find()
    res.send(orders)
})

module.exports = router;
