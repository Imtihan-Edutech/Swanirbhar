const mongoose = require("mongoose")
const paginate = require("mongoose-paginate-v2")

const wishlistSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Courses' }],
})

wishlistSchema.plugin(paginate) 
const wishlistModel = mongoose.model("Wishlist",wishlistSchema);

module.exports = {
    wishlistModel
}