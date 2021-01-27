const admin = require('firebase-admin');
let serviceAccount = require('./lisaServiceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports.db = admin.firestore();

const auth = require('firebase');

var firebaseConfig = "API_KEY_JSON_HERE";

auth.initializeApp(firebaseConfig);

module.exports.auth = auth.auth();

module.exports.firestore = admin.firestore;
