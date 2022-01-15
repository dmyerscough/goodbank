const express = require('express');
const cors = require('cors');
const Joi = require('joi');

const auth = require('./middleware/auth-middleware')
const dal = require('./dal.js');

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

const app = express();

app.use(cors({origin: ['http://localhost:3000', 'https://mit-goodbank.netlify.app'], optionSuccessStatus:200, credentials:true}));
app.use(express.json());

// create user account
app.post('/account/create', auth.checkIfAuthenticated, async (req, res) => {
  // Accepted request schema
  const requestSchema = Joi.object({
    name: Joi.string().min(3).required().required(),
    email: Joi.string().required(),
    password: Joi.string().min(1).max(100).required(),
  });

  const { error, value } = requestSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // check if account exists
  try {
    const userExist = await dal.find(value.email)

    if (userExist.length > 0) {
      return res.status(400).send('User already in exists')
    }
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }

  try {
    // # await firebaseAuth.createUserWithEmailAndPassword(firebaseAuth.getAuth(), "bob@example.com", "s4fem0de")
    await firebaseAuth.createUserWithEmailAndPassword(firebaseAuth.getAuth(), value.email, value.password)
    await dal.create(value.name ,value.email, val.password)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }

  return res.status(201).json({ success: 'created user' })
});

// find one user by email - alternative to find
app.get('/account/find', auth.checkIfAuthenticated, async (req, res) => {
  const requestSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
  });

  const { error, value } = requestSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    const user = await dal.findOne(value.email);
    return res.send(200).json({ user: user })
  } catch (err) {
    return res.send(500).json({ error: err.message });
  }
});

// update - deposit/withdraw amount
app.put('/account/balance', auth.checkIfAuthenticated, async (req, res) => {
  const requestSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    amount: Joi.number().required(),
  });

  const { error, value } = requestSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    await dal.update(value.email, value.amount)
    res.status(200).json({ status: `The balance of ${value.amount} was ${value.action}`})
  } catch (err) {
    return res.send(500).json({ error: err.message });
  }
});

// all accounts
app.get('/account/all', auth.checkIfAuthenticated, (req, res) => {
    dal.all().
        then((docs) => {
            console.log(docs);
            res.status(200).json(docs);
    });
});

app.get('/', (req, res) => {
  res.send('OK');
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Listening on 0.0.0.0:${PORT}`)
})
