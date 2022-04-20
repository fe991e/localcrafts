const Crafts = require('../models/craft');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mbxToken});

module.exports.index = async (req, res)=>{   
    const crafts = await Crafts.find({});
    res.render('crafts/index', {crafts})
}

module.exports.addForm = (req, res)=>{
    res.render('crafts/add')
}

module.exports.postCraft = async (req, res)=>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.crafts.location,
        limit: 1
    }).send();
    const craft = new Crafts(req.body.crafts);
    craft.geometry = geoData.body.features[0].geometry;
    craft.author = req.user._id;
    craft.images = req.files.map(i => ({url: i.path, filename: i.filename}));
    await craft.save();
    req.flash('success', 'Successfully Added!')
    res.redirect(`craft/${craft._id}`)
}

module.exports.info = async (req, res)=>{   
    const craft = await Crafts.findById(req.params.id)
    .populate({path: 'reviews', populate:{path:'author'}})
    .populate('author');
    if (!craft) {
        req.flash('error', 'Craft not Found!');
        return res.redirect('/crafts')
    }
    res.render('crafts/info', {craft})
}

module.exports.edit = async(req, res)=>{
    const craft = await Crafts.findById(req.params.id);
    res.render('crafts/edit', {craft})
}

module.exports.update = async (req, res)=>{
    const { id } = req.params;
    const craft = await Crafts.findByIdAndUpdate(id, {...req.body.crafts});
    const imgs = req.files.map(i => ({url: i.path, filename: i.filename}));
    craft.images.push(...imgs);
    await craft.save();    
    if (req.body.deleteImages) {
        //delete in cloudinary
        for (let imgFile of req.body.deleteImages) {
            await cloudinary.uploader.destroy(imgFile);
        }
        //delete from mongoDb
        await craft.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Succesfully Updated!');
    res.redirect(`/craft/${craft._id}`)
}

module.exports.deleteCraft = async (req, res) => {
    const {id} = req.params;
    await Crafts.findByIdAndDelete(id);
    req.flash('success', 'Craft Deleted!');
    res.redirect('/crafts')
}