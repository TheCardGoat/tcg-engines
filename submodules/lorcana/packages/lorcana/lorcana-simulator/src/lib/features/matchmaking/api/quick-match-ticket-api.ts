import { getApiOrigin } from "$lib/config/public-url-config.js";
import { requestJson } from "$lib/data/transport/http-client.js";

export interface QuickMatchTicketResult {
  ticket: string;
  authToken: string | null;
}

export async function fetchQuickMatchTicket(
  matchId: string,
  playerId: string,
): Promise<QuickMatchTicketResult | null> {
  try {
    return await requestJson<QuickMatchTicketResult>(
      `${getApiOrigin()}/v1/games/lorcana/play/quick-match/ticket`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, playerId }),
      },
      "Failed to fetch quick match ticket",
    );
  } catch {
    return null;
  }
}
