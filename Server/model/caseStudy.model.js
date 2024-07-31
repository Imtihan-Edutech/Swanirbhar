const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2")

const caseStudySchema = mongoose.Schema({
    title: { type: String },
    category: { type: String },
    content: { type: String },
    coverImage: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now }
    }],
    videoUrl: { type: String }
}, { versionKey: false, timestamps: true })

caseStudySchema.plugin(paginate)
const caseStudyModel = mongoose.model("CaseStudy", caseStudySchema)

module.exports = {
    caseStudyModel
}
