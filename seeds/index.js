const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Connection open.");
});

function sample(array) {
    return array[Math.floor(Math.random() * array.length)];
}
async function seed() {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const city = sample(cities);
        const campground = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${city.city}, ${city.state}`,
        });
        await campground.save();
    }
}

seed().then(() => {
    db.close();
});
