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
  /**
   * Inject a MongoDB connection so each method doesn't have to establish their
   * own connection.
   *
   * @param conn
   * @returns {Promise<void>}
   */
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

  /**
   * Create a users within firebase and setup their initial bank account
   *
   * @param name
   * @param email
   * @param password
   * @returns {Promise<void>}
   */
  static async create(name, email, password) {
    try {
      await firebaseAuth.createUserWithEmailAndPassword(firebaseAuth.getAuth(), email, password);
      await account.insertOne({ name, email, balance: 0});
    } catch (error) {
      throw error;
    }
    return;
  }

  /**
   * Search a user based on their email address
   *
   * @param email
   * @returns {Promise<*>}
   */
  static async find(email) {
    try {
      const person = await account.findOne({ email: email });
      return person;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deposit or withdraw a specific amount from a user
   *
   * @param email
   * @param amount
   * @returns {Promise<string>}
   */
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

  /**
   * Return all accounts
   * 
   * @returns {Promise<*>}
   */
  static async all() {
    try {
      const accounts = await account.find({}).toArray();
      return accounts;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AccountsDAO;