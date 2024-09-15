const Razorpay = require("razorpay")
const crypto = require('crypto');
const connection = require("../database/connection")


const razorpay = new Razorpay({
    key_id: "rzp_test_3odnVFzUBOioFh",
    key_secret: "h1Pb26TpVmjw1AIEc2SjFyrf",
  });
  
  // Create Payment Order
  const Razororder = async (req, res) => {
    const { amount } = req.body;
    console.log(amount);
    const options = {
        amount: amount * 100,  // Amount in smallest currency unit
        currency: "INR",
        receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        console.log(order);
        
        res.status(200).json({ message: "Order created", data: order });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error });
    }
};


  
  // Verify Payment
  const Razorpayverify = (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', 'h1Pb26TpVmjw1AIEc2SjFyrf')  // Replace with your actual key secret
      .update(body.toString())
      .digest('hex');
  
    if (expectedSignature === razorpay_signature) {
      // Payment is verified
      const paymentDetails = {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        status: 'paid',
        user_id: req.body.user_id,  // Ensure user_id is included in the request body
      };
      
      // Store payment details in the database
      const sql = 'INSERT INTO payments SET ?';
      connection.query(sql, paymentDetails, (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(200).json({ message: 'Payment verified and saved', data: result });
      });
    } else {
      res.status(400).json({ message: 'Invalid signature' });
    }
  };
  
  
  module.exports = {Razorpayverify , Razororder}