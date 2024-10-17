const {
  GithubIntegrationHandler,
  RepositoriesHandler,
} = require("../../handlers");
const { Exception, Token } = require("../../helpers");
const GithubService = require("../../services/github");
const PaginationUtil = require("../../utils/PaginationUtil");
const RepositoryUtils = require("../../utils/RepositoryUtils");
class AuthManager extends PaginationUtil {
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

    const organizations = await this.fetchPaginatedData(`${process.env.GITHUB_API_URL}/user/orgs`, { Authorization: `Bearer ${result.access_token}`})

    let orgRepositories = []

    for (const organization of organizations) {
      const repositoryList = await this.fetchPaginatedData(`${process.env.GITHUB_API_URL}/orgs/${organization.login}/repos`, { Authorization: `Bearer ${result.access_token}`})

      orgRepositories.push(...repositoryList);
    }

    if (!user) {
      user = await GithubIntegrationHandler.addNewUser({
        userId,
        name,
      });
    }

    const { data: repos } = await GithubService.getUserRepositories(
      name,
      result.access_token
    );

    const transformedRepos = RepositoryUtils.transformRepositories(
      [...repos, ...orgRepositories],
      userId
    );
    await RepositoriesHandler.addRepositories(transformedRepos);

    const accessToken = Token.getAccessToken({
      _id: user._id,
      token: result.access_token,
    });

    return { ...user.toObject(), accessToken };
  }
}

module.exports = AuthManager;
