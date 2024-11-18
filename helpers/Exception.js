class Exception extends Error {
  constructor(message, code = 500, meta = {}) {
    super(message);
    this.code = code;
    this.meta = meta;
  }
}

export default Exception;
