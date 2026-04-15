import { sendSuccess } from "../utils/apiResponse.js";

export function getHealth(req, res) {
  return sendSuccess(
    res,
    {
      message: "Scholastica 3.0 backend is healthy",
      data: {
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        service: "scholastica3.0-api"
      }
    },
    200
  );
}