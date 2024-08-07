const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./review");

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

CampgroundSchema.post("findOneAndDelete", async function (campground) {
    if (campground) {
        await Review.deleteMany({ _id: { $in: campground.reviews } });
    }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
