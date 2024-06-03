if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const initializePassport = require('./basketball_blitz/passport-config');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const app = express();

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnohgFGCgzAE6w9JQ6BqQhDtiaucsDB44",
  authDomain: "basketballblitz-aea0a.firebaseapp.com",
  databaseURL: "https://basketballblitz-aea0a-default-rtdb.firebaseio.com",
  projectId: "basketballblitz-aea0a",
  storageBucket: "basketballblitz-aea0a.appspot.com",
  messagingSenderId: "1081763871749",
  appId: "1:1081763871749:web:6e0bc71fec23406d2c706c",
  measurementId: "G-X91LWQHMEZ"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// Set view engine to hbs (Handlebars)
app.set('view engine', 'hbs');

// Middleware setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(methodOverride('_method'));

// Initialize Passport for authentication
initializePassport(passport);

// Home page route (protected)
app.get('/', checkAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

// Login page route
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Registration page route
app.get('/register', checkNotAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Registration handler
app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const { email, password } = req.body;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    await setDoc(doc(db, 'users', uid), {
      email: email
    });
    console.log("User registered and added to Firestore");
    res.redirect('/login');
  } catch (error) {
    console.error("Error", error);
    res.redirect('/register');
  }
});

// Logout handler
app.delete('/logout', (req, res) => {
  req.logOut(function (err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

// Middleware to check if user is authenticated
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Middleware to check if user is not authenticated
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
