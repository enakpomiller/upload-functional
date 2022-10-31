const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/userController');

// forms
router.get('/home',usercontroller.signupform); // signup
router.get('/',usercontroller.view); // view record
router.get('/login',usercontroller.loginform); // login
router.post('/',usercontroller.search);// search ailment 
router.get('/display_result',usercontroller.displayform); // search  form
router.get('/ailment',usercontroller.adminailmentform);



// router for form logic
router.post('/search',usercontroller.search);
router.post('/ailment',usercontroller.adminailment_logic);
router.post('/home',usercontroller.signup_logic);
router.post('/login',usercontroller.login_logic);

module.exports = router;