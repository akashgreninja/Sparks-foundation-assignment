// https://razorpay.com/docs/payments/server-integration/nodejs/payment-gateway/build-integration
// https://www.youtube.com/watch?v=Bagc1ug5rLI&t=1145s
import "./App.css";
import { useEffect, useState } from "react";
import axios  from 'axios'
function App() {
  const [loading, setloading] = useState(false);
  const [orderAmount, setorderAmount] = useState(0);
  const [orders, setorders] = useState([]);
  const host = "http://localhost:5000";

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChange = (e) => {
    setorderAmount(e.target.value);
  };

  const loadRazorpay = async () => {
    console.log("started");
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    console.log("step-1");
    script.onerror = () => {
      alert("Razopay SDK failed ");
    };
    script.onload = async () => {
      try {
        setloading(true);
        console.log("trial-2");
        click_2();

        // console.log(data.body)
      } catch (err) {
        alert(err);
        setloading(false);
      }
    };

    document.body.appendChild(script);
  };
  const click_2 = async (req,res) => {
    const data = await fetch(`${host}/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        amount: orderAmount + "00",
      },
      body:JSON.stringify({ orderAmount:orderAmount+"00" }),
    });
   
    const prob = await data.json();
    console.log(prob);
    console.log("the prob one");
    console.log("step-3");
    const process = await fetch(`${host}/get-razorpay-key`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const thejson = await process.json();
    // console.log(thejson.k);
    const options = {
      key: thejson.key,
      amount: prob.amount,
      currency: prob.currency,
      name: "example",
      desciption: "blah",
      order_id: prob.id,
      
      handler: async function (response) {

        // console.log("hit")
        // const result=await axios.post(`${host}/pay-order`,{
        //     amount: orderAmount,
        //     razorpayPaymentId : response.razorpay_payment_id,
        //     razorpayOrderId: response.razorpay_order_id,
        //     razorpaySignature: response.razorpay_signature,

        // });
        // if(result.data.msg=="success"){
        //   alert(result.data.msg)
        //   console.log(result.data)
        // }else{
        //   alert(response.error.code);
        //   alert(response.error.description);
        //   alert(response.error.source);
        //   alert(response.error.step);
        //   alert(response.error.reason);
        //   alert(response.error.metadata.order_id);
        //   alert(response.error.metadata.payment_id);
        // }
        
        
        const result = await fetch(`${host}/pay-order`, {  
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            amount: orderAmount,
            razorpayPaymentId : response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            
          },
          body:JSON.stringify({amount: orderAmount,razorpayOrderId: response.razorpay_order_id,razorpaySignature: response.razorpay_signature,razorpayPaymentId:response.razorpay_payment_id})
        });
        const tetra=await result.json()
        alert(tetra.msg)
       
        fetchOrders();
      },
     
      prefill: {
        name: "",
        email: "",
        contact: "",
        branch:""
      },
      notes: {
        address: "as",
      },
      theme: {
        color: "#3399cc",
      },
      allow_rotation:true,
      send_sms_hash:true,


    };
    setloading(false);
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const fetchOrders = async (req, res) => {
    console.log("fetch orders")
    const data = await fetch(`${host}/list-orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
   
      },
    });
    const json = await data.json();
    console.log(json + "asas");
    setorders(json);
  };

  return (
    <>
      <div>
        <h1>Razorpay</h1>
        <hr />
        <h2>pay orders</h2>
        <label>
          Amount:{""}
          <input
            type="number"
            placeholder="INR"
            value={orderAmount}
            onChange={handleChange}
          />
        </label>
        <button disabled={loading} onClick={loadRazorpay}>
          Razorpay
        </button>
        {loading && <div>loading---</div>}
      </div>
      <div className="list-order">
        <h2>list-orders</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>AMOUNT</th>
              <th>ISPAID</th>
              <th>RAZORPAY</th>
            </tr>
          </thead>
          <tbody>
            {
              
              orders.map = ((x) => {
              
                return
                <tr key={x.id}>
                  <td>{x._id}</td>
                  <td>{x.amount / 100}</td>
                  <td>{x.ispaid ? "YES" : "NO"}</td>
                  <td>{x.razorpay.paymentId}</td>
                </tr>;
              })
            }
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
