const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken')

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wj7gs.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('manufecturer-tools').collection('tools');

        const partsCollection = client.db('mountain-bicycle').collection('parts')
        const orderCollection = client.db('mountain-bicycle').collection('orders')
        const reviewCollection = client.db('mountain-bicycle').collection('review')
        const profileCollection = client.db('mountain-bicycle').collection('profile')
        const userCollection = client.db('mountain-bicycle').collection('user')



        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN)
            res.send({ result, token });
        });


        app.get('/tools', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.post('/tools', async (req, res) => {
            const newProduct = req.body
            const result = await serviceCollection.insertOne(newProduct)
            res.send(result)
        })
        app.get('/tools/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });
        app.get('/orders', async (req, res) => {
            const result = await orderCollection.find().toArray()
            res.send(result)
        })
        app.get('/order/:id', async (req, res) => {
            const id = req.params.id
            const result = await orderCollection.findOne({ _id: ObjectId(id) })
            res.send(result)
        })
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id
            const result = await orderCollection.deleteOne({ _id: ObjectId(id) })
            res.send(result)
        })
        app.post('/order', async (req, res) => {
            const newData = req.body
            const result = await orderCollection.insertOne(newData)
            res.send({ success: true, result })
        })

        //api for review
        app.get('/review', async (req, res) => {
            const result = await reviewCollection.find().toArray()
            res.send(result)
        })
        app.get('/review/:id', async (req, res) => {
            const id = req.params.id
            const result = await reviewCollection.findOne({ _id: ObjectId(id) })
            res.send(result)
        })
        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id
            const result = await reviewCollection.deleteOne({ _id: ObjectId(id) })
            res.send(result)
        })
        app.post('/review', async (req, res) => {
            const newData = req.body
            const result = await reviewCollection.insertOne(newData)
            res.send({ success: true, result })
        })

        //api for Profile
        app.get('/profile', async (req, res) => {
            const result = await profileCollection.find().toArray()
            res.send(result)
        })
        app.get('/profile/:email', async (req, res) => {
            const email = req.params.email
            const result = await profileCollection.findOne({ email: email })
            res.send(result)
        })
        app.delete('/profile/:email', async (req, res) => {
            const id = req.params.id
            const result = await profileCollection.deleteOne({ _id: ObjectId(id) })
            res.send(result)
        })
        app.put('/profile/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const userRes = await profileCollection.findOne({ email: email })
            if (userRes) {
                const filter = { email: email };
                const options = { upsert: true };
                const others = user.others
                const updateDoc = {
                    $set: others
                };
                const result = await profileCollection.updateOne(filter, updateDoc, options);
                res.send(result)
            }
            else {
                const result = await profileCollection.insertOne(user)
                res.send(result)
            }


        })


    }
    finally {

    }
}


// app.get('/hero', (req, res) => {
//     res.send()
// })

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Database Server is Running !! ${port}`)
})