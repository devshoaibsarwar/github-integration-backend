const ExternalAPI = require("./common");
require("dotenv").config();

class GithubService {
  static GITHUB_AUTH_URL = process.env.GITHUB_AUTH_URL;
  static GITHUB_API_URL = process.env.GITHUB_API_URL;
  static GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  static REDIRECT_URI = process.env.REDIRECT_URI;
  static GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

  static authenticateOAuth(githubCode) {
    const requestBody = {
      client_id: this.GITHUB_CLIENT_ID,
      client_secret: this.GITHUB_CLIENT_SECRET,
      code: githubCode,
    };

    return ExternalAPI.postRequest(
      this.GITHUB_AUTH_URL + "/access_token",
      requestBody,
      {
        Accept: "application/json",
      }
    );
  }

  static getUserDetails(accessToken) {
    return ExternalAPI.getRequest(
      `${this.GITHUB_API_URL}/user`,
      {},
      { Authorization: `Bearer ${accessToken}` }
    );
  }

  static revokeUserAccess(accessToken) {
    console.log(accessToken);
    return ExternalAPI.deleteRequest(
      `${this.GITHUB_API_URL}/applications/${this.GITHUB_CLIENT_ID}/grant`,
      {
        headers: {
          ...this.generateBasicAuthHeaders(),
        },
        data: {
          access_token: accessToken,
        },
      }
    );
  }

  static generateBasicAuthHeaders() {
    return {
      Authorization: `Basic ${Buffer.from(
        this.GITHUB_CLIENT_ID + ":" + this.GITHUB_CLIENT_SECRET
      ).toString("base64")}`,
      Accept: "application/vnd.github+json",
    };
  }
}

module.exports = GithubService;
