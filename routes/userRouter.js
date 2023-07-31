const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const userAuth = require('../controllers/authController');

router.route('/').get(userController.getUser);

router.route('/signup').post(userAuth.signUp);

module.exports = router;
