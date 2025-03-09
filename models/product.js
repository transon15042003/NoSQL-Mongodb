//! Sequelize
// const { Sequelize } = require("sequelize");

// // Connect to the database
// const sequelize = require("../utils/database");

// // Define the Product model
// const Product = sequelize.define("product", {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true,
//     },
//     title: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     price: {
//         type: Sequelize.FLOAT,
//         allowNull: false,
//     },
//     imageURL: {
//         type: Sequelize.TEXT,
//         allowNull: false,
//     },
//     description: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
// });

//! MySQL Database
// const db = require("../utils/database");

// module.exports = class Product {
//     constructor(id, title, imageURL, description, price) {
//         this.id = id;
//         this.title = title;
//         this.imageURL = imageURL;
//         this.description = description;
//         this.price = price;
//     }

//     create() {
//         return db.execute(
//             "INSERT INTO products (title, price, description, imageURL) VALUES (?, ?, ?, ?)",
//             [this.title, this.price, this.description, this.imageURL]
//         );
//     }

//     update() {
//         return db.execute(
//             "UPDATE products SET title = ?, price = ?, description = ?, imageURL = ? WHERE products.id = ?",
//             [this.title, this.price, this.description, this.imageURL, this.id]
//         );
//     }

//     static fetchAll() {
//         return db.execute("SELECT * FROM products");
//     }

//     static findById(id) {
//         return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
//     }

//     static deleteById(id) {
//         return db.execute("DELETE FROM products WHERE products.id = ?", [id]);
//     }
// };

const mongodb = require("mongodb");
const { connectDB } = require("../utils/database");

class Product {
    constructor(title, imageURL, description, price, userID) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageURL = imageURL;
        this.userID = userID;
    }

    async create() {
        try {
            const db = await connectDB();
            const result = await db.collection("products").insertOne(this);
            // console.log(result);
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    static async findAll() {
        try {
            const db = await connectDB();
            const products = await db.collection("products").find().toArray();
            return products;
        } catch (error) {
            console.log(error);
        }
    }

    static async findById(id) {
        try {
            const db = await connectDB();
            const product = await db
                .collection("products")
                .findOne({ _id: new mongodb.ObjectId(id) });
            return product;
        } catch (error) {
            console.log(error);
        }
    }

    async update(id) {
        try {
            const db = await connectDB();
            const result = await db
                .collection("products")
                .updateOne({ _id: new mongodb.ObjectId(id) }, { $set: this });
            // console.log(result);
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    static async deleteById(id) {
        try {
            const db = await connectDB();
            const result = await db
                .collection("products")
                .deleteOne({ _id: new mongodb.ObjectId(id) });
            // console.log(result);
            return result;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = Product;
