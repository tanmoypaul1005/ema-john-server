const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');



app.use(bodyParser.json());
app.use(cors());

// Database Start
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://emaWatson:EA5gBOboBQnOMnlg@cluster0.nswkl.mongodb.net/emaJohnStor?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStor").collection("products");
  const oderCollection = client.db("emaJohnStor").collection("orders");

app.post('/addProduct',(req, res) => {
    const products=req.body;
    productsCollection.insertMany(products)
    .then(result =>{
        console.log(result.insertedCount)
       res.send(result.insertedCount);
    })
})

app.get('/products', (req, res) => {
    const search=req.query.search;

    productsCollection.find({name:{$regex:search}})
    .toArray((err,documents)=>{
    res.send(documents);
    })  
})


app.get('/product/:key', (req, res) => {
    productsCollection.find({key:req.params.key})
    .toArray((err,documents)=>{
    res.send(documents[0]);
    })  
})


app.post('/productByKeys', (req, res) => {
    const productKeys=req.body;
    productsCollection.find({key:{$in:productKeys}})
    .toArray((err,documents)=>{
    res.send(documents);
    })  
})


app.post('/addOrder',(req, res) => {
    const order=req.body;
    oderCollection.insertOne(order)
    .then(result =>{
        res.send(result.insertedCount>0);
    })
})

});
// Database end


app.get('/', (req, res) => {
    res.send('Hello world')
})

app.listen(5000,()=>{
    console.log('http://localhost:5000')
})