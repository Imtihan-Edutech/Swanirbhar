const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const submissionLinkSchema = new mongoose.Schema({
    description:{type:String},
    link: { type: String },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    submittedAt: { type: Date, default: Date.now }
});


const gradingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    grades: [
        {
            factor: { type: String },
            grade: { type: Number }
        }
    ]
});

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    task:{type:String},
    prerequisites: { type: String },
    submissionMethod: { type: String },
    deadline: { type: String },
    difficulty: { type: String },
    learningSkills: [{ type: String }],
    club: { type: String },
    submissionLink: [submissionLinkSchema],
    grading: [gradingSchema],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},{ versionKey: false, timestamps: true });

projectSchema.plugin(paginate);

const projectModel = mongoose.model("Project", projectSchema);

module.exports = {
    projectModel
};
