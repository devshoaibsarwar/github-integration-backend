import { RepositoriesHandler, UserRepoHandler } from "../../handlers/index.js";
import { RepositoryEnum } from "../../constants/index.js";
import PaginationUtil from "../../utils/PaginationUtil.js";
import RepositoryUtils from "../../utils/RepositoryUtils.js";
import GithubService from "../../services/github.js";

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

      for (const username of Object.keys(userActivity)) {
        const { commits, issues, prs, id } = userActivity[username];

        await UserRepoHandler.addNewRecord({
          totalIssues: issues,
          totalPRs: prs,
          totalCommits: commits,
          syncedUserId: user.userId,
          repoId: repository.id,
          userId: id,
          username,
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

export default RepositoryManager;
