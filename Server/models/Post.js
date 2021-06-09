const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        max : 2000,
    },
    img: {
        type: String,
    },
    likes: {
        type: Array,
        default: [],
    }
});
module.exports = mongoose.model("Post",PostSchema);