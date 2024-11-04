const { RepositoriesHandler, UserRepoHandler } = require("../../handlers");
const { RepositoryEnum } = require("../../constants");
const PaginationUtil = require("../../utils/PaginationUtil");
const RepositoryUtils = require("../../utils/RepositoryUtils");
const GithubService = require("../../services/github");

class RepositoryManager extends PaginationUtil {
  static async fetchRepositories(filter) {
    return RepositoriesHandler.getRepositories(filter);
  }

  static async fetchUserRepos(filter) {
    return UserRepoHandler.getUserRepos(filter);
  }

  static async addRepoDetails({ id, ...options }, user) {
    const repository = await RepositoriesHandler.update(id, options);

    if (!options.isIncluded) {
      await UserRepoHandler.deleteRepository(repository.id);

      return;
    }

    this.backgroundProcess(user, repository)

    return "";
  }

  static async backgroundProcess(user, repository) {
    try {
      const [issues, commits, pulls] =
        await GithubService.synchronizeRepositoriesDetails({
          accesToken: user.token,
          organizationName: repository.username,
          repositoryName: repository.name,
        });

      const commitUsers = RepositoryUtils.separateCommitsByUniqueAuthors(commits);
      const issuesUsers = RepositoryUtils.separatePullsAndIssuesByUniqueAuthors(issues);
      const pullUsers = RepositoryUtils.separatePullsAndIssuesByUniqueAuthors(pulls);

      const userActivity = {};

      function incrementActivity(user, type, value) {
        if (!userActivity[user]) {
          userActivity[user] = { commits: 0, issues: 0, prs: 0, id: value.id };
        }
        userActivity[user][type] = value.count;
      }

      Object.keys(commitUsers).forEach(user => incrementActivity(user, 'commits', commitUsers[user]));
      Object.keys(issuesUsers).forEach(user => incrementActivity(user, 'issues', issuesUsers[user]));
      Object.keys(pullUsers).forEach(user => incrementActivity(user, 'prs', pullUsers[user]));

      for (const user of Object.keys(userActivity)) {
        const { commits, issues, prs, id } = userActivity[user];

        await UserRepoHandler.addNewRecord({
          totalIssues: issues,
          totalPRs: prs,
          totalCommits: commits,
          repoId: repository.id,
          userId: id,
          username: user,
          status: RepositoryEnum.STATUS.SYNCED,
        });
      }

      console.log("Data synced succesfully", user._id, repository.id);


    } catch (error) {
      //TODO: notify user about syncing failure here
      console.log("Error while syncing", error);
    }
  }

  static async fetchDetails(options) {
    return UserRepoHandler.getRepositories(options);
  }

  static async fetchRepoDetails(options) {
    return UserRepoHandler.getUserRepos(options);
  }
}

module.exports = RepositoryManager;
