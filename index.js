const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const User = process.env.USERNAME;
const Pass = process.env.PASSWORD;
const port = process.env.PORT || 3000;

// Ensure to replace the database name `registrationFormDB` with your actual database name
const mongoURI = `mongodb+srv://maishivamhoo:uO5mC6n0ofcYupRP@cluster0.lnwfphm.mongodb.net/registrationFormDB?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 5000, // Increase timeout to 5 seconds
    socketTimeoutMS: 45000 // Increase timeout to 45 seconds
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
});

mongoose.set('debug', true); // Enable detailed logging

const RegistrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const Registration = mongoose.model("Registration", RegistrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const ExistingUser = await Registration.findOne({ email });
        if (!ExistingUser) {
            const RegistrationData = new Registration({ name, email, password });
            await RegistrationData.save();
            console.log("Registration successful", RegistrationData);
            res.redirect("/success");
        } else {
            console.log("User already exists");
            res.redirect("/error");
        }
    } catch (error) {
        console.error("Error during registration:", error);
        res.redirect("/error");
    }
});

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/pages/success.html");
});

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
});

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
