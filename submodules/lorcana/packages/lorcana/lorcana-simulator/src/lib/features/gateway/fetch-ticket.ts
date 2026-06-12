import { getApiOrigin } from "$lib/config/public-url-config.js";
import { requestJson } from "$lib/data/transport/http-client.js";

export interface GatewayTicketResult {
  ticket: string;
  authToken: string;
}

export async function fetchGatewayTicket(): Promise<GatewayTicketResult | null> {
  try {
    return await requestJson<GatewayTicketResult>(
      `${getApiOrigin()}/v1/gateway/ticket`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      },
      "Failed to fetch gateway ticket",
    );
  } catch {
    return null;
  }
}
