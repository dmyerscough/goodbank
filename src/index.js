const MongoClient = require('mongodb').MongoClient;

const express = require('express');
const cors = require('cors');


const AccountsDAO = require('./models/AccountsDAO');
const accountsRoutes = require('./routes/account-routes');

const app = express();

app.use(cors({origin: ['http://localhost:3000', 'https://damian-myerscoughfullstackbankingapplication.netlify.app'], optionSuccessStatus:200, credentials:true}));
app.use(express.json());

app.use("/account", accountsRoutes);

const PORT = process.env.PORT || 8080;

MongoClient.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017',
  { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 25 },
)
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(async client => {
    await AccountsDAO.injectDB(client)
    app.listen(PORT, () => {
      console.log(`Listening on 0.0.0.0:${PORT}`)
    })
  })

