const { validationResult } = require("express-validator");
const { failure } = require("../utils/apiResponse");

const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const formatted = errors.array().map((e) => ({
    field: e.path,
    message: e.msg,
  }));

  return failure(res, 422, "Validation failed", formatted);
};

module.exports = validate;
