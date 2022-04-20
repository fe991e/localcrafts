const User = require('../models/user');

module.exports.regForm = async (req, res) => {
    res.render('user/register')
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({email, username});
        const regUser= await User.register(user, password);
        //Logging in user after Registration
        req.login(regUser, err => {
            if(err) return next(err);
            req.flash('success', `Welcome ${username}!`);
            res.redirect('/crafts')
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
}

module.exports.logForm = async (req, res) => {
    res.render('user/login')
}

module.exports.login = async (req, res) => {
    const {username} = req.body;
    req.flash('success', `Welcome Back ${username}`);
    const redirectUrl = req.session.returnTo || '/crafts';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}

module.exports.logout = async (req, res) => {
    req.logout();
    req.flash('success', 'Logged Out');
    res.redirect('/')
}