const { ErrorCodes, AuthConstants } = require("../../constants");

const AuthManager = require("./AuthManager");

class AuthController {
  static async signUp(req, res) {
    try {
      const { code } = req.body || {};

      const user = await AuthManager.signUp(code);
      console.log(user);
      res.json({
        success: true,
        data: user,
      });
    } catch (err) {
      console.log(`signUp:: Request to signUp failed. data:: `, req.body, err);

      return res.status(err.code).json({
        success: false,
        message: err.meta.reportError
          ? err.message
          : AuthConstants.MESSAGES.SOMETHING_WENT_WRONG,
      });
    }
  }
}

module.exports = AuthController;
