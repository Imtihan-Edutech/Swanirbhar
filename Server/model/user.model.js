const mongoose = require("mongoose");
const paginate = require('mongoose-paginate-v2');

const userSchema = new mongoose.Schema({
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    password: { type: String },
    profilePic: { type: String },
    coverImage: { type: String },
    designation: { type: String },
    educations: [{ type: String }],
    skills: [{ type: String }],
    experience: [{ type: String }],
    socials: {
        facebook: { type: String },
        linkedin: { type: String },
        github: { type: String },
        twitter: { type: String },
        youtube: { type: String }
    },
    role: {
        type: String,
        enum: ['admin', 'staff', 'organization', 'entrepreneur', 'user', 'parent'],
        default: 'user'
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    verificationOTP: { type: String },
    resetPasswordOTP: { type: String }
}, { versionKey: false, timestamps: true });

userSchema.plugin(paginate);
const userModel = mongoose.model("User", userSchema);

module.exports = {
    userModel
};
