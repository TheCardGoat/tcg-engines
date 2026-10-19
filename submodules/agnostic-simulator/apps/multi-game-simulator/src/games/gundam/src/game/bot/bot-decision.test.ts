// Owns cloned planning and validated command transport, not card-behavior coverage.
import { expect, test } from "vite-plus/test";
import {
  rankGundamBotCandidates,
  takeAutomatedActionWithFallback,
  getSafeGundamAutomatedActionStrategyOption,
} from "@tcg/gundam-engine";
import { createGundamBotPlanner } from "./bot-decision";
import { loadMainPhaseDemo } from "../fixtures/main-phase-demo";

test("Gundam cloned resources rank identical candidates and commit through normal fallback validation", () => {
  const { runtime, staticResources } = loadMainPhaseDemo();
  const strategy = getSafeGundamAutomatedActionStrategyOption();
  const player = runtime.getState().ctx.status.activePlayer!;
  const context = structuredClone({
    players: staticResources.players,
    catalog: [...staticResources.catalog.entries()],
    setupCards: staticResources.setupCards,
  });
  const planned = createGundamBotPlanner(context)(
    structuredClone({
      state: runtime.getState(),
      player,
      strategyId: strategy.id,
      instances: [...staticResources.cardsMaps.instances.entries()],
      definitions: [...staticResources.cardsMaps.definitions.entries()],
    }),
  );
  expect(planned).toEqual(
    rankGundamBotCandidates(runtime, player, strategy.strategy, staticResources),
  );
  expect(planned.length).toBeGreaterThan(0);
  const result = takeAutomatedActionWithFallback(
    runtime,
    player,
    {
      name: "must-not-plan-twice",
      selectCandidates: () => {
        throw new Error("Duplicate UI-thread search");
      },
    },
    staticResources,
    { preparedCandidates: planned },
  );
  expect(result.outcome).toBe("candidate-succeeded");
});
