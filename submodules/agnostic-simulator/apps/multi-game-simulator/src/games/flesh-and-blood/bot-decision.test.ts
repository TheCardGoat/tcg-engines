// Owns cloned planning and validated command transport, not card-behavior coverage.
import { expect, test } from "vite-plus/test";
import {
  chooseAutomatedAction,
  getSafeFabAutomatedActionStrategyOption,
  createFabMatchContext,
  seedFromString,
  nextRandom,
  submitAutomatedAction,
  listLegalCommands,
} from "@tcg/flesh-and-blood-engine/simulator";
import { createFabPracticeMatchup } from "./data/practice-matchup-fixture";
import { decideFabBot } from "./bot-decision";

test("FAB snapshot planning preserves command choices and the seeded random stream", () => {
  const match = createFabPracticeMatchup({
    seed: "worker-parity",
    player1DeckId: "cc-guilherme-coutinho-rhinar",
    player2DeckId: "cc-edinburgh-3rd-tuffnut",
  });
  const runtime = match.runtime;
  const context = createFabMatchContext(
    runtime.getState().cardDefinitions,
    runtime.getState().publicCardIdentities,
  );
  const strategyId = "random";
  const strategy = getSafeFabAutomatedActionStrategyOption(strategyId).strategy;
  let rngState = seedFromString("worker-parity");
  let accepted = 0;
  for (let step = 0; step < 12 && !runtime.hasGameEnded(); step++) {
    const actor =
      runtime.getState().decision?.actorId ??
      runtime.getState().priority?.holderPlayerId ??
      runtime.getState().activePlayerId;
    const snapshot = runtime.snapshot();
    const planned = decideFabBot(
      structuredClone({ snapshot, player: actor, strategyId, rngState }),
      structuredClone(context),
    );
    const expected = chooseAutomatedAction(runtime, actor, strategy, {
      random: () => {
        const next = nextRandom(rngState);
        rngState = next.state;
        return next.value;
      },
    });
    expect(planned).toEqual({ choice: expected, rngState });
    expect(runtime.snapshot()).toEqual(snapshot);
    if (!expected) break;
    const result = submitAutomatedAction(
      runtime,
      actor,
      expected,
      listLegalCommands(runtime, actor),
      { commandId: `parity:${step}`, timestamp: step },
    );
    if (!result.advanced) break;
    accepted++;
  }
  expect(accepted).toBeGreaterThan(0);
  expect(rngState).not.toEqual(seedFromString("worker-parity"));
});
