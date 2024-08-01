
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://amin:123@cluster0.mub3mdd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    // Connect the client to the server
    await client.connect();

    // Access the collection
    const db = client.db("micheal");
    const collection = db.collection("love Interest");

    // Insert a document
    const result = await collection.insertOne({
      description: "the egyptian girl from the front desk",
      sexuality: "gay",
      age: 17,
      reasonForNotWorkingOut: "delusion of not having enough interest",
      dateAdded: new Date()
    });

    console.log("Inserted document with _id:", result.insertedId);

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } catch (err) {
    console.error("Error occurred:", err);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
