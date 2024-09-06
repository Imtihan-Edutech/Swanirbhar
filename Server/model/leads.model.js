const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const leadsSchema = mongoose.Schema({
    fullname: { type: String },
    email: { type: String },
    mobile: { type: String },
    areasToExplore: { type: String },
    shareAssignmentsThesisExpertise: { type: String },
    qualification: { type: String },
    fieldOfExpertise: { type: String },
    state: { type: String },
    pinCode: { type: String },
    introduction: { type: String },
    interest: { type: String },
    positiveChange: { type: String },
})

leadsSchema.plugin(paginate);
const leadsModel = mongoose.model("Lead", leadsSchema);

module.exports = {
    leadsModel
}