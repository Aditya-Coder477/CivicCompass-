/**
 * Standardizes API responses across all routes.
 * Improves code quality and ensures consistent data structures for the frontend.
 */
function sendSuccess(res, data, sourceBadge = 'ECI Verified Data') {
  return res.status(200).json({
    success: true,
    ...data,
    sourceBadge
  });
}

function sendError(res, message, statusCode = 400, sourceBadge = 'System Error') {
  return res.status(statusCode).json({
    success: false,
    error: message,
    sourceBadge
  });
}

module.exports = { sendSuccess, sendError };
