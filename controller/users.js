const User = require('../models/user');

module.exports.registerRender = (req, res) => {
    res.render('user/register');
}

module.exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash('success', 'wecome to yelpcamp.')
        res.redirect('/campgrounds');
    })
}

module.exports.loginRender = (req, res) => {
    res.render('user/login');
}

module.exports.loginRedirect = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash('success', 'GoodBye!');
        res.redirect('/campgrounds');
    });
}