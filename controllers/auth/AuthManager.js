import {
  GithubIntegrationHandler,
  RepositoriesHandler,
} from "../../handlers/index.js";
import { Exception, Token } from "../../helpers/index.js";
import GithubService from "../../services/github.js";
import PaginationUtil from "../../utils/PaginationUtil.js";
import RepositoryUtils from "../../utils/RepositoryUtils.js";
class AuthManager extends PaginationUtil {
  static async signUp(githubCode) {
    const { data: { access_token: accessTokenResponse}} = await GithubService.authenticateOAuth(githubCode);

    if (!accessTokenResponse) {
      throw new Exception(result?.error_description, 500, {
        reportError: true,
      });
    }

    const data = await GithubService.getUserDetails(accessTokenResponse);

    const { id: userId, login: name } = data;

    let user = await GithubIntegrationHandler.getUserDetails({ userId });

    const organizations = await this.fetchPaginatedData(`${process.env.GITHUB_API_URL}/user/orgs`, { Authorization: `Bearer ${accessTokenResponse}`})

    let orgRepositories = []

    for (const organization of organizations) {
      const repositoryList = await this.fetchPaginatedData(`${process.env.GITHUB_API_URL}/orgs/${organization.login}/repos`, { Authorization: `Bearer ${accessTokenResponse}`})

      orgRepositories.push(...repositoryList);
    }

    if (!user) {
      user = await GithubIntegrationHandler.addNewUser({
        userId,
        name,
      });
    }

    const repos = await GithubService.getUserRepositories(
      name,
      accessTokenResponse
    );

    const transformedRepos = RepositoryUtils.transformRepositories(
      [...repos, ...orgRepositories],
      userId
    );
    await RepositoriesHandler.addRepositories(transformedRepos);

    const accessToken = Token.getAccessToken({
      _id: user._id,
      token: accessTokenResponse,
    });

    return { ...user.toObject(), accessToken };
  }
}

export default AuthManager;
