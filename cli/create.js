const firebase = require("firebase-admin");
const firebaseAuth = require("firebase/auth");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6zxrEQocOsB9NVm9oJ9IIaLXPSlBB9qs",
  authDomain: "mit-badbank-83a55.firebaseapp.com",
  projectId: "mit-badbank-83a55",
  storageBucket: "mit-badbank-83a55.appspot.com",
  messagingSenderId: "906511649276",
  appId: "1:906511649276:web:68b5f3e0dd547ce8f1ca79"
};

async function init() {
  try {
    await firebase.auth().setCustomUserClaims('RcmLjfEHxFXWLifkUomkyVwMH1o1', { admin: true })
  } catch (err) {
    console.log(err)
  }

  console.log('Done')
}

init()
