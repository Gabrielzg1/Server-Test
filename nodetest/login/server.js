const express = require('express');
const session = require('express-session');
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require('express-flash');

const initializePassport = require("./passport-config");
initializePassport(
    passport,
    email => users.find(user => user.email === email)
);


const port = 3000;
var path = require('path');
const { application } = require('express');
const app = express();

app.use(session({ secret: "chave", resave: false, saveUninitialized: false }));

const users = [];


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use('/public', express.static(path.join((__dirname), 'public')));
app.set('views', path.join(__dirname, '/views'));


app.get('/', (req, res) => {
    res.render('index');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword

        })
        res.redirect("/login")
    } catch {
        res.redirect("/register")
    }
    console.log(users);
})

app.listen(port, () => {
    console.log("server rodando ---> localhost:3000");
})

