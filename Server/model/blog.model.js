const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2")

const blogSchema = mongoose.Schema({
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
}, { versionKey: false, timestamps: true })

blogSchema.plugin(paginate)
const blogModel = mongoose.model("Blog", blogSchema)

module.exports = {
    blogModel
}
