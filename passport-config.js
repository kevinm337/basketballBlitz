// Import Firebase and Passport modules
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Strategy as LocalStrategy } from 'passport-local';

// Firebase project configuration
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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Passport initialization function
const initializePassport = (passport) => {
  // Local strategy for authentication
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    // Sign in with email and password using Firebase
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        return done(null, user); // Success
      })
      .catch(error => {
        return done(null, false, { message: error.message }); // Error
      });
  }));

  // Serialize user object to store in session
  passport.serializeUser((user, done) => {
    done(null, user.uid); // User identification for the session
  });

  // Deserialize user object from session
  passport.deserializeUser((uid, done) => {
    // In a real-world app, you would fetch user details from a database using the uid
    done(null, { uid }); // Completes the roundtrip by attaching the user details to the session
  });
};

// Export the initialize function for use in your application setup
export default initializePassport;
