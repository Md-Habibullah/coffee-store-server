const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// coffeeMaster
// 92wne36Vax6DtW


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bw0ezcs.mongodb.net/?retryWrites=true&w=majority`;

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

        const usersCollection = client.db("coffeeDB").collection("users");
        const coffeesCollection = client.db("coffeeDB").collection("coffees");

        app.get('/coffee', async (req, res) => {
            const cursor = coffeesCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/coffee/:id', async (req, res) => {
            const _id = req.params.id
            const query = { _id: new ObjectId(_id) }
            const result = await coffeesCollection.findOne(query)
            res.send(result)
        })

        app.post('/coffee', async (req, res) => {
            const coffee = req.body
            const result = await coffeesCollection.insertOne(coffee)
            res.send(result)
        })

        app.put('/coffee/:id', async (req, res) => {
            const _id = req.params.id
            const coffee = req.body
            const query = { _id: new ObjectId(_id) }
            const option = { upsert: true }
            const updatedUser = {
                $set: {
                    name: coffee.name,
                    quantity: coffee.quantity,
                    supplier: coffee.supplier,
                    taste: coffee.taste,
                    category: coffee.category,
                    detail: coffee.detail,
                    imgUrl: coffee.imgUrl

                }
            }
            const result = await coffeesCollection.updateOne(query, updatedUser, option)
            res.send(result)
        })

        app.delete('/coffee/:id', async (req, res) => {
            const _id = req.params.id
            const query = { _id: new ObjectId(_id) }
            const result = await coffeesCollection.deleteOne(query)
            res.send(result)
        })



        // user related api's

        app.get('/user', async (req, res) => {
            const cursor = usersCollection.find()
            const result = await cursor.toArray(cursor)
            res.send(result)
        })

        app.post('/user', async (req, res) => {
            const user = req.body
            console.log(user)
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })

        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.deleteOne(query)
            res.send(result)
        })

        app.patch('/user', async (req, res) => {
            const user = req.body
            const filter = { email: user.email }
            const updatedUser = {
                $set: {
                    lastLoggedIn: user.lastLoggedIn
                }
            }
            const result = await usersCollection.updateOne(filter, updatedUser)
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
    res.send('Coffee making server is running')
})

app.listen(port, () => console.log(port))