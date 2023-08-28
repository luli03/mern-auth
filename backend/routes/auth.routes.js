const authController = require('../controllers/auth.controller.js');

module.exports = function (app) {
    // user signup
    app.post(
        '/api/v1/auth/signup',
        authController.signup
    )

    // user verify email
    app.post(
        '/api/v1/auth/verify-email',
        authController.verifyEmail
    )

    // user login
    app.post(
        '/api/v1/auth/login',
        authController.login
    )

    // user logout
    app.get(
        '/api/v1/auth/logout',
        authController.logout
    )

    // user forgot password
    app.post(
        '/api/v1/auth/forgot-password',
        authController.forgotPassword
    )

    // user reset password
    app.post(
        '/api/v1/auth/reset-password',
        authController.resetPassword
    )


}