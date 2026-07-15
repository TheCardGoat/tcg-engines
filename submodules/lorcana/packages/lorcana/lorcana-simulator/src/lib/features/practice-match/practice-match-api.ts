import { resolveLorcanaDeckListText } from "@tcg/lorcana-cards";
import { getApiOrigin } from "$lib/config/public-url-config.js";
import { requestJson } from "$lib/data/transport/http-client.js";
import type { PracticeMatchCreationResponse } from "./types.js";
import { getServerApiOrigin } from "@/server/fetch-with-cf";

export interface HistoricDeckEntry {
  cardPublicId: string;
  quantity: number;
}

interface CreatePracticeMatchParams {
  gameType: "lorcana";
  playerDeck: HistoricDeckEntry[];
  botDeck: HistoricDeckEntry[];
}

export async function createPracticeMatch(
  params: CreatePracticeMatchParams,
): Promise<PracticeMatchCreationResponse> {
  const generalApi = getServerApiOrigin(getApiOrigin());
  return requestJson<PracticeMatchCreationResponse>(
    `${generalApi}/v1/games/lorcana/play/practice/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    },
    "Failed to create practice match",
  );
}

/**
 * Convert deck text (newline-separated lines like "4 Card Name - Title")
 * to the HistoricDeck format the API expects.
 *
 * Uses the Lorcana deck list resolver to map display names → card IDs.
 */
export async function deckTextToHistoricDeck(deckText: string): Promise<HistoricDeckEntry[]> {
  const result = await resolveLorcanaDeckListText(deckText);

  if (result.diagnostics.unresolvedNames.length > 0) {
    throw new Error(`Unknown cards: ${result.diagnostics.unresolvedNames.join(", ")}`);
  }

  return result.resolvedCards.map((entry) => ({
    cardPublicId: entry.cardId,
    quantity: entry.quantity,
  }));
}
