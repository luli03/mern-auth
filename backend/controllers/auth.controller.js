// models
const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

// Packages
const crypto = require('crypto');
const { StatusCodes } = require('http-status-codes');

// Error Handling
const CustomError = require('../errors');

// Middleware

// utils
const {createHash} = require('../utils');


/**
 * @desc      Register user
 * @route     POST /api/v1/auth/signup
 * @access    Public
 */

exports.signup = async (req, res) => {

    const { username, email, password } = req.body; 
    // check if email is already taken
    const emailAlreadyExists = await User.findOne({ where : {email}});
    if (emailAlreadyExists) {throw new CustomError.BadRequestError('Email already taken')};

    const usernameAlreadyExists = await User.findOne({ where : {username}});
    if (usernameAlreadyExists) {throw new CustomError.BadRequestError('Username already taken')};

    // first registered user is an admin
    const isFirstAccount = (await User.count()) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    // generate token
    const verificationToken = crypto.randomBytes(40).toString('hex');

    let data = {
        username,
        email,
        role,
        password : User.encryptPassword(username+password),
        verificationToken
    }

    // save user
    const user = await User.create(data);

    // send verification email here

    res.status(StatusCodes.CREATED).json({
        msg: 'Success! Please check your email to verify account'
    });
};

/**
 * @desc      Verify user email
 * @route     POST /api/v1/auth/verify-email
 * @access    Public
 */
exports.verifyEmail = async (req, res) => {
    const { verificationToken, email } = req.body;
    
    // check user
    const user = await User.findOne({ where : {email}});

    if (!user || user.verificationToken !== verificationToken) {
        throw new CustomError.UnauthenticatedError('Verification Failed');
    }
    
    // update user 
    user.isVerified = true,
    user.verified_date = Date.now();
    user.verificationToken = '';

    await user.save();

    res.status(StatusCodes.OK).json({ msg: 'Email Verified',  data: user});
    
};

/**
 * @desc      Login User
 * @route     POST /api/v1/auth/login
 * @access    Public
 */

exports.login = async (req, res) => {
    const { user, password } = req.body;

    if (!user || !password) {
        throw new CustomError.BadRequestError('Please provide username/email and password');
    }

    // check username/email exist
    const userExist = await User.findOne({ 
                                where:{
                                    [Op.or]:{
                                        email : user,
                                        username : user
                                    }
                                }
                            });
    
    if(!userExist) throw new CustomError.UnauthenticatedError('Invalid Username/Email or Password');

    // check if password match
    const isPasswordCorrect = await User.comparePassword(userExist.username + password, userExist.password);

    if(!isPasswordCorrect) throw new CustomError.UnauthenticatedError('Invalid Username/Email or Password');
  

    // check if email is verified
    if(!userExist.isVerified) throw new CustomError.UnauthenticatedError('Please verify your email');

    

    sendTokenResponse(userExist, res);
    
};

/**
 * @desc      Logout User
 * @route     POST /api/v1/auth/logout
 * @access    Public
 */

exports.logout = async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    
    res.status(StatusCodes.OK).json({ msg: 'User logged out!' });
};

/**
 * @desc      Forgot User Password
 * @route     POST /api/v1/auth/forgot-password
 * @access    Public
 */

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) throw new CustomError.BadRequestError('Please provide valid email');


    const user = await User.findOne({ where : {email}});

    if(!user) throw new CustomError.UnauthenticatedError("Email doesn't Exists.");

    const passwordToken = crypto.randomBytes(70).toString('hex');

    // send email here

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
   
    res
    .status(StatusCodes.OK)
    .json({ msg: 'Please check your email for reset password link', data:  passwordToken});

};

/**
 * @desc      Reset User Password
 * @route     POST /api/v1/auth/reset-password
 * @access    Public
 */

exports.resetPassword = async (req, res) => {
    const {user, password, token} = req.body;

    if (!token || !user || !password) throw new CustomError.BadRequestError('Please provide valid values');


    // check username/email exist
    const userExist = await User.findOne({ 
                            where:{
                                [Op.or]:{
                                    email : user,
                                    username : user
                                }
                            }
                        });

    if(!userExist) throw new CustomError.UnauthenticatedError("Username/Email doesn't Exists.");

    const currentDate = new Date();

    if (
        userExist.passwordToken === createHash(token) &&
        userExist.passwordTokenExpirationDate > currentDate
      ) {
        userExist.password =  User.encryptPassword(userExist.username+password);
        userExist.passwordToken = null;
        userExist.passwordTokenExpirationDate = null;
        await userExist.save();
      }
   
    res
    .status(StatusCodes.OK)
    .json({ msg: 'Successfully reset password.' });

};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, res) => {
    // Create token
    const token = User.getSignedJwtToken(user.id);
    const oneDay = 1000 * 60 * 60 * 24;

    const options = {
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === 'production',
      signed: true,
      sameSite: 'strict',
      httpOnly: true
    };
  
    res
      .status(StatusCodes.OK)
      .cookie('token', token, options)
      .json({
        token,
        _id: user.id,
        username: user.username,
        email: user.email
      });
};