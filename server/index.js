const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");

const DataModel = require("./models/film.model");

app.use(cors());
app.use(bodyParser.json());

// Stating the path of the uploads directory
const uploadsDir = path.join(__dirname, "/uploads");

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.use("/uploads", express.static(uploadsDir));

const port = 1337;
const dbName = "final-database";

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

//MARK: MongoDB
mongoose
    .connect("mongodb://localhost:27017/" + dbName)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection error", err));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        filename = Date.now() + "-" + file.originalname;
        cb(null, filename);
    },
});

const upload = multer({ storage: storage });

// Error handling middleware
const handleError = (err, res) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
};

// Function to delete image
const deleteImage = (imagePath) => {
    fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting old image:", err);
    });
};

//add
app.post("/films", upload.single("image"), async (req, res) => {
    const incomingData = req.body;
    incomingData.image = req.file.filename;

    try {
        const dataObject = new DataModel(incomingData);
        await dataObject.save();
        res.json({ success: true, message: "Data added successfully!" });
    } catch (error) {
        console.error("Error adding data:", error);
        handleError(error, res);
    }
});

//view
app.get("/films", async (req, res) => {
    try {
        const gotDataList = await DataModel.find();
        res.json(gotDataList);
    } catch (error) {
        console.error("Error getting data:", error);
        handleError(error, res);
    }
});

//edit
app.put("/films/:id", upload.single("image"), async (req, res) => {
    const incomingData = req.body;
    if (req.file) {
        incomingData.image = req.file.filename;
    }

    try {
        const dataObject = await DataModel.findById(req.params.id);
        if (!dataObject) {
            return res.json({ message: "Data not found" });
        }

        // Delete the old image only if a new one has been uploaded
        if (
            req.file &&
            dataObject.image &&
            typeof dataObject.image === "string"
        ) {
            try {
                const imagePath = path.join(uploadsDir, dataObject.image);
                deleteImage(imagePath);
            } catch (urlError) {
                console.error("Error parsing old image URL:", urlError);
            }
        }

        // Update the document and save it
        Object.assign(dataObject, incomingData);
        await dataObject.save();
        res.json({ success: true, message: "Data updated successfully!" });
    } catch (error) {
        handleError(error, res);
    }
});

//delete
app.delete("/films/:id", async (req, res) => {
    try {
        const dataObject = await DataModel.findById(req.params.id);
        if (!dataObject) {
            return res.json({ message: "Data not found" });
        }

        // Delete the image if it exists
        if (dataObject.image && typeof dataObject.image === "string") {
            const imagePath = path.join(uploadsDir, dataObject.image);
            console.log("Deleting image at path:", imagePath);
            deleteImage(imagePath);
        } else {
            console.error("No valid image path found for deletion");
        }

        try {
            await DataModel.deleteOne({ _id: dataObject._id });
        } catch (error) {
            console.error("Error deleting data:", error);
            return res.json({ message: "Error deleting data" });
        }

        res.json({ success: true, message: "Data deleted successfully!" });
    } catch (error) {
        console.error("Error deleting data:", error);
        handleError(error, res);
    }
});
