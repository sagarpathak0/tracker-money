const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./routes/AuthRouter');
const mongoose = require("mongoose");
const Transaction = require("./models/transaction.js");
require("dotenv").config();

require('./models/db');
const PORT = process.env.PORT || 8080 ;

app.use(bodyParser.json());
app.use(cors());
app.use('/auth',AuthRouter)

app.delete("/transactions/:id", async(req,res) =>{
  try{
    const {id} = req.params;
    await Transaction.findByIdAndDelete({_id:id});
    res.json({message:"Transaction deleted"});
  }catch(err){
    console.error('Error in /backend/delete route:', err);
      res.status(500).json({ error: 'Internal server error', details: err.message });
  }
})

app.post("/transaction", async(req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const {user, price, name, description, datetime } = req.body;
    const transaction = await Transaction.create({user, price,name,description,datetime})
    res.json(transaction);
  });
  
  app.get('/transactions/:user', async (req, res) => {
    try {
      
      console.log('Attempting to connect to database...');
      await mongoose.connect(process.env.MONGO_URL);
      console.log('Database connected, fetching transactions...');
      const {user} = req.params;
      const transactions = await Transaction.find({user:user});
      res.json(transactions);
    } catch (error) {
      console.error('Error in /backend/transactions route:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})