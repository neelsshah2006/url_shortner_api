const sendSuccess = (res, message, data, statusCode) => {
  return res.status(statusCode).json({
    success: true,
    message: message,
    data: data,
    statusCode: statusCode,
    timestamp: new Date().toISOString(),
  });
};

const code = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  404: "NOT_FOUND",
  409: "CONFLICT",
  500: "INTERNAL_SERVER_ERROR",
};

const sendError = (res, message, error, statusCode) => {
  return res.status(statusCode).json({
    success: false,
    message: message,
    error: {
      code: code[statusCode] || "UNKNOWN_ERROR",
      details: error,
    },
    statusCode: statusCode,
    timestamp: new Date().toISOString(),
  });
};

module.exports = { sendSuccess, sendError };
