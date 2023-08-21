const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const userAuth = require('../controllers/authController');

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);

router.post('/signup', userAuth.signUp);
router.post('/login', userAuth.logIn);

router.post('/forgetPassword', userAuth.forgetPassword);
router.patch('/resetPassword/:token', userAuth.resetPassword);
router.patch('/updatePassword/:id', userAuth.updatePassword);

module.exports = router;
