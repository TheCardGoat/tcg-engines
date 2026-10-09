import { expect, test } from "bun:test";
import { PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { launchpadTrustySidekick, mickeyMouseSnowboardAce } from "@tcg/lorcana-cards/cards/011";
import { createRegressionTestEngine } from "./create-regression-test-engine.js";
import { mickeySurvivesChallengeRegression } from "../../lib/features/simulator-devtools/fixtures/regressions/mickey-survives-challenge.js";

test("the browser fixture keeps Mickey in play and does not prompt for a discard", () => {
  const game = createRegressionTestEngine(mickeySurvivesChallengeRegression);
  const p1 = game.asPlayerOne();
  const p2 = game.asPlayerTwo();
  expect(p1.challenge(mickeyMouseSnowboardAce, launchpadTrustySidekick)).toBeSuccessfulCommand();
  expect(p1.getCardZone(mickeyMouseSnowboardAce)).toBe("play");
  expect(p2.getCardZone(launchpadTrustySidekick)).toBe("discard");
  expect(p2.getCardsInZone("hand", PLAYER_TWO).count).toBe(2);
  expect(p2.getPendingEffects()).toHaveLength(0);
  expect(p1.getBagCount()).toBe(0);
  expect(p1.passTurn()).toBeSuccessfulCommand();
});
