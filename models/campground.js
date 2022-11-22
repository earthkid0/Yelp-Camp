const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

CampgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground.reviews.length) {
        const res = await Review.deleteMany({ _id: { $in: campground.reviews } })
        console.log(res);
    }
})

const Campground = mongoose.model('Campground', CampgroundSchema);

module.exports = Campground;