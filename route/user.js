const express = require('express');
const passport = require('passport');
const router = express.Router();

const users = require('../controller/users')

router.get('/register', users.registerRender)

router.post('/register', users.register)

router.get('/login', users.loginRender)

router.post('/login', passport.authenticate(
    'local',
    {
        failureFlash: true,
        failureRedirect: '/login',
        keepSessionInfo: true
    }),
    users.loginRedirect)

router.get('/logout', users.logout);

module.exports = router;