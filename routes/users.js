const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users.controller');

router.post('/signup', UsersController.postSignup);
router.post('/login', UsersController.postLogin);

module.exports = router;