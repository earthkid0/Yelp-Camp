const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controller/campgrounds');


router.get('/', wrapAsync(campgrounds.render))

router.get('/new', isLoggedIn, campgrounds.newRender)

router.post('/', isLoggedIn, upload.array('image'), validateCampground, wrapAsync(campgrounds.newCamp))

router.get('/:id', wrapAsync(campgrounds.showRender))

router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(campgrounds.editRender))

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, wrapAsync(campgrounds.editCamp))

router.delete('/:id', isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCamp))

module.exports = router;