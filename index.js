const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const cors = require('cors');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n5ckx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {

        await client.connect();
        const database = client.db('travelbdtshirtdb')
        const productsCollection = database.collection("allProducts");
        const reviewsCollection = database.collection("allReviews");
        const ordersCollection = database.collection("allOrders");
        console.log('Mongodb Connect successfully!');

        // get all products
        app.get('/products', async (req, res) => {

            const cursor = productsCollection.find({})
            const packages = await cursor.toArray();
            res.send(packages);
        })

        // add Product
        app.post('/addProduct', async (req, res) => {
            const productDetails = req.body;
            const result = await productsCollection.insertOne(productDetails);
            res.send(result);

        })

        // add Place Order details
        app.post('/addOrder', async (req, res) => {
            const orderDetails = req.body;
            const result = await ordersCollection.insertOne(orderDetails);
            res.send(result);
        })

        // add Review
        app.post('/addReview', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result);
        })

        // get All Review
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({})
            const result = await cursor.toArray();
            res.send(result);
        })

        // find specific order by email
        app.get('/allOrders', (req, res) => {
            ordersCollection.find({ email: req.query.email })
                .toArray((err, documents) => {
                    res.send(documents)
                })
        })

        // delete user order
        app.delete('/allOrders/:id', async (req, res) => {
            // const id = req.query.id
            console.log(req.query._id);
        })



    }
    finally {
        // await client.close();
    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('travelbd-tshirt server is running!')
})

app.listen(port, () => {
    console.log(`Server is running at ${port}`)
})