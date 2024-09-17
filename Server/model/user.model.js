const mongoose = require("mongoose");
const paginate = require('mongoose-paginate-v2');

const userSchema = new mongoose.Schema({
    fullName: { type: String },
    email: { type: String },
    password: { type: String },
    phoneNumber: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String },
    profilePic: { type: String },
    coverImage: { type: String },
    designation: { type: String },
    bio: { type: String },
    skills: { type: String },
    educations: { type: String },
    experience: { type: String },
    socials: {
        facebook: { type: String },
        linkedin: { type: String },
        github: { type: String },
        twitter: { type: String },
        youtube: { type: String }
    },
    role: {
        type: String,
        enum: ['super-admin', 'admin', 'staff', 'organization', 'entrepreneur', 'freelancer'],
        default: 'freelancer'
    },
    verificationOTP: { type: String },
    resetPasswordOTP: { type: String },
    status: {
        type: String,
        enum: ['active', 'suspended'],
        default: 'active'
    }
}, { versionKey: false, timestamps: true });

userSchema.plugin(paginate);
const userModel = mongoose.model("User", userSchema);

module.exports = {
    userModel
};
