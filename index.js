const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wjuagmt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const productCollection = client.db('productDB').collection('product')
    const addedCard = client.db('addCardDB').collection('addCard')

    app.get('/brand', async (req, res) => {
      const cursor = productCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/myCard', async(req, res)=>{
      const cardFind= addedCard.find()
      const result = await cardFind.toArray()
      res.send(result)
    })

    app.delete('/myCard/:_id', async(req,res) =>{
      const id = req.params._id;
      const query=  {_id: new ObjectId(id)}
      const result = await addedCard.deleteOne(query)
      res.send(result)
    })

    app.put('/updateCard/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const option = { upsert: true }
      const updateCard = req.body
      const card = {
        $set: {
          name: updateCard.name,
          brand: updateCard.brand,
          type: updateCard.type,
          photo: updateCard.photo,
          price: updateCard.price,
          rating: updateCard.rating,
          description: updateCard.description
        }
      }
      const result = await productCollection.updateOne(filter, card, option)
      res.send(result)
    })

    app.get('/updateCard/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(query)
      res.send(result)
    })

    app.post('/myCard', async (req, res) => {
      const addToCard = req.body;
      const result = await addedCard.insertOne(addToCard)
      res.send(result)
    })


    app.post('/brand', async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('tech and elec server is running')
})

app.listen(port)