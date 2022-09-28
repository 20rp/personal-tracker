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

function fileWriter(water, urine) {
    var dateTime = dt.create();
    var formattedDate = dateTime.format('Y-m-d');
    var formattedTime = dateTime.format('H:M:S');

    const csvWriter = createCsvWriter({
        path: 'C:/Users/MG/code/git/personal-tracker/logs/tracking.csv',
        header: [
            { id: 'date', title: 'Date recorded' },
            { id: 'time', title: 'Time recorded' },
            { id: 'water', title: 'Water intake' },
            { id: 'urine', title: 'Urination' }
        ]
    });

    const data = [
        {
            date: formattedDate,
            time: formattedTime,
            water: water,
            urine: urine
        }
    ]

    csvWriter
        .writeRecords(data)
        .then(() => console.log('The CSV file was written successfully'));
}

function tester() {  
   
    return formattedDt;
}

/**
 * Routes Definitions
 */

app.get("/", (req, res) => {

// if (fs.existsSync(file)) {
//     if (fs.readFileSync(file).length === 0) {
//         fileWriter(header, "w+");
//         fileWriter(newLine, "a+");
//     }
// }

res.render("index", {
    title: "Index"
});
});

app.post("/tester", (req, res) => {
    tester();
})

app.post("/personal-tracker", (req, res) => {
    let glasses = req.body.select;
    let urination;

    if (req.body.boolSelect == 1) {
        urination = "Yes";
    } else {
        urination = "No";
    }

    fileWriter(glasses, urination)

    // if (fs.existsSync(file)) {
    //     if (fs.readFileSync(file).length > 1) {
    //         fileWriter(newLine, "a+");
    //         fileWriter(tabulator + tabulator + glasses, "a+");
    //     }
    // } else {
    //     console.log("File is empty");

    // }

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