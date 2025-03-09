const { connectDB } = require("../utils/database");
const mongodb = require("mongodb");

class User {
    constructor(username, email, cart) {
        this.username = username;
        this.email = email;
        this.cart = cart;
    }

    async getCart() {
        try {
            const db = await connectDB();
            const productIds = this.cart.items.map((item) => {
                return item.productId;
            });
            const products = await db
                .collection("products")
                .find({ _id: { $in: productIds } })
                .toArray();
            return products.map((p) => {
                return {
                    ...p,
                    quantity: this.cart.items.find((i) => {
                        return i.productId.toString() === p._id.toString();
                    }).quantity,
                };
            });
        } catch (error) {
            console.log(error);
        }
    }

    async getOrders() {
        try {
            const db = await connectDB();
            const orders = await db
                .collection("orders")
                .find({ "user.username": this.username })
                .toArray();
            // console.log(orders);
            return orders;
        } catch (error) {
            console.log(error);
        }
    }

    async save() {
        try {
            const db = await connectDB();
            const result = await db.collection("users").insertOne(this);
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async addProductToCart(product) {
        const updatedCartItems = [...this.cart.items];
        const cartProductIndex = this.cart.items.findIndex((cp) => {
            return cp.productId.toString() === product._id.toString();
        });
        let newQuantity = 1;

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                productId: new mongodb.ObjectId(product._id),
                quantity: newQuantity,
            });
        }

        const updatedCart = {
            items: updatedCartItems,
        };

        try {
            const db = await connectDB();
            const result = await db
                .collection("users")
                .updateOne(
                    { username: this.username },
                    { $set: { cart: updatedCart } }
                );
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async deleteProductFromCart(productId) {
        const updatedCartItems = this.cart.items.filter((item) => {
            return item.productId.toString() !== productId.toString();
        });

        try {
            const db = await connectDB();
            const result = await db
                .collection("users")
                .updateOne(
                    { username: this.username },
                    { $set: { cart: { items: updatedCartItems } } }
                );
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async createOrder() {
        try {
            const db = await connectDB();
            const cartProducts = await this.getCart();
            const order = {
                items: cartProducts,
                user: {
                    // _id: new mongodb.ObjectId(this._id),
                    username: this.username,
                },
            };
            const result = await db.collection("orders").insertOne(order);
            await db
                .collection("users")
                .updateOne(
                    { username: this.username },
                    { $set: { cart: { items: [] } } }
                );
            this.cart.items = [];
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    static async findById(userId) {
        try {
            const db = await connectDB();
            const user = await db
                .collection("users")
                .findOne({ _id: new mongodb.ObjectId(userId) });
            return user;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

module.exports = User;
