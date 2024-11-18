import jsonwebtoken from "jsonwebtoken";
import Crypotgraphy from "./Cryptography.js";

class Token {
  static getAccessToken(user) {
    const { token, ...rest } = user;

    const encryptedToken = Crypotgraphy.encrypt(token);
    let accessToken = jsonwebtoken.sign(
      { ...rest, encryptedToken },
      process.env.SECRET_KEY,
      {
        expiresIn: process.env.LOGIN_TIMEOUT,
      }
    );

    return accessToken;
  }

  static verifyToken(token) {
    try {
      const decodedToken = jsonwebtoken.verify(token, process.env.SECRET_KEY);

      return decodedToken;
    } catch (err) {
      console.log(`Error verifying the jwt token. token:: ${token}`, err);

      return false;
    }
  }
}

export default Token;
