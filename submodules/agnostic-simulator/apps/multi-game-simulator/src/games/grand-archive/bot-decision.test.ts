// Owns cloned planning and validated command transport, not card-behavior coverage.
import { expect, test } from "vite-plus/test";
import {
  chooseGrandArchiveAutomatedAction,
  createGrandArchiveCatalogSmokeFixture,
  getSafeGrandArchiveAutomatedActionStrategyOption,
} from "@tcg/grand-archive-engine/automation";
import { grandArchivePlayerId } from "@tcg/grand-archive-engine/runtime";
import { decideGrandArchiveBot } from "./bot-decision";

test("Grand Archive program and snapshot are clone-safe and choose the same legal command", () => {
  const { program, initialState } = createGrandArchiveCatalogSmokeFixture(42);
  const input = {
    state: initialState,
    player: grandArchivePlayerId("p1"),
    strategyId: "first-legal",
  };
  const result = decideGrandArchiveBot(structuredClone(input), structuredClone(program));
  expect(result.choice).not.toBeNull();
  expect(result.choice).toEqual(
    chooseGrandArchiveAutomatedAction(
      program,
      initialState,
      input.player,
      getSafeGrandArchiveAutomatedActionStrategyOption(input.strategyId).strategy,
    ),
  );
});
