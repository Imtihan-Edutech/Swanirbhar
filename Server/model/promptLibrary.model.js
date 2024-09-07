const mongoose = require("mongoose");
const paginate = require('mongoose-paginate-v2')

const promptLibrarySchema = mongoose.Schema({
    webScraperOrder: { type: String },
    webScraperStartUrl: { type: String },
    CardHref: { type: String },
    Title: { type: String },
    Description: { type: String },
    Category: { type: String },
    Prompts: [{ type: String }],
    Tips: [{ type: String }],
    Image: { type: String }
});

promptLibrarySchema.plugin(paginate);
const promptLibraryModel = mongoose.model("promptLibrary", promptLibrarySchema);

module.exports = {
    promptLibraryModel
}