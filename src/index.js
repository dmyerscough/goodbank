const express = require('express');
const cors = require('cors')

const auth = require('./middleware/auth-middleware')
const dal = require('./dal.js');

const app = express();

app.use(cors({origin: ['http://localhost:3000', 'https://mit-goodbank.netlify.app'], optionSuccessStatus:200, credentials:true}));


// create user account
app.get('/account/create/:name/:email/:password', auth.checkIfAuthenticated, (req, res) => {
    // check if account exists
    dal.find(req.params.email).
        then((users) => {

            // if user exists, return error message
            if(users.length > 0){
                console.log('User already in exists');
                res.status(400).send('User already in exists');    
            }
            else{
                // else create user
                dal.create(req.params.name,req.params.email,req.params.password).
                    then((user) => {
                        console.log(user);
                        res.status(200).send(user);            
                    });            
            }
        });
});


// login user 
app.get('/account/login/:email/:password', auth.checkIfAuthenticated, (req, res) => {

    dal.find(req.params.email).
        then((user) => {

            // if user exists, check password
            if(user.length > 0){
                if (user[0].password === req.params.password){
                    res.send(user[0]);
                }
                else{
                    res.send('Login failed: wrong password');
                }
            }
            else{
                res.send('Login failed: user not found');
            }
    });
    
});

// find user account
app.get('/account/find/:email', auth.checkIfAuthenticated, (req, res) => {
    dal.find(req.params.email).
        then((user) => {
            console.log(user);
            res.send(user);
    });
});

// find one user by email - alternative to find
app.get('/account/findOne/:email', auth.checkIfAuthenticated, (req, res) => {
    dal.findOne(req.params.email).
        then((user) => {
            console.log(user);
            res.send(user);
    });
});

// update - deposit/withdraw amount
app.get('/account/update/:email/:amount', auth.checkIfAuthenticated, (req, res) => {
    const amount = Number(req.params.amount);

    dal.update(req.params.email, amount).
        then((response) => {
            console.log(response);
            res.send(response);
    });    
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
  res.send('PING');
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Listening on 0.0.0.0:${PORT}`)
})
