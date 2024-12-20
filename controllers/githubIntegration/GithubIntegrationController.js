import GithubIntegrationManager from "./GithubIntegrationManager.js";
import { ErrorCodes, ErrorMessages } from "../../constants/index.js";

class GithubIntegrationController {
  static async getUserDetails(req, res) {
    try {
      const user = await GithubIntegrationManager.getUser(req.user);
      res.json({
        success: true,
        data: user,
      });
    } catch (err) {
      console.log(
        `Request to fetch user integration failed. userId:: ${req.user.id} user:: ${req.user.email}`,
        err
      );

      return res.status(err.code || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.meta?.reportError
          ? err.message
          : ErrorMessages.MESSAGES.SOMETHING_WENT_WRONG,
      });
    }
  }

  static async deleteUserDetails(req, res) {
    try {
      const user = await GithubIntegrationManager.delete(req.user);

      res.json({
        success: true,
        data: user,
      });
    } catch (err) {
      console.log(
        `Request to delete user integration failed. userId:: ${req.user._id} user:: ${req.user}`,
        err
      );

      return res.status(err.code || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.meta?.reportError
          ? err.message
          : ErrorMessages.MESSAGES.SOMETHING_WENT_WRONG,
      });
    }
  }
}

export default GithubIntegrationController;
