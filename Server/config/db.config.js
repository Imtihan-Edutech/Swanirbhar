const mongoose = require("mongoose");
require("dotenv").config();

const connection  = mongoose.connect("mongodb+srv://pratham11:pratham11@swanirbhar.ofvfqws.mongodb.net/Swanirbhar_LMS?retryWrites=true&w=majority&appName=Swanirbhar")

module.exports={
    connection
}