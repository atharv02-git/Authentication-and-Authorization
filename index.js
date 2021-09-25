const express = require('express')
const path = require('path')
const app = express()
const User = require('./models/user');
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const session = require('express-session')

mongoose.connect('mongodb://localhost:27017/loginDemo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongo connection open');
    }).catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err);
    })


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
    // parsing params

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'notagoodsecret',
    resave: false,
    saveUninitialized: true
}))

// defining middleware
const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login')
    }
    next();
}

app.get('/', (req, res) => {
    res.send('This is my home page!')
})

app.get('/register', (req, res) => {
        res.render('register')
    })
    // setting post route for our form
app.post('/register', async(req, res) => {
    const { password, username } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password: hash
    })
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/login')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async(req, res) => {
    const { username, password } = req.body;
    // const user = await User.findOne({ username });
    // const validPassword = await bcrypt.compare(password, user.password); or
    const foundUser = await User.findAndValidate(username, password);
    if (foundUser) {
        req.session.user_id = foundUser._id;
        res.redirect('/secret')
    } else {
        res.redirect('/login')
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy();
    // or
    // req.session.user_id = null;
    res.redirect('/login')
})

app.get('/secret', requireLogin, (req, res) => {
    res.render('secret')
})

app.get('/topsecret', requireLogin, (req, res) => {
    res.send('This is top Secret')
})

app.listen(3000, () => {
    console.log('Listening on port 3000!')
})