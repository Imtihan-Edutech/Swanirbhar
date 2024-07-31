const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2")

const articleSchema = mongoose.Schema({
    title: { type: String },
    category: { type: String },
    coverImage: { type: String },
    description:{type:String},
    content: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { versionKey: false, timestamps: true })

articleSchema.plugin(paginate)
const articleModel = mongoose.model("Article", articleSchema)

module.exports = {
    articleModel
}
