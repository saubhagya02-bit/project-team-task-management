const ApiError = require("../utils/ApiError");
const { failure } = require("../utils/apiResponse");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return failure(res, err.statusCode, err.message, err.errors);
  }

  if (err.name === "SequelizeValidationError") {
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return failure(res, 422, "Validation failed", errors);
  }
  if (err.name === "SequelizeUniqueConstraintError") {
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: `${e.path} already in use`,
    }));
    return failure(res, 409, "Conflict", errors);
  }
  if (err.name === "SequelizeForeignKeyConstraintError") {
    return failure(res, 400, "Invalid reference to a related resource");
  }

  console.error(err);
  return failure(
    res,
    500,
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message,
  );
};

module.exports = errorHandler;
