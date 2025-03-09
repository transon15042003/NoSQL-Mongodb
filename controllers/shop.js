const Product = require("../models/product");

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        res.render("shop/product-list", {
            prods: products,
            pageTitle: "All Products",
            path: "/shop/products",
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getProduct = async (req, res, next) => {
    // Get product's id from the URL
    const productId = req.params.productId;
    try {
        const product = await Product.findById(productId);
        res.render("shop/product-detail", {
            product: product,
            pageTitle: product.title,
            path: "/shop/products",
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getIndex = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        res.render("shop/index", {
            prods: products,
            pageTitle: "Shop",
            path: "/shop",
        });
    } catch (err) {
        console.log(err);
    }
};

exports.getCart = async (req, res, next) => {
    try {
        const cartProducts = await req.user.getCart();
        // console.log(cartProducts);
        res.render("shop/cart", {
            pageTitle: "Your Cart",
            path: "/shop/cart",
            products: cartProducts,
        });
    } catch (err) {
        console.log(err);
        return res.redirect("/shop");
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await req.user.getOrders();
        res.render("shop/orders", {
            pageTitle: "Your Orders",
            path: "/shop/orders",
            orders: orders,
        });
    } catch (err) {
        console.log(err);
    }
};

exports.postAddProductToCart = async (req, res, next) => {
    const productId = req.body.productId;
    try {
        const product = await Product.findById(productId);
        const result = await req.user.addProductToCart(product);
        return result;
    } catch (err) {
        console.log(err);
    } finally {
        res.redirect("/shop/cart");
    }
};

exports.postCreateOrder = async (req, res, next) => {
    try {
        const result = await req.user.createOrder();
        return result;
    } catch (err) {
        console.log(err);
    } finally {
        res.redirect("/shop/orders");
    }
};

exports.postDeleteCartItem = async (req, res, next) => {
    const productId = req.body.productId;
    // console.log(productId);
    try {
        const result = await req.user.deleteProductFromCart(productId);
        return result;
    } catch (err) {
        console.log(err);
    } finally {
        res.redirect("/shop/cart");
    }
};
