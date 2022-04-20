const express = require('express');
const router = express.Router();
const crafts = require('../controllers/crafts');
const multer = require('multer');
const { storage } = require('../cloudinary');
const uploads = multer({ storage });
const { validateCraft, isLoggedIn, isAuthor } = require('../middlewares');

const catchAsync = require('../utilits/catchAsync');
const { path } = require('express/lib/application');

//Add a Craft
router.post('/', isLoggedIn, uploads.array('image'), validateCraft, catchAsync(crafts.postCraft))

//info/detail page
router.get('/:id', catchAsync(crafts.info))

//Edit Form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(crafts.edit))

//Update Code
router.put('/:id', isLoggedIn, isAuthor, uploads.array('image'), validateCraft, catchAsync(crafts.update))

//Delete
router.delete('/:id', isLoggedIn, crafts.deleteCraft)

module.exports = router;