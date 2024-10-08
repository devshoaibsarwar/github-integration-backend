const axios = require("axios");

class ExternalAPI {
  static getRequest(url, params, headers) {
    return axios.get(url, { params, headers });
  }

  static postRequest(url, data, headers = {}) {
    return axios.post(url, { ...data }, { headers });
  }

  static deleteRequest(url, data, headers = {}) {
    return axios.delete(url, { ...data }, { headers });
  }
}

module.exports = ExternalAPI;
