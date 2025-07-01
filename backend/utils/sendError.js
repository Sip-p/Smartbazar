// const sendError = (res, statusCode, message) => {
//   return res.status(statusCode).json({
//     success: false,
//     message: message,
//   });
// };

// module.exports = sendError;



module.exports = (res, status, message) => {
  res.status(status).json({ success: false, message });
};