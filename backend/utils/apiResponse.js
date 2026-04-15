export function sendSuccess(res, payload = {}, status = 200) {
  const responseBody = {
    success: true,
    message: payload.message || "Request completed successfully"
  };

  if (payload.data !== undefined) {
    responseBody.data = payload.data;
  }

  if (payload.meta !== undefined) {
    responseBody.meta = payload.meta;
  }

  return res.status(status).json(responseBody);
}