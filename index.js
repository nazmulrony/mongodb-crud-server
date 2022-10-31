const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//mongodb connection

const uri = "mongodb+srv://nhrony:Nhrony469481@cluster1.l4eqjnn.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const userCollection = client.db("nodeMongoCrud").collection("users")
        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })
        //get a user with specific id
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await userCollection.findOne(query)
            res.send(user)
            // console.log(user);
        })
        //post a user
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        })
        //update a user
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const user = req.body;
            console.log(user);
            const options = { upsert: true }
            const updatedUser = {
                $set: {
                    name: user.name,
                    address: user.address,
                    email: user.email,
                }
            }
            const result = await userCollection.updateOne(filter, updatedUser, options);
            console.log(result);
            res.send(result);
        })
        //delete a user with specific id
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }


            const result = await userCollection.deleteOne(query);
            res.send(result);
            console.log(result);
        })

    }
    finally {

    }
}
run().catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send("Hello from MongoDB CRUD server");
})
app.listen(port, () => {
    console.log(`MongoDB CRUD server running at port: ${port}`);
})
