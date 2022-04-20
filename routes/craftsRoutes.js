const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');
const crafts = require('../controllers/crafts');

//Crafts Index
router.get('/', crafts.index)

//Add Listing Form
router.get('/add', isLoggedIn, crafts.addForm)

module.exports = router;