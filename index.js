/**
 * Required External Modules
 */

const { json, res } = require("express");
const express = require("express");
const path = require("path");
const fs = require("fs");
const dt = require("node-datetime");
const mysql = require("mysql");
const session = require("express-session");
const { req } = require("http");
const bp = require("body-parser");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8000";
const file = "logs\\tracking.csv";

/**
 *  App Configuration
 */

app.use(express.json());
app.use(express.urlencoded( { extended: true }));
app.use(session({
    secret: 'Sup3rS3cretS3r1al',
    resave: true,
    saveUninitialized: true
}));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.use(bp.json());
app.use(bp.urlencoded({extended: true}));

const connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: 'theRight3ousFury!',
    database: 'nodelogin'
});


const csvWriter = createCsvWriter({
    path: file,
    header: [
        { id: 'dateTime', title: 'date_and_time_recorded' },
        { id: 'water', title: ' water_intake_glasses' },
        { id: 'urine', title: ' urination' }
    ]
});

function fileWriter(water, urine) {
    var dateTime = dt.create();
    var formattedDate = dateTime.format("Y-m-d'T'H:M:S");

    const data = [
        {
            dateTime: formattedDate, water: water, urine: urine
        }
    ];

    csvWriter
        .writeRecords(data)
        .then(() => console.log('The CSV file was written successfully'));
}

function tester() {
}

/**
 * Routes Definitions
 */

// TODO: Re-route to login page and check if user auth
app.get("/", (req, res) => {

    if (fs.existsSync(file)) {
        console.log("file detected.");
    } else {
        console.log("file not detected.");
    }   

    res.render("login", {
        title: "Login"
    });

    console.log(req.body.username);
});

// http://localhost:3000/auth
app.post("/auth", (req, res) => {


    // // Ensure input fields are not left empty
    // if (username && password) {
    //     // Execute SQL query for login
    //     connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
    //         // If there is an issue with the query, output the error
    //         if (error) throw error;

    //         // If the account exists
    //         if (results.length > 0) {
    //             // Authenticate the user
    //             req.session.loggedIn = true;
    //             req.session.username = username;

    //             // Redirect to home page
    //             res.redirect("/index");
    //         } else {
    //             res.send('Incorrect Username and Password combination.');
    //         }
    //         res.end();
    //     });
    // } else {
    //     res.send("Please enter Username and Password");
    //     res.end();
    // }
});

app.post("/personal-tracker", (req, res) => {
    var glasses = req.body.waterSelect;
    var urination;

    if (req.body.boolSelect == 1) {
        urination = "Yes";
    } else {
        urination = "No";
    }

    fileWriter(glasses, urination);

    res.render("personal-tracker", {
        glasses: glasses,
        urination: urination,
        title: "Personal Tracker"
    });
});

/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Listening to reqs on http://localhost:${port}`);
})