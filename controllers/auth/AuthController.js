import { ErrorMessages } from "../../constants/index.js";
import AuthManager from "./AuthManager.js";

class AuthController {
  static async signUp(req, res) {
    try {
      const { code } = req.body || {};

      const user = await AuthManager.signUp(code);
      res.json({
        success: true,
        data: user,
      });
    } catch (err) {
      console.log(`signUp:: Request to signUp failed. data:: `, req.body, err);

      return res.status(err.code).json({
        success: false,
        message: err.meta?.reportError
          ? err.message
          : ErrorMessages.MESSAGES.SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default AuthController;
