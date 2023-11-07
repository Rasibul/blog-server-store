const express = require("express")
const cors = require("cors")
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// midelware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xmelfag.mongodb.net/?retryWrites=true&w=majority`;

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

    const blogsCollection = client.db('blogDB').collection("blogs")
    const wishlistCartCollection = client.db('wishlistCartDB').collection("wishlist")

    app.get("/api/v1/all-blogs", async (req, res) => {
      const cursor = blogsCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post("/api/v1/all-blogs", async (req, res) => {
      const blogs = req.body
      console.log(req.body)
      const result = await blogsCollection.insertOne(blogs)
      res.send(result)
    })

    app.get("/api/v1/all-blogs/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await blogsCollection.findOne(query)
      res.send(result)
    })

    app.put('/api/v1/all-blogs/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateBlog = req.body
      const blog = {
        $set: {
          title: updateBlog.title,
          catageroy: updateBlog.catageroy,
          shortDescription: updateBlog.shortDescription,
          longDescriptio: updateBlog.longDescriptio,
          photo: updateBlog.photo,

        }
      }
      const result = await blogsCollection.updateOne(filter, blog, options)
      res.send(result)
    })

    app.get('/api/v1/wislist', async (req, res) => {
      const result = await wishlistCartCollection.find().toArray()
      res.send(result)
    })


    app.post("/api/v1/wislist", async (req, res) => {
      const wishList = req.body
      console.log(req.body)
      wishList.wishListId = wishList._id
      delete wishList._id
      const result = await wishlistCartCollection.insertOne(wishList)
      res.send(result)
    })

    app.delete('/api/v1/wishlist/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id) }
      const result = await wishlistCartCollection.deleteOne(query)
      res.send(result)
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
  res.send("blog surver is running")
})

app.listen(port, () => {
  console.log(`blog Surver is Running${port}`)
})