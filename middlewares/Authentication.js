import { GithubIntegrationHandler } from "../handlers/index.js";
import { ErrorCodes, ErrorMessages } from "../constants/index.js";
import { Exception, Token, Crypotgraphy } from "../helpers/index.js";

class Authentication {
  static async authenticate(req, res, next) {
    try {
      let token = req.headers.authorization
        ? req.headers.authorization.split(" ")
        : null;

      if (!Array.isArray(token) || token.length < 1) {
        throw new Exception(
          ErrorMessages.MESSAGES.TOKEN_IS_INVALID_OR_EXPIRED,
          ErrorCodes.UNAUTHORIZED,
          { reportError: true }
        );
      }

      token = token[1];
      const decoded = Token.verifyToken(token);

      if (!decoded || !decoded._id || !decoded.encryptedToken) {
        throw new Exception(
          ErrorMessages.MESSAGES.TOKEN_IS_INVALID_OR_EXPIRED,
          ErrorCodes.UNAUTHORIZED,
          { reportError: true }
        );
      }

      const user = await GithubIntegrationHandler.getUserDetails({
        _id: decoded._id,
      });

      if (!user) {
        console.log(
          `authenticate:: Token is invalid, no user found. token:: ${token} decoded:: `,
          decoded
        );

        throw new Exception(
          ErrorMessages.MESSAGES.TOKEN_IS_INVALID_OR_EXPIRED,
          ErrorCodes.UNAUTHORIZED,
          { reportError: true }
        );
      }

      const decryptedToken = Crypotgraphy.decrypt(decoded.encryptedToken);
      req.user = { ...user.toJSON(), token: decryptedToken };

      next();
    } catch (error) {
      return res.status(ErrorCodes.UNAUTHORIZED).json({
        message: ErrorMessages.MESSAGES.INVALID_AUTHENTICATION_TOKEN,
      });
    }
  }
}

export default Authentication;
