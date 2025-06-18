const sendSuccess = (res, message = "Success", data = {}, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    statusCode,
    timestamp: new Date().toISOString(),
  });
};

const sendError = (
  res,
  message = "Error",
  errorCode = "INTERNAL_SERVER_ERROR",
  statusCode = 500,
  stack = undefined
) => {
  const response = {
    success: false,
    message,
    errorCode,
    statusCode,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "development" && stack) {
    response.stack = stack;
  }

  res.status(statusCode).json(response);
};

module.exports = { sendSuccess, sendError };
