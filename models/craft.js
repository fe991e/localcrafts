const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
});
//create virtual prop key named thumbnail & Display Image/s As ThumbNail
ImageSchema.virtual('thumbnail').get(function() {
    return  this.url.replace('/upload', '/upload/w_100')
})

const CraftSchema = new Schema({
    craftName: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type:{
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
            type: Schema.Types.ObjectId,
            ref: 'Review'
    }]
});

//Middleware on Deleting Remaining Populated review/s
CraftSchema.post('findOneAndDelete', async function(doc){
    await Review.deleteMany({
        _id: {
            $in: doc.reviews
        }
    })
})

module.exports = mongoose.model('Craft', CraftSchema);