const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

app.use(bodyParser.json());

require("./Product");
const Product = mongoose.model("Product");

const MONGO_URI =
    "mongodb+srv://daiki:mql2019mql2020@productsservices-rx9ye.mongodb.net/products?retryWrites=true&w=majority";

mongoose
    .connect(MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log("DB Connected"));

mongoose.connection.on("error", err => {
    console.log(`DB connection error: ${err.message}`);
});

app.get("/", (req, res) => {
    res.send("The main endpoint");
});

app.post("/product", (req, res) => {
    let newProduct = {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
    };

    let product = new Product(newProduct);
    product
        .save()
        .then(() => {
            console.log("New product created!");
        })
        .catch(err => {
            if (err) throw err;
        });
    res.send("New product created with success!");
});

app.get("/products", (req, res) => {
    Product.find()
        .then(products => res.json(products))
        .catch(err => {
            if (err) throw err;
        });
});

app.get("/product/:id", (req, res) => {
    Product.findById(req.params.id)
        .then(product => {
            if (product) res.json(product);
            else res.sendStatus(404);
        })
        .catch(err => {
            if (err) throw err;
        });
});

app.delete("/product/:id", (req, res) => {
    Product.findOneAndRemove(req.params.id)
        .then(() => res.send("Product removed with success"))
        .catch(err => {
            if (err) throw err;
        });
});

app.listen(4545, () => {
    console.log("Server running ... - Products Services");
});
