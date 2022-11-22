const Campground = require('../models/campground');

module.exports.render = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.newRender = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.newCamp = async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground)
    req.flash('success', 'campground made success.');
    res.redirect(`/campgrounds/${campground.id}`);
}

module.exports.showRender = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
    if (!campground) {
        req.flash('error', 'not found this page.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
}

module.exports.editRender = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground })
}
module.exports.editCamp = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs)
    await campground.save()
    req.flash('success', 'campground update success.');
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'campground delete success.');
    res.redirect('/campgrounds');
}