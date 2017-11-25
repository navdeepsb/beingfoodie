console.log('addData');
var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
var admin = require("firebase-admin");

var FIREBASE_CONFIG = {
    apiKey: "AIzaSyAyFAooF1iadkZFy6jTEVaomIjrNIQsEys",
    authDomain: "foodiedb123.firebaseapp.com",
    databaseURL: "https://foodiedb123.firebaseio.com",
    projectId: "foodiedb123",
    storageBucket: "",
    messagingSenderId: "1000296293894"
};

admin = firebase.initializeApp( FIREBASE_CONFIG );

var db = admin.database();
var ref = db.ref();

var usersRef = ref.child("users");
usersRef.set({
  alanisawesome: {
    date_of_birth: "June 23, 1912",
    full_name: "Alan Turing"
  },
  gracehop: {
    date_of_birth: "December 9, 1906",
    full_name: "Grace Hopper"
  }
});
