const firebase = require("firebase/app");
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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let account;

class AccountsDAO {
  static async injectDB(conn) {
    if (account) {
      return;
    }
    try {
      account = await conn.db('badbank').collection('users');
    } catch (e) {
      console.error(`Unable to establish collection handles in AccountsDAO: ${e}`);
    }
  }

  static async create(name, email, password) {
    try {
      await firebaseAuth.createUserWithEmailAndPassword(firebaseAuth.getAuth(), email, password);
      await account.insertOne({ name, email, balance: 0});
    } catch (error) {
      throw error;
    }
    return;
  }

  static async find(email) {
    try {
      const person = await account.findOne({ email: email });
    } catch (error) {
      throw error;
    }
    return person;
  }

  static async update(email, amount) {
    try {
      await account.findOneAndUpdate({ email: email }, { $inc: { balance: amount }});
    } catch (error) {
      throw error;
    }

    if (amount < 0)
      return `The balance of ${amount} was withdrawn`
    return `The balance of ${amount} was deposited`
  }

  static async all() {
    try {
      const accounts = await account.find({});
    } catch (error) {
      throw error;
    }
    return accounts;
  }
}

module.exports = AccountsDAO;