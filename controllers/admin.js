const Product = require("../models/product");

exports.getAdminProducts = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        res.render("admin/products", {
            prods: products,
            pageTitle: "Admin Products",
            path: "/admin/products",
        });
    } catch (err) {
        console.log(err);
    }
};

exports.getAddProduct = (req, res, next) => {
    res.render("admin/add-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
    });
};

exports.getEditProduct = async (req, res, next) => {
    // Get product's id from the URL
    const productId = req.params.productId;
    try {
        const product = await Product.findById(productId);
        res.render("admin/edit-product", {
            product: product,
            pageTitle: "Edit Product",
            path: "/admin/products",
        });
    } catch (error) {
        console.log(error);
    }
};

exports.postAddProduct = async (req, res, next) => {
    const { title, imageURL, description, price } = req.body;
    const product = new Product(
        title,
        imageURL,
        description,
        price,
        req.user._id
    );
    try {
        const newProduct = await product.create();
        // console.log(newProduct);
        res.redirect("/admin/products");
    } catch (err) {
        console.log(err);
    }
};

exports.postEditProduct = async (req, res, next) => {
    const { id, title, imageURL, description, price } = req.body;
    try {
        const product = new Product(
            title,
            imageURL,
            description,
            price,
            req.user._id
        );
        const updatedResult = await product.update(id);
        // console.log(updatedResult);
    } catch (error) {
        console.log(error);
    }
    res.redirect("/admin/products");
};

exports.postDeleteProduct = async (req, res, next) => {
    const productId = req.body.productId;
    try {
        const result = await Product.deleteById(productId);
        console.log(result);
        res.redirect("/admin/products");
    } catch (error) {
        console.log(error);
    }
};
