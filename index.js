/**
 * Required External Modules
 */

const { json } = require("express");
const express = require("express");
const path = require("path");
const fs = require("fs");
const dt = require("node-datetime");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8000";
const header = "Glasses Drunk,Time Drunk,Day Drunk";
const newLine = "\n";
const tabulator = "     ";
const file = "C:\\Users\\awotherspoon\\code\\git\\personal-tracker\\logs\\tracking.csv";

/**
 *  App Configuration
 */

app.use(express.json());
app.use(express.urlencoded( { extended: false }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

function fileWriter(water, urine) {
    var dateTime = dt.create();
    var formattedDate = dateTime.format("Y-m-d'T'H:M:S");

    const csvWriter = createCsvWriter({
        path: file,
        header: [
            { id: 'dateTime', title: 'date_and_time_recorded' },
            { id: 'water', title: ', water_intake_glasses' },
            { id: 'urine', title: ', urination' }
        ]
    });

    const data = [
        {
            dateTime: formattedDate,
            water: water,
            urine: urine,
        }
    ];

    csvWriter
        .writeRecords(data)
        .then(() => console.log('The CSV file was written successfully'));
}

function tester() {
    fileWriter("8", "Yes");
}

/**
 * Routes Definitions
 */

app.get("/", (req, res) => {
    if (fs.existsSync(file)) {
        console.log("file detected.");
    } else {
        console.log("file not detected.");
    }   
    res.render("index", {
        title: "Index"});
    });

app.post("/tester", (req, res) => {
    tester();
});

app.post("/personal-tracker", (req, res) => {
    let glasses = req.body.water-select;
    let urination;

    if (req.body.boolSelect == 1) {
        urination = "Yes";
    } else {
        urination = "No";
    }

    fileWriter(glasses, urination);

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