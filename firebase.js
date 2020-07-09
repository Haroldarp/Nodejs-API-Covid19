const admin = require('firebase-admin');
let serviceAccount = require('./lisaServiceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports.db = admin.firestore();