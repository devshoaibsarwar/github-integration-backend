import { Octokit } from "@octokit/rest";
import { request } from "@octokit/request";

class GithubService {
  static async authenticateOAuth(githubCode) {
    const authResponse = await request(
      "POST https://github.com/login/oauth/access_token",
      {
        headers: {
          Accept: "application/json",
        },
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: githubCode,
      }
    );

    return authResponse;
  }

  static async getUserDetails(accessToken) {
    const octokit = new Octokit({ auth: accessToken });
    const { data } = await octokit.rest.users.getAuthenticated();
    return data;
  }

  static async getUserRepositories(username, accessToken) {
    const octokit = new Octokit({ auth: accessToken });
    const data = await octokit.paginate(octokit.rest.repos.listForUser, {
      username,
      per_page: 100,
    });
    return data;
  }

  static async synchronizeRepositoriesDetails(payload) {
    return Promise.all([
      this.fetchIssues(payload),
      this.fetchCommits(payload),
      this.fetchPullRequests(payload),
    ]);
  }

  static async fetchIssues({ accesToken, organizationName, repositoryName }) {
    try {
      const octokit = new Octokit({ auth: accesToken });
      const data = await octokit.paginate(octokit.rest.issues.listForRepo, {
        owner: organizationName,
        repo: repositoryName,
        per_page: 100,
      });
      return data;
    } catch (error) {
      console.log("Error while fetching issues");
      throw error;
    }
  }

  static async fetchCommits({ accesToken, organizationName, repositoryName }) {
    try {
      const octokit = new Octokit({ auth: accesToken });
      const data = await octokit.paginate(octokit.rest.repos.listCommits, {
        owner: organizationName,
        repo: repositoryName,
        per_page: 100,
      });
      return data;
    } catch (error) {
      console.log("Error while fetching issues");
      throw error;
    }
  }

  static async fetchPullRequests({
    accesToken,
    organizationName,
    repositoryName,
  }) {
    try {
      const octokit = new Octokit({ auth: accesToken });
      const data = await octokit.paginate(octokit.rest.pulls.list, {
        owner: organizationName,
        repo: repositoryName,
        per_page: 100,
      });
      return data;
    } catch (error) {
      console.log("Error while fetching issues");
      throw error;
    }
  }
}

export default GithubService;
