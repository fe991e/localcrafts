
const baseJoi = require('joi');
const joi = require('joi');
const ExpressErrs = require('./utilits/ExpressErrs');
const sanitizeHTML = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
})
const Joi = baseJoi.extend(extension)

module.exports.craftSchema = Joi.object({
    crafts: Joi.object({
        craftName: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        description: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML()
        //image: Joi.string()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
        review: Joi.object({
            text: Joi.string().required().escapeHTML(),
            rating: Joi.number().required().min(1).max(5)
        }).required()
});

//Generic Fxn for Joi
module.exports.joiSchemaCheck = joiSchemaCheck = (req, res, next, schema) => {
    const { error } = schema.validate(req.body);
    if (error) {
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressErrs(msg, 400)
    }
    next();
}