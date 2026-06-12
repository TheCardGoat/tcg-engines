import { redirect } from "@sveltejs/kit";
import type { ServerLoadEvent } from "@sveltejs/kit";
import { sanitizeDeckText } from "@/features/simulator-devtools/fixtures/fixture-factory.js";
import { DECK_FIXTURES } from "@/features/simulator-devtools/deck-fixtures/index.js";
import { getSafeAutomatedActionStrategyOption } from "@tcg/lorcana-engine";
import type { HumanVsAiMatchConfig } from "@/features/simulator-devtools/vs-ai/types.js";

function decodeDeckParam(value: string): string | null {
  if (!value) return null;
  try {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    return Buffer.from(base64, "base64").toString("utf-8");
  } catch {
    return null;
  }
}

export interface QuickMatchPlayData {
  config: HumanVsAiMatchConfig;
  serverGameId: string | null;
  unknownCards: string[];
  fallbackReason: string | null;
}

export async function load(event: ServerLoadEvent): Promise<QuickMatchPlayData> {
  const { url } = event;

  const rawDeckParam = url.searchParams.get("deck")?.trim() ?? "";
  const opponentFixtureId = url.searchParams.get("opponentFixtureId")?.trim() ?? "";
  const strategyId = url.searchParams.get("strategyId")?.trim() ?? "";
  const seed = url.searchParams.get("seed")?.trim() ?? "";
  const serverGameId = url.searchParams.get("serverGameId")?.trim() || null;
  const unknownCardsParam = url.searchParams.get("unknownCards")?.trim() ?? "";
  const fallbackReason = url.searchParams.get("fallbackReason")?.trim() || null;

  // All params are required — if missing, send back to the creation route
  if (!rawDeckParam || !opponentFixtureId || !strategyId || !seed) {
    redirect(303, "/sandbox/simulator/vs-ai/quick");
  }

  const decoded = decodeDeckParam(rawDeckParam);
  if (!decoded) {
    redirect(303, "/sandbox/simulator/vs-ai/quick");
  }

  const { sanitizedText } = await sanitizeDeckText(decoded);
  if (!sanitizedText) {
    redirect(303, "/sandbox/simulator/vs-ai/quick");
  }

  const opponentFixture = DECK_FIXTURES.find((f) => f.id === opponentFixtureId);
  if (!opponentFixture) {
    redirect(303, "/sandbox/simulator/vs-ai/quick");
  }

  const strategy = getSafeAutomatedActionStrategyOption(strategyId);

  const config: HumanVsAiMatchConfig = {
    playerOneDeckText: sanitizedText,
    playerTwoDeckText: opponentFixture.cards,
    playerTwoFixtureId: opponentFixture.id,
    strategyId: strategy?.id ?? strategyId,
    seed,
  };

  const unknownCards = unknownCardsParam ? unknownCardsParam.split("|") : [];

  return { config, serverGameId, unknownCards, fallbackReason };
}
