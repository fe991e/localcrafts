const mongoose = require('mongoose');
const Crafts = require('../models/craft');
const city = require('./cities');
const {craftN, craftType} = require('./seedHelpers');

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mbxToken});

mongoose.connect('mongodb://localhost:27017/local-crafts');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database Connected");
});

const seedDB = async () => {
    await Crafts.deleteMany({});

    for(let i = 0; i <= 10; i++){

        const randCity = Math.floor(Math.random() * 100);
        const randCraft = Math.floor(Math.random() * 45);
        const loc = `${city[randCity].city}, ${city[randCity].state}`;
        const price = Math.floor(Math.random() * 15) + 15;
        const geoData = await geocoder.forwardGeocode({
            query: loc,
            limit: 1
        }).send();
        const craft = new Crafts({craftName: `${craftN[randCraft]},${craftType[randCraft]}` ,location: loc,
        geometry: geoData.body.features[0].geometry,
        images: [
            {
                url: 'https://res.cloudinary.com/dshie3ran/image/upload/v1649826880/LocalCrafts/xcyqif0jv7g8hm7lv1da.jpg',
                filename: 'LocalCrafts/xcyqif0jv7g8hm7lv1da'
            },
            {
                url: 'https://res.cloudinary.com/dshie3ran/image/upload/v1649662317/LocalCrafts/uqke5yzrksklygzerocu.jpg',
                filename: 'LocalCrafts/uqke5yzrksklygzerocu'
            }
        ],
        description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero harum, obcaecati ullam delectus unde debitis praesentium consectetur qui hic atque, nostrum beatae. Minima sed atque culpa nesciunt voluptas voluptatem neque',
        author: '623a9a0937b4da39a657bbb3',
        price
    });
        await craft.save();
    }
    
}
 seedDB();

//  https://source.unsplash.com/collection/2580789
// https://source.unsplash.com/collection/11410947
// https://source.unsplash.com/collection/10768444