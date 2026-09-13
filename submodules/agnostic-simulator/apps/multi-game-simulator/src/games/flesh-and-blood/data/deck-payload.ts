import { decodeDeckDocumentFromUrlParam } from "@tcg/game-page-contract";
import {
  DEFAULT_FAB_AUTOMATED_ACTION_STRATEGY_ID,
  getSafeFabAutomatedActionStrategyOption,
} from "@tcg/flesh-and-blood-engine/simulator";
import {
  resolveFabPracticeDeckDocument,
  resolvePracticeDeckSelection,
  type ResolvedPracticeSeat,
} from "./resolve-text-deck";

export type FabPracticeDeckPayloadResult =
  | {
      readonly ok: true;
      readonly player: ResolvedPracticeSeat;
      readonly botStrategyId: string;
      readonly opponent?: ResolvedPracticeSeat;
      readonly seed: string;
    }
  | { readonly ok: false; readonly message: string; readonly details: readonly string[] };

/** Decode the shared URL envelope, then apply FAB's zone topology and card resolver. */
export function resolveFabPracticeDeckPayload(
  search: URLSearchParams,
): FabPracticeDeckPayloadResult | null {
  const encoded = search.get("deck");
  const fixture = search.get("playerFixture");
  if (!encoded && !fixture) return null;
  const seed = search.get("seed") || "fab-practice-import";
  function resolveSeat(document: string | null, fixtureId: string | null, seatSeed: string) {
    if (document && fixtureId) throw new Error("Choose one deck source per seat.");
    if (fixtureId) return resolvePracticeDeckSelection(fixtureId, seatSeed);
    if (!document) throw new Error("Practice deck is missing.");
    const decoded = decodeDeckDocumentFromUrlParam(document);
    if (!decoded.ok) throw new Error(decoded.diagnostics.map((item) => item.message).join(" "));
    return resolveFabPracticeDeckDocument(decoded.document, seatSeed);
  }
  try {
    const player = resolveSeat(encoded, fixture, seed);
    const opponentDeck = search.get("opponentDeck");
    const opponentFixture = search.get("opponentFixture");
    const opponent =
      opponentDeck || opponentFixture
        ? resolveSeat(opponentDeck, opponentFixture, `${seed}:p2`)
        : undefined;
    return {
      ok: true,
      player,
      opponent,
      seed,
      botStrategyId: getSafeFabAutomatedActionStrategyOption(
        search.get("strategy") ?? DEFAULT_FAB_AUTOMATED_ACTION_STRATEGY_ID,
      ).id,
    };
  } catch (error) {
    return {
      ok: false,
      message: "Practice deck cannot be seated.",
      details: [error instanceof Error ? error.message : "Unknown deck error."],
    };
  }
}
