const express = require('express');
const { validate } = require('../middleware/validate');
const { signup, login, signupSchema, loginSchema } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);

module.exports = router;

