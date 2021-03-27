const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const password = 'habib107';
const uri = "mongodb+srv://organicUser:habib107@cluster0.u3b1e.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:false}))
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))


app.get('/',(req , res) =>{
 res.sendFile(__dirname+'/index.html')
})

client.connect(err => {
  const collection = client.db("organicdb").collection("products");


app.get('/product',(req,res)=>{
  collection.find({})
  .toArray((err, documents)=>{
    res.send(documents)
  })
})
app.get('/product/:id',(req,res)=>{
  collection.find({_id: ObjectId(req.params.id)})
  .toArray((err, documents)=>{
    res.send(documents[0])
  })
})

app.post('/addproduct',(req, res)=>{
  const pp = req.body;
  collection.insertOne(pp)
  .then(result=>{
    console.log('added successfilly')
    res.redirect('/')
  })
})


  // perform actions on the collection object
  // const product ={name:'modhy',price:245,quantity:100}
  // collection.insertOne(product)
  // .then(result => {
  //   console.log("One product added")
  // })
  // console.log("connected")


  app.patch('/update/:id', (req ,res)=>{
    collection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price : req.body.price , quantity: req.body.quantity}
    })
    .then( result=>{
      res.send(result.modifiedCount > 0)
    }) 
  })

  app.delete('/delete/:id',(req,res) =>{
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result=>{
      res.send(result.deletedCount > 0)
    }) 
  })
});
app.listen(3000)