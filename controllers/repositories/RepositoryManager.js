const { RepositoriesHandler, UserRepoHandler } = require("../../handlers");
const { RepositoryEnum } = require('../../constants')
const PaginationUtil = require("../../utils/PaginationUtil");

class RepositoryManager extends PaginationUtil {
  static async fetchRepositories(filter) {
    return RepositoriesHandler.getRepositories(filter);
  }

  static async addRepoDetails({ id, ...options }, user) {
    const repository = await RepositoriesHandler.update(id, options);

    if (!options.isIncluded) {
      await UserRepoHandler.deleteRepository(repository.id)

      return
    }

    const newRecord = await UserRepoHandler.addNewRecord({
      totalIssues: 0,
      totalPRs: 0,
      totalCommits: 0,
      repoId: repository.id,
      userId: user.userId,
    });

    const promises = [];

    promises.push(
      this.fetchPaginatedData(
        `${process.env.GITHUB_API_URL}/repos/${repository.username}/${repository.name}/issues`,
        { Authorization: `Bearer ${user.token}` }
      ),
      this.fetchPaginatedData(
        `${process.env.GITHUB_API_URL}/repos/${repository.username}/${repository.name}/commits`,
        { Authorization: `Bearer ${user.token}` }
      ),
      this.fetchPaginatedData(
        `${process.env.GITHUB_API_URL}/repos/${repository.username}/${repository.name}/pulls`,
        { Authorization: `Bearer ${user.token}` }
      )
    );

    Promise.all(promises).then(async ([issues, commits, pulls]) => {
      await UserRepoHandler.updateRecord(newRecord._id, {
        totalIssues: issues.length,
        totalPRs: pulls.length,
        totalCommits: commits.length,
        status: RepositoryEnum.STATUS.SYNCED
      });

      console.log('Data synced succesfully', user._id, repository.id)
    }).catch(async (error) => {
      console.log('Error while syncing', error)
      await UserRepoHandler.updateRecord(newRecord._id, {
        status: RepositoryEnum.STATUS.FAILED
      });
    })

    return '';
  }

  static async fetchDetails(options) {
    return UserRepoHandler.getRepositories(options)
  }
}

module.exports = RepositoryManager;
