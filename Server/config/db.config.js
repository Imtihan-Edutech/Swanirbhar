const mongoose = require("mongoose");
require("dotenv").config();

const connection  = mongoose.connect(process.env.MONGO_URL)

// Demo - mongodb+srv://pratham11:pratham11@swanirbhar.ofvfqws.mongodb.net/Swanirbhar_LMS?retryWrites=true&w=majority&appName=Swanirbhar
// Main - mongodb+srv://Swanirbhar:Swan$1234@swanirbhar.9jq5c.mongodb.net/Swanirbhar_CRM?retryWrites=true&w=majority&appName=Swanirbhar

module.exports={
    connection
}