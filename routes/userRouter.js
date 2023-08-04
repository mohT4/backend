const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const userAuth = require('../controllers/authController');

router.route('/').get(userController.getUser);

router.route('/signup').post(userAuth.signUp);
router.route('/login').post(userAuth.logIn);

router.route('/forgetPassword').post(userAuth.forgetPassword);
router.route('/resetPassword/: token').patch(userAuth.resetPassword);

module.exports = router;
