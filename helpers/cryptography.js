const crypto = require("crypto");

class Crypotgraphy {
  static algorithm = "aes-256-cbc";
  static key = crypto
    .createHash("sha512")
    .update("secret_key")
    .digest("hex")
    .substring(0, 32);
  static iv = crypto.randomBytes(16);

  static encrypt(text) {
    let cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
      iv: this.iv.toString("hex"),
      encryptedData: encrypted.toString("hex"),
    };
  }

  static decrypt(text) {
    let iv = Buffer.from(text.iv, "hex");
    let encryptedText = Buffer.from(text.encryptedData, "hex");
    let decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}

module.exports = Crypotgraphy;
