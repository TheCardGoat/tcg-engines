import { readFileSync } from "node:fs";
import {
  createExpertOracleStrategy,
  CYBERPUNK_AUTOMATION_REVISION,
  type DecisionContext,
} from "@tcg/cyberpunk-engine";
import { stableBotHash, type BotMatchRecordV1, type BotStrategyDescriptorV1 } from "@tcg/bot-core";
import { createAuthoredBotLabDecks } from "../../../../../../cyberpunk/tools/ai-runner/src/legal-decks.ts";
import type { BotLabAdapter, BotLabMatchInput } from "../../adapter.ts";
import { NativeEngine, matchCatalog, playerId, semanticNativeHash } from "./native-engine.ts";
import {
  loadReferenceRuntime,
  REFERENCE_ID,
  REFERENCE_URL,
  sha256,
  type NativeAction,
  type Seat,
} from "./runtime.ts";

export const REFERENCE_ADAPTER_VERSION = "choombattler-reference-2";

export function createChoombattlerReferenceAdapter(
  workerPath: string,
  catalogPath: string,
): BotLabAdapter {
  const runtime = loadReferenceRuntime(workerPath, catalogPath);
  const join = matchCatalog(runtime);
  const decks = createAuthoredBotLabDecks();
  const compatible = decks.filter((deck) =>
    [...deck.legends, ...deck.mainDeck].every((id) => join.ownToNative.has(id)),
  );
  const byId = new Map(compatible.map((deck) => [deck.id, deck]));
  const revision = stableBotHash({
    ownRevision: CYBERPUNK_AUTOMATION_REVISION,
    worker: runtime.workerHash,
    sources: [
      "./native-engine.ts",
      "./projection.ts",
      "./runtime.ts",
      "./adapter.ts",
      "../../../../../../cyberpunk/packages/engine/src/automation/search/expert-oracle.ts",
      "../../../../../../cyberpunk/packages/engine/src/automation/search/evaluate-board.ts",
      "../../../../../../cyberpunk/packages/engine/src/automation/search/shared.ts",
      "../../../../../../cyberpunk/packages/engine/src/automation/strategies/greedy.ts",
    ].map((path) => sha256(readFileSync(new URL(path, import.meta.url), "utf8"))),
  });
  const catalogHash = stableBotHash({
    native: runtime.catalogHash,
    join: [...join.ownToNative],
    decks: compatible,
  });
  const descriptor = (id: string): BotStrategyDescriptorV1 | undefined => {
    if (![REFERENCE_ID, "expert-oracle", "default"].includes(id)) return undefined;
    return {
      schemaVersion: 1,
      game: "cyberpunk",
      id,
      label:
        id === REFERENCE_ID
          ? "Choombattler Expert (original worker)"
          : "TCG Online Expert (reference engine)",
      strategyVersion: id === REFERENCE_ID ? `sha256:${runtime.workerHash}` : revision,
      informationPolicy: "oracle",
      cardProfileVersion: runtime.catalogHash,
      // This environment is a reference-engine diagnostic, never a deployment gate.
      productionEligible: false,
    };
  };
  function run(input: BotLabMatchInput): BotMatchRecordV1 {
    const scheduled = input.scheduledMatch;
    const candidateSeat: Seat = scheduled.p1Controller === "candidate" ? 1 : 2;
    const seedHex = sha256(scheduled.seed).slice(0, 8);
    const nativeDeck = (id: string, seat: Seat) => {
      const deck = byId.get(id);
      if (!deck) throw new Error(`Deck is not compatible with the pinned reference catalog: ${id}`);
      const map = (token: string) => {
        const nativeId = join.ownToNative.get(token);
        if (!nativeId) throw new Error(`Reference card missing: ${token}`);
        return nativeId;
      };
      return {
        userId: `reference-p${seat}`,
        legends: deck.legends.map(map),
        deck: deck.mainDeck.map(map),
      };
    };
    const state = runtime.api.setup({
      gameId: `${scheduled.blockId}/${scheduled.legId}`,
      seed: Number.parseInt(seedHex, 16),
      players: { 1: nativeDeck(scheduled.p1DeckId, 1), 2: nativeDeck(scheduled.p2DeckId, 2) },
    });
    const engine = new NativeEngine(state, runtime, join);
    const own = createExpertOracleStrategy();
    let actions = 0;
    let termination: BotMatchRecordV1["termination"] = "max-actions";
    const seen = new Map<string, number>();
    while (actions < 2_000) {
      const actor = runtime.api.actor(engine.state);
      if (actor === null) {
        termination = "rules-win";
        break;
      }
      const hash = semanticNativeHash(engine.state);
      const visits = (seen.get(hash) ?? 0) + 1;
      seen.set(hash, visits);
      if (visits > 3) {
        termination = "repeated-state";
        break;
      }
      const strategyId =
        actor === candidateSeat ? input.candidateManifest.candidateId : input.baselineStrategyId;
      let action: NativeAction;
      try {
        if (strategyId === REFERENCE_ID) action = runtime.decide(engine.state, actor);
        else if (["expert-oracle", "default"].includes(strategyId)) {
          const id = playerId(actor);
          const context: DecisionContext = {
            engine,
            playerId: id,
            view: engine.getFilteredView(id),
            prompt: engine.getPrompt(id),
            rng: () => 0.5,
          };
          // The shipped chooser is unchanged. This facade supplies native
          // legal choices and transitions instead of our production LocalEngine.
          const decision = own.decideAction(context);
          if (decision.kind !== "command") {
            termination = "unsupported-prompt";
            break;
          }
          const native = engine.actionFor(
            { commandID: `${actions}`, move: decision.move, input: { args: decision.args ?? {} } },
            id,
          );
          if (!native) {
            termination = "illegal-command";
            break;
          }
          action = native;
        } else throw new Error(`Unknown reference strategy ${strategyId}`);
        // Match execution and both bots' simulations share this native reducer.
        const next = engine.applyNativeAction(action);
        if (next.error) {
          termination = "illegal-command";
          break;
        }
        actions++;
      } catch (error) {
        throw new Error(
          `Reference match ${scheduled.blockId}/${scheduled.legId} at action ${actions} (${strategyId}): ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
    if (engine.state.status === "finished") termination = "rules-win";
    const winner = engine.state.winner;
    return {
      blockId: scheduled.blockId,
      legId: scheduled.legId,
      seed: scheduled.seed,
      candidateSeat: candidateSeat === 1 ? "p1" : "p2",
      candidateDeckId: candidateSeat === 1 ? scheduled.p1DeckId : scheduled.p2DeckId,
      baselineDeckId: candidateSeat === 1 ? scheduled.p2DeckId : scheduled.p1DeckId,
      winner: winner === null ? null : winner === candidateSeat ? "candidate" : "baseline",
      termination,
      turnCount: engine.state.turnNumber,
      actionCount: actions,
      finalStateHash: stableBotHash(engine.state),
    };
  }
  return {
    game: "cyberpunk",
    adapterVersion: REFERENCE_ADAPTER_VERSION,
    getEngineRevision: () => revision,
    getCardCatalogHash: () => catalogHash,
    getCurrentDefaultStrategyId: () => "expert-oracle",
    getStrategyDescriptor: descriptor,
    getCandidateDescriptor: (manifest) => {
      const value = descriptor(manifest.candidateId);
      if (!value) throw new Error(`Unknown reference candidate ${manifest.candidateId}`);
      if (manifest.informationPolicy !== "oracle")
        throw new Error("Reference comparisons require oracle information");
      return value;
    },
    getPromotionDeckPairs: (suiteId) => {
      const selected = suiteId.startsWith("reference:")
        ? compatible.filter((deck) => deck.id === suiteId.slice("reference:".length))
        : compatible;
      if (selected.length === 0) throw new Error(`No compatible decks for ${suiteId}`);
      return selected.map((deck) => ({ id: `${deck.id}-mirror`, deckA: deck.id, deckB: deck.id }));
    },
    runMatch: run,
    replayMatch: (record, report) => {
      if (
        report.manifest.engineRevision !== revision ||
        report.manifest.cardCatalogHash !== catalogHash ||
        report.manifest.adapterVersion !== REFERENCE_ADAPTER_VERSION
      )
        throw new Error(
          "Reference replay requires the recorded engine, adapter, and catalog versions",
        );
      return run({
        candidateManifest: report.manifest,
        baselineStrategyId: report.baseline.id,
        scheduledMatch: {
          blockId: record.blockId,
          pairId: "replay",
          legId: record.legId,
          seed: record.seed,
          p1Controller: record.candidateSeat === "p1" ? "candidate" : "baseline",
          p2Controller: record.candidateSeat === "p2" ? "candidate" : "baseline",
          p1DeckId: record.candidateSeat === "p1" ? record.candidateDeckId : record.baselineDeckId,
          p2DeckId: record.candidateSeat === "p1" ? record.baselineDeckId : record.candidateDeckId,
        },
      });
    },
    planPromotion: () => {
      throw new Error("Reference-engine benchmarks cannot promote production bots");
    },
    doctor: () => ({
      ok: compatible.length > 0,
      checks: [
        {
          name: "original-worker",
          ok: true,
          detail: `${REFERENCE_URL} sha256:${runtime.workerHash}`,
        },
        {
          name: "native-catalog",
          ok: true,
          detail: `${Object.keys(runtime.catalog).length} cards sha256:${runtime.catalogHash}`,
        },
        {
          name: "compatible-decks",
          ok: compatible.length > 0,
          detail: `${compatible.length}/${decks.length} authored decks`,
        },
        { name: "printed-mismatches", ok: true, detail: join.mismatches.join(", ") || "none" },
        {
          name: "comparison-boundary",
          ok: true,
          detail:
            "Original Choombattler Expert versus our chooser on the reference engine; native prompts are opaque choices. Production promotion disabled.",
        },
      ],
    }),
  };
}
