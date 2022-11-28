const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

main().catch(err => console.log('DO NOT CONNECT!!', err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp');
    console.log('MONGO CONNECT!')
}

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const randomPrice = Math.floor(Math.random() * 100);
        const camp = new Campground({
            author: "636c840e410113636fd34876",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: randomPrice,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio quidem, provident quas quibusdam doloribus nihil cumque. Earum, dolores iusto! Quas perferendis id dolore enim doloremque rem nemo repudiandae optio porro!',
            images: [{
                url: "https://res.cloudinary.com/dn8qwg595/image/upload/v1668873048/YelpCamp/oavbnqgz4xyw2u8mmfy4.gif",
                filename: 'YelpCamp/nambtio00qmaydk8e8ug',
            }
            ],
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})