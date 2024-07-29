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
            price: Math.floor(Math.random() * 300) + 50,
            image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg",
            description:
                "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem autem consequatur magni animi facilis, odit numquam culpa nisi magnam totam molestias corrupti mollitia iste placeat, minima quidem sequi, similique voluptatum.",
            author: "66a78017159e30cdd8c7ce85"
        });
        await campground.save();
    }
}

seed().then(() => {
    db.close();
});
