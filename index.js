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
    user    : 'dbadmin',
    password: 'm1tarash1',
    database: 'personal-tracker'
});


const csvWriter = createCsvWriter({
    path: file,
    header: [
        { id: 'dateTime', title: 'date_and_time_recorded' },
        { id: 'water', title: ' water_intake_glasses' },
        { id: 'urine', title: ' urination' }
    ]
});


// TODO: Look at writing to a database table instead of a static file.
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

function databaseWriter(query) {
    var query = connection.query(query);

    console.log(query);
}

function tester() {
    databaseWriter("INSERT INTO `personal-tracker`.`personal_tracker` (`ID`, `water_intake`, `urine?`) VALUES (NULL, 8, true);");
}

/*
 * Routes Definitions
 */

app.get("/tester", (req, res) => {
    if (connection) {
        console.log("connection succeeded.", connection);
    } else {
        console.log("database connection failed.");
    }
    tester();
});

app.get("/", (req, res) => {

    if (fs.existsSync(file)) {
        console.log("file detected.");
    } else {
        console.log("file not detected.");
    }   

    res.render("login", {
        title: "Login"
    });
});

app.get("/index", (req, res) => {
    res.render("index", {
        title: "Index - Personal Tracker",
        urination: req.body.urination
    });
});

// TODO: register button
// TODO: Add certificate auth function
// http://localhost:3000/auth
app.post("/auth", (req, res) => {
    username = req.body.username;
    password = req.body.password;
    // Ensure input fields are not left empty
    if (username && password) {
        // Execute SQL query for login
        connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) throw error;

            // If the account exists
            if (results.length > 0) {
                // Authenticate the user
                req.session.loggedIn = true;
                req.session.username = username;

                console.log("Login success");

                // Redirect to home page
                res.redirect("/index");
            } else {
                res.send('Incorrect Username and Password combination.');
            }
            res.end();
        });
    } else {
        res.send("Please enter Username and Password");
        res.end();
    }
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