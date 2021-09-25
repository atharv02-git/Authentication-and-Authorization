const express = require('express')
const path = require('path')
const app = express()
const User = require('./models/user');
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

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
    res.redirect('/')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async(req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
        res.send('Logged in Successfully!')
    } else {
        res.send('Invalid credentials!')
    }
})

app.get('/secret', (req, res) => {
    res.send("This is secret!unless you're logged in")
})

app.listen(3000, () => {
    console.log('Listening on port 3000!')
})