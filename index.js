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
const header = "    Glasses Drunk   |   Time Drunk  |   Day Drunk";
const newLine = "\n";
const tabulator = "     ";

const file = 'logs/tracking.txt';



/**
 *  App Configuration
 */

app.use(express.json());
app.use(express.urlencoded( { extended: false }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

function fileWriter(content, fileFlag) {
    fs.writeFileSync(file, content, { flag: fileFlag }, err => {
        if (err) {
            console.error(err);
        }
    });
}


/**
 * Routes Definitions
 */

app.get("/", (req, res) => {

if (fs.existsSync(file)) {
    if (fs.readFileSync(file).length === 0) {
        fileWriter(header, "w+");
        fileWriter(newLine, "a+");
    }
}
res.render("index", {
    title: "Index"
});
});

app.post("/personal-tracker", (req, res) => {
    const currentDate = new Date();
    let glasses = req.body.select;

    if (fs.existsSync(file)) {
        if (fs.readFileSync(file).length > 1) {
            fileWriter(newLine, "a+");
            fileWriter(tabulator + tabulator + glasses, "a+");
        }
    } else {
        console.log("File is empty");

    }

    res.render("personal-tracker", {
        glasses: req.body.select,
        title: "Personal Tracker"
    });
});

/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
})