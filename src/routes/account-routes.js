const express = require("express");
const accountRouter = express.Router();
const Joi = require('joi');

const auth = require('../middleware/auth-middleware')

const AccountDAO = require('../models/AccountsDAO');

accountRouter.post("/create", auth.checkIfAuthenticated, async (req, res) => {
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

  try {
    await AccountDAO.create(value.name, value.email, value.password)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }

  return res.status(201).json({ success: 'created user' })
});

accountRouter.post("/find", auth.checkIfAuthenticated, async (req, res) => {
  const requestSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
  });

  const { error, value } = requestSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    const user = await AccountDAO.find(value.email);
    return res.status(200).json({ user: user })
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

accountRouter.get("/all", auth.checkIfAuthenticated, async (req, res) => {
  try {
    const accounts = await AccountDAO.all()
    return res.status(200).json(accounts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

accountRouter.put("/balance", auth.checkIfAuthenticated, async (req, res) => {
  const requestSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    amount: Joi.number().required(),
  });

  console.log(req.userClaims);
  
  const { error, value } = requestSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    const resp = await AccountDAO.update(value.email, value.amount)
    return res.status(200).json({ status: resp })
  } catch (err) {
    return res.send(500).json({ error: err.message });
  }
});

module.exports = accountRouter;