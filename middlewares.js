const Craft = require('./models/craft');
const Review = require('./models/review');
const {craftSchema, reviewSchema, joiSchemaCheck} = require('./schemas');

module.exports.validateCraft = validateCraft = (req, res, next) => {
    joiSchemaCheck(req, res, next, craftSchema)
}

module.exports.validateReview = validateReview = (req, res, next) => {
    joiSchemaCheck(req, res, next, reviewSchema)
}

//this middleware if not applied to craft info route then returnTo is null
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be Login!')
        return res.redirect('/login')
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const craft = await Craft.findById(id);
    if (!craft.author.equals(req.user._id)) {
        req.flash('error', 'You dont have Permission to do that!');
        return res.redirect(`/craft/${craft._id}`)
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        const {id} = req.params;
        req.flash('error', 'You dont have Permission to do that!');
        return res.redirect(`/craft/${id}`)
    }
    next();
}