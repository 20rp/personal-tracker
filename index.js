/**
 * Required External Modules
 */

const { json } = require("express");
const express = require("express");
const path = require("path");
const fs = require("fs");

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8000";
const header = "    Glasses Drunk   |   Time Drunk  |   ";
const newLine = "\n";


/**
 *  App Configuration
 */

app.use(express.json());
app.use(express.urlencoded( { extended: false }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

function fileWriter(content, flag) {
    fs.writeFile("./logs/tracking.txt", content, { flag: flag }, err => {
        if (err) {
            console.error(err);
        }
    });
}


/**
 * Routes Definitions
 */

app.get("/", (req, res) => {

// TODO: check for if file is empty, if not write the header.

fileWriter(header, "w+");
fileWriter(newLine, "a+");

    res.render("index", {
        title: "Index"
    });
});

app.post("/personal-tracker", (req, res) => {
    let glasses = req.body.select;

    fileWriter(glasses, "a+");
    fileWriter(newLine, "a+");

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