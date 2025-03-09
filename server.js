const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const { connectDB } = require("./utils/database");

const errorController = require("./controllers/error");

const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Middleware to add user data to requests
app.use(async (req, res, next) => {
    try {
        const user = await User.findById("67cc9484140f474540579ef6");
        if (user) {
            req.user = new User(user.username, user.email, user.cart);
        } else {
            const db = await connectDB();
            const admin = await db.collection("users").insertOne({
                username: "transon",
                email: "son@gmail.com",
                cart: {
                    items: [],
                },
            });
            req.user = new User(admin.username, admin.email, admin.cart);
        }
        next();
    } catch (error) {
        console.log(error);
    }
});

app.use("/admin", adminRoutes);
app.use("/shop", shopRoutes);

app.use(errorController.get404);
connectDB().then((client) => {
    if (client) {
        console.log("Successfully connected to MongoDB");
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } else {
        console.error("Cant connect to MongoDB");
        process.exit(1);
    }
});
