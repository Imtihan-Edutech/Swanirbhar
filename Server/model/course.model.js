    const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const courseSchema = mongoose.Schema({
    courseName: { type: String },
    courseType: { type: String, enum: ['Live Class', 'Video Course', 'Text Course', 'Physical Course'] },
    shortdescription: { type: String },
    description: { type: String },
    category: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    startDate: { type: Date },
    price: { type: Number },
    discount: { type: Number },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    language: { type: String },
    duration: { type: Number },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    status: { type: String, enum: ['Active', 'Pending'], default: 'Pending' },
    enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    hasCompletionCertificate: { type: Boolean, default: false },
    hasAssignments: { type: Boolean, default: false },
    lessons: [{
        title: { type: String },
        videoURL: { type: String }
    }],
    objectives: [{ type: String }],
    thumbnail: { type: String },
    coverImage: { type: String },
    demoVideo: { type: String },
    hasSupport: { type: Boolean, default: false },
    patnerInstructor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tags: [{ type: String }],
    faq: [{
        question: { type: String },
        answer: { type: String }
    }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
        replies: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            comment: { type: String },
            createdAt: { type: Date, default: Date.now }
        }]
    }],
    notes: [{ type: String }]
}, { versionKey: false, timestamps: true });

courseSchema.plugin(paginate);
const courseModel = mongoose.model("Course", courseSchema);

module.exports = {
    courseModel
};