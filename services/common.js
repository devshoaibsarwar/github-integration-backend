import axios from "axios";

class ExternalAPI {
  static getRequest(url, params, headers) {
    return axios.get(url, { params, headers });
  }

  static postRequest(url, data, headers = {}) {
    return axios.post(url, { ...data }, { headers });
  }

  static deleteRequest(url, config) {
    return axios.delete(url, config);
  }
}

export default ExternalAPI;
