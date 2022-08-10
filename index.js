/**
 * Required External Modules
 */

const { json } = require("express");
const express = require("express");
const path = require("path");

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8000";

/**
 *  App Configuration
 */

app.use(express.json());
app.use(express.urlencoded( { extended: false }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

/**
 * Routes Definitions
 */

app.get("/", (req, res) => {
    res.render("index", {
        title: "Index"
    });
});

app.post("/personal-tracker", (req, res) => {
    res.render("personal-tracker", {
        glasses: req.body.select
    });
});

/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
})