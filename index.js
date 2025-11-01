const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i90ukok.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    console.log("Connected to MongoDB!");


    const recipeCollection = client.db('recipesBD').collection("recipes")
    const userCollection = client.db('recipesBD').collection("users")


    app.get('/recipes', async (req, res) => {
      const result = await recipeCollection.find().toArray();
      res.send(result);
    })

    app.get('/recipes/:id', async (req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await recipeCollection.findOne(query);
      res.send(result);
    })

    app.post('/recipes', async (req, res) => {
      const newRecipes = req.body;
      console.log(newRecipes)
      const result = await recipeCollection.insertOne(newRecipes)
      res.send(result);
    })

    app.put('/recipes/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const updateRecipe = req.body;
      const updatedDoc = {
        $set: updateRecipe
      }
      const result = await recipeCollection.updateOne(query,updatedDoc);
      res.send(result)

    })

    app.delete('/recipes/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await recipeCollection.deleteOne(query);
      res.send(result)
    })


    // users related api
    app.post('/user',async(req,res) =>{
      const doc =req.body
      const result = await userCollection.insertOne(doc)
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('recipe book is getting')
})

app.listen(port, () => {
  console.log(`recipe book is running port ${port}`)
})