import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = () => {
  return json({
    status: "healthy",
    service: "lorcana-simulator",
    timestamp: new Date().toISOString(),
  });
};
