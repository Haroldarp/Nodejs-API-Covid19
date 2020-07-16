const admin = require('firebase-admin');
let serviceAccount = require('./lisaServiceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports.db = admin.firestore();

const auth = require('firebase');

var firebaseConfig = {
  apiKey: "AIzaSyCQ97PI1np3Lvh-PboeR0ms55m8IVIzGlc",
  authDomain: "lisa-vtohee.firebaseapp.com",
  databaseURL: "https://lisa-vtohee.firebaseio.com",
  projectId: "lisa-vtohee",
  storageBucket: "lisa-vtohee.appspot.com",
  messagingSenderId: "87650061864",
  appId: "1:87650061864:web:458887505ff143d0f82f1d"
};

auth.initializeApp(firebaseConfig);

module.exports.auth = auth.auth();