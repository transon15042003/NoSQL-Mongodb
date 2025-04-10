//! MySQL
// const mysql = require("mysql2");

// // Create a new connection
// const pool = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     password: "Linh15042003",
//     database: "shop",
// });

// module.exports = pool.promise();

//! MySQL Sequelize
// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize("shop", "root", "Linh15042003", {
//     host: "localhost",
//     dialect: "mysql",
// });

// module.exports = sequelize;

//! MongoDB
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
    "mongodb+srv://transon15042003:P0ODb9bgG86W8Gm5@cluster0.usy9d.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function connectDB() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
        // Return the db
        const db = client.db();
        return db;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function disconnectDB() {
    try {
        // Close the client connection to the server
        await client.close();
        console.log("Closed connection to MongoDB");
    } catch (error) {
        console.error(error);
    }
}

// Export connectDB and disconnectDB functions
module.exports = {
    connectDB,
    disconnectDB,
};
