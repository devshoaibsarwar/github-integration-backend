const { GithubIntegrationHandler } = require("../../handlers");
const { Exception, Token } = require("../../helpers");
const GithubService = require("../../services/github");
class AuthManager {
  static async signUp(githubCode) {
    const response = await GithubService.authenticateOAuth(githubCode);

    const result = response.data;

    if (result?.error) {
      throw new Exception(result?.error_description, 500, {
        reportError: true,
      });
    }

    const { data } = await GithubService.getUserDetails(result.access_token);

    const { id: userId, login: name } = data;

    let user = await GithubIntegrationHandler.getUserDetails({ userId });

    if (!user) {
      user = await GithubIntegrationHandler.addNewUser({
        userId,
        name,
      });
    }

    const accessToken = Token.getAccessToken({
      _id: user._id,
      token: result.access_token,
    });

    return { ...user.toObject(), accessToken };
  }
}

module.exports = AuthManager;
