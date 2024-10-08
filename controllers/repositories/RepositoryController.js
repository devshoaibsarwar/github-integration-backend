const { ErrorCodes, ErrorMessages } = require("../../constants");

const RepositoryManager = require("./RepositoryManager");

class RepositoryController {
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
