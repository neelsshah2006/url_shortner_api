const { AppError } = require("../utils/appError.util");
const { sendError } = require("../utils/response.util");

const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    const errorCodeMap = {
      400: "BAD_REQUEST",
      401: "UNAUTHORIZED",
      404: "NOT_FOUND",
      409: "CONFLICT",
      500: "INTERNAL_SERVER_ERROR",
    };

    const errorCode = errorCodeMap[err.statusCode] || "APP_ERROR";

    return sendError(res, err.message, errorCode, err.statusCode, err.stack);
  }

  console.error("Unhandled Error:", err);

  return sendError(
    res,
    "Internal Server Error",
    "INTERNAL_SERVER_ERROR",
    500,
    err.stack
  );
};

module.exports = errorHandler;
