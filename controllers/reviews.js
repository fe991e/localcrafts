const Review = require('../models/review');
const Crafts = require('../models/craft');

module.exports.postReview = async (req, res)=>{
    const craft = await Crafts.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    craft.reviews.push(review);
    await craft.save();
    await review.save();
    req.flash('success', 'Review Posted!');
    res.redirect(`/craft/${craft._id}`)
}

module.exports.delete = async (req, res)=>{
    const {id, reviewId} = req.params;
    const craft = await Crafts.findByIdAndUpdate(id, { $pull: {reviews: reviewId} });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted!');
    res.redirect(`/craft/${craft._id}`)
}