import express from "express";
import { MongoClient, ObjectId } from "mongodb"
import cors from "cors";
import * as dotenv from 'dotenv';
dotenv.config()
let app = express();
let port = 4000;
// let url = "mongodb://127.0.0.1";
let url = process.env.MONGO_URL;


// app.use(express.limit(100000000));
// app.use(express.bodyParser({ limit: '50mb' }));
app.use(express.json({ limit: '500mb' }));
// app.use(express.urlencoded({ limit: '50mb' }));

let client = new MongoClient(url);
await client.connect()

console.log("Db connected");
app.use(express.json())
app.use(cors())
app.get("/", async (req, res) => {
    res.send("Server startzz 😍💥🎉")

})
app.post("/drawboard", async (req, res) => {
    let check = await client.db("drawboard").collection("canvas").findOne({ name: req.body.name })
    if (check) {
        res.status(404).send({ msg: "This name already used" })

    } else {
        let result = await client.db("drawboard").collection("canvas").insertOne(req.body)
        res.status(200).send({ msg: "Successfully data saved" })

        console.log("Saved");
    };

})
app.get("/drawboard", async (req, res) => {
    let result = await client.db("drawboard").collection("canvas").find().toArray()
    if (result) {
        res.status(200).send(result)
    }

})
app.get("/drawboard/:id", async (req, res) => {
    let result = await client.db("drawboard").collection("canvas").findOne({ _id: new ObjectId(req.params.id) })
    if (result) {
        res.status(200).send(result)
    }

})
app.put("/drawboard/:id", async (req, res) => {
    let result = await client.db("drawboard").collection("canvas").updateOne({ _id: ObjectId(req.params.id) }, req.body)
})
app.delete("/drawboard/:id", async (req, res) => {
    let result = await client.db("drawboard").collection("canvas").deleteOne({ _id: ObjectId(req.params.id) })
})
// comment

// add
app.post("/drawboard/comment/:id", async (req, res) => {
    let data = await client.db("drawboard").collection("canvas").findOne({ _id: ObjectId(req.params.id) })
    let result = await client.db("drawboard").collection("canvas").updateOne({ _id: ObjectId(req.params.id) }, { comment: [...data.comment, req.body.comment] })
})
// edit
app.put("/drawboard/:id", async (req, res) => {
    let result = await client.db("drawboard").collection("canvas").updateOne({ _id: ObjectId(req.params.id) }, { comment: req.body.comment })
})



// pin
// add
app.post("/drawboard/pin/:id", async (req, res) => {
    let data = await client.db("drawboard").collection("canvas").findOne({ _id: ObjectId(req.params.id) })
    let result = await client.db("drawboard").collection("canvas").updateOne({ _id: ObjectId(req.params.id) }, { pin: [...data.comment, req.body.pin] })
})
// edit
app.put("/drawboard/pin/:id", async (req, res) => {
    let result = await client.db("drawboard").collection("canvas").updateOne({ _id: ObjectId(req.params.id) }, { pin: req.body.pin })
})
app.listen(port, () => {
    console.log("App is running successfully");
})