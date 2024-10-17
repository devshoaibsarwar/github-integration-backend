const ExternalAPI = require('../services/common')

class PaginationUtil {
  static async fetchPaginatedData(url, headers) {
    let page = 1;
    const result = [];
    while (true) {
      const response = await ExternalAPI.getRequest(
        url,
        { page, per_page: 100 },
        headers
      );

      if (!response.data?.length) {
        break;
      }

      result.push(...response.data);
      page++;
    }

    return result;
  }
}

module.exports = PaginationUtil;