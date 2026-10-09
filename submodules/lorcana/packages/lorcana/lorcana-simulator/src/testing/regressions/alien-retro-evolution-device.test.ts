import { expect, test } from "bun:test";
import { heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { createRegressionTestEngine } from "./create-regression-test-engine.js";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { alienTrueBeliever } from "@tcg/lorcana-cards/cards/012";
import { retroEvolutionDevice } from "@tcg/lorcana-cards/cards/011";

// CR 6.2.3 and 6.3.3: banishment triggers wait until the activated effect finishes.
test("Alien returns another Alien after Retro Evolution Device banishes it", () => {
  const other = createMockCharacter({ id: "retro-other-alien", name: "Alien", cost: 1 });
  const evolved = createMockCharacter({ id: "retro-evolved", name: "Evolved Character", cost: 3 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [alienTrueBeliever, retroEvolutionDevice],
    discard: [other],
    hand: [evolved],
    inkwell: 1,
    deck: 3,
  });
  const p1 = game.asPlayerOne();
  const banishId = game.findCardInstanceId(alienTrueBeliever, "play", PLAYER_ONE);
  const playId = game.findCardInstanceId(evolved, "hand", PLAYER_ONE);
  expect(
    p1.activateAbility(retroEvolutionDevice, {
      effectSelections: {
        effectBanishCharacterIds: [banishId],
        effectPlayCardFromHandIds: [playId],
      },
    }),
  ).toBeSuccessfulCommand();
  expect(p1.getCardZone(alienTrueBeliever)).toBe("discard");
  expect(p1.getCardZone(evolved)).toBe("play");
  expect(game.asServer().getState().G.pendingEffects).toHaveLength(1);
  expect(p1.resolveNextPending({ targets: [other] })).toBeSuccessfulCommand();
  expect(p1.getCardZone(other)).toBe("hand");
  expect(p1.getCardZone(alienTrueBeliever)).toBe("discard");
});

test("the browser fixture returns the other Alien and leaves its source in discard", () => {
  const game = createRegressionTestEngine("alien-retro-evolution-device");
  const player = game.asPlayerOne();
  const sourceId = game.findCardInstanceId(alienTrueBeliever, "play", PLAYER_ONE);
  const otherId = game.findCardInstanceId(alienTrueBeliever, "discard", PLAYER_ONE);
  const replacementId = game.findCardInstanceId(heiheiBoatSnack, "hand", PLAYER_ONE);
  expect(
    player.activateAbility(retroEvolutionDevice, {
      effectSelections: {
        effectBanishCharacterIds: [sourceId],
        effectPlayCardFromHandIds: [replacementId],
      },
    }),
  ).toBeSuccessfulCommand();
  expect(player.getCardZone(sourceId)).toBe("discard");
  expect(player.getCardZone(replacementId)).toBe("play");
  expect(game.asServer().getState().G.pendingEffects).toHaveLength(1);
  expect(player.resolveNextPending({ targets: [otherId] })).toBeSuccessfulCommand();
  expect(player.getCardZone(otherId)).toBe("hand");
  expect(player.getCardZone(sourceId)).toBe("discard");
  expect(game.asServer().getState().G.pendingEffects).toHaveLength(0);
  expect(player.passTurn()).toBeSuccessfulCommand();
});
