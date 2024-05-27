const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");

const DataModel = require("./models/user.model");

app.use(cors());
app.use(bodyParser.json());

const port = 1337;
const jsonFileName = "localfile.json";
const dbName = "final-database";

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

//MARK: JSON

//for adding
app.post("/AddLocal", (req, res) => {
    const incomingData = req.body;

    let existingData = [];

    // Check if the JSON file exists
    if (!fs.existsSync(jsonFileName)) {
        fs.writeFileSync(jsonFileName, JSON.stringify([], null, 2));
        existingData = [];
        return;
    }
    
    // Read the existing data in the JSON file
    try {
        existingData = JSON.parse(fs.readFileSync(jsonFileName));
    } catch (error) {
        console.log("Can't read existing data in json file", error);
        existingData = [];
    }

    const dataIndex = existingData.findIndex(
        (data) => data.id === incomingData.id
    );

    if (dataIndex !== -1) {
        res.json({
            success: false,
            message: "ID already exists in the JSON file",
        });
    } else {
        existingData.push(newData);

        fs.writeFileSync(
            jsonFileName,
            JSON.stringify(existingData, null, 2)
        );

        res.json({ success: true, message: "Data added successfully!" });
    }
});

//for viewing
app.get("/ViewLocal", (req, res) => {

    // Check if the JSON file exists
    if (!fs.existsSync(jsonFileName)) {
        fs.writeFileSync(jsonFileName, JSON.stringify([], null, 2));
        return res.json([]);
    }

    // Read the existing data in the JSON file
    try {
        const existingData = JSON.parse(fs.readFileSync(jsonFileName));
        return res.json(existingData);
    } catch (error) {
        console.error("Error reading existing data:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

//for updating
app.post("/UpdateLocal", async (req, res) => {
    const incomingData = req.body;

    let existingData = [];
    try {
        existingData = JSON.parse(fs.readFileSync(jsonFileName));
    } catch (error) {
        console.log("Can't read existing data in the JSON file", error);
    }

    const dataIndex = existingData.findIndex(
        (data) => data.id === incomingData.id
    );

    if (dataIndex !== -1) {
        existingData[dataIndex] = newData;

        fs.writeFileSync(
            jsonFileName,
            JSON.stringify(existingData, null, 2)
        );

        res.json({ success: true, message: "Data updated successfully!" });
    } else {
        res.json({ success: false, message: "Data specified not found" });
    }
});

//for deleting
app.delete("/DeleteLocal", (req, res) => {
    const incomingData = req.body.id;

    let existingData = [];
    try {
        existingData = JSON.parse(fs.readFileSync(jsonFileName));
    } catch (error) {
        console.log("Can't read existing data in json file", error);
    }

    const dataIndex = existingData.findIndex(
        (data) => data.id === incomingData
    );

    if (dataIndex !== -1) {
        existingData.splice(dataIndex, 1);

        fs.writeFileSync(jsonFileName, JSON.stringify(existingData, null, 2));

        res.json({ success: true, message: "Data deleted successfully!" });
    } else {
        res.json({ success: false, message: "Data not found" });
    }
});

//MARK: MongoDB
mongoose
    .connect("mongodb://localhost:27017/" + dbName)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection error", err));

//add
app.post("/AddEntry", async (req, res) => {
    const incomingData = req.body;

    try {
        const dataObject = new DataModel(incomingData);
        await dataObject.save();
        res.json({ success: true, message: "Data added successfully!" });
    } catch (error) {
        console.error("Error adding data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//view
app.get("/ViewEntries", async (req, res) => {
    try {
        const gotDataList = await DataModel.find();
        res.json(gotDataList);
    } catch (error) {
        console.error("Error getting data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//edit
app.post("/EditEntry", async (req, res) => {
    const incomingData = req.body;

    try {
        const dataObject = await DataModel.findOne({
            email: incomingData.email,
        });
        if (!dataObject) {
            res.json({ success: false, message: "Data not found" });
        } else {
            Object.assign(dataObject, incomingData);
            await dataObject.save();
            res.json({ success: true, message: "Data updated successfully!" });
        }
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//delete
app.delete("/DeleteEntry", async (req, res) => {
    const incomingData = req.body;

    try {
        const dataObject = await DataModel.findOne({
            email: incomingData.email,
        });
        if (!dataObject) {
            res.json({ success: false, message: "Data not found" });
        } else {
            await dataObject.remove();
            res.json({ success: true, message: "Data deleted successfully!" });
        }
    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
