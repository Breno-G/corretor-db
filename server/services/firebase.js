const admin = require("firebase-admin");
const serviceAccount = require("../secrets/firebase-service-account.json");
require("dotenv").config(); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();

module.exports = { admin, db };
