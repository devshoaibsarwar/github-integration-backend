const { ErrorCodes, ErrorMessages } = require("../../constants");

const RepositoryManager = require("./RepositoryManager");

class RepositoryController {
  static async addRepositoriesDetail(req, res) {
    try {
      const { id } = req.params;

      const { isIncluded } = req.body;
      console.log('test')

      await RepositoryManager.addRepoDetails({ id, isIncluded }, req.user);

      res.json({
        success: true,
      });
    } catch (err) {
      console.log(
        `signUp:: Request to signUp failed. data:: `,
        req.body,
        err
      );

      return res
        .status(err.code || ErrorCodes.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: err.reportError
            ? err.message
            : RepositoryConstants.MESSAGES.SOMETHING_WENT_WRONG,
        });
    }
  }

  static async fetchRepositoriesDetail(req, res) {
    try {
      const { page, pageSize } = req.query

      const details = await RepositoryManager.fetchDetails({ userId: req.user._id, page, pageSize });

      res.json({
        success: true,
        ...details
      });
    } catch (err) {
      console.log(
        `signUp:: Request to signUp failed. data:: `,
        req.body,
        err
      );

      return res
        .status(err.code || ErrorCodes.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: err.reportError
            ? err.message
            : RepositoryConstants.MESSAGES.SOMETHING_WENT_WRONG,
        });
    }
  }

  static async fetchRepositories(req, res) {
    try {
      const { page, pageSize } = req.query;

      const repos = await RepositoryManager.fetchRepositories({
        userId: req.user.userId,
        page,
        pageSize,
      });

      res.json({
        success: true,
        ...repos,
      });
    } catch (err) {
      console.log(`Fetch user repos request failed. data:: `, req.body, err);

      return res.status(err.code || ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.meta?.reportError
          ? err.message
          : ErrorMessages.MESSAGES.SOMETHING_WENT_WRONG,
      });
    }
  }
}

module.exports = RepositoryController;
