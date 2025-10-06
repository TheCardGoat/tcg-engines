/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mrSmeeBumblingMate } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import { calhounMarineSergeant } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import { mushuMajesticDragon } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mushu - Majestic Dragon", () => {
  it("INTIMIDATING AND AWE-INSPIRING Whenever one of your characters challenges, they gain Resist +2 during that challenge. (Damage dealt to them is reduced by 2.)", async () => {
    const testEngine = new TestEngine(
      {
        play: [mushuMajesticDragon, mrSmeeBumblingMate],
      },
      {
        play: [calhounMarineSergeant],
      },
    );

    const cardUnderTest = testEngine.getCardModel(mrSmeeBumblingMate);
    const target = testEngine.getCardModel(calhounMarineSergeant);

    target.updateCardMeta({ exerted: true });
    cardUnderTest.challenge(target);

    expect(testEngine.getCardZone(cardUnderTest)).toBe("play");
    expect(testEngine.getCardZone(target)).toBe("discard");
    expect(cardUnderTest.meta.damage).toBe(1);
    expect(cardUnderTest.hasResist).toBe(false); // Once challenge ends, resist is removed
  });

  it("GUARDIAN OF LOST SOULS During your turn, whenever one of your characters banishes another character in a challenge, gain 2 lore.", async () => {
    const testEngine = new TestEngine(
      {
        play: [mushuMajesticDragon, mrSmeeBumblingMate],
      },
      {
        play: [calhounMarineSergeant],
      },
    );

    const cardUnderTest = testEngine.getCardModel(mrSmeeBumblingMate);
    const target = testEngine.getCardModel(calhounMarineSergeant);

    target.updateCardMeta({ exerted: true });

    expect(testEngine.getPlayerLore()).toBe(0);
    cardUnderTest.challenge(target);
    expect(testEngine.getPlayerLore()).toBe(2);
  });

  it("Ensure lore is only gained during players turn", async () => {
    const testEngine = new TestEngine(
      {
        play: [mushuMajesticDragon, mrSmeeBumblingMate],
      },
      {
        play: [calhounMarineSergeant],
      },
    );

    const defender = testEngine.getCardModel(mrSmeeBumblingMate);
    const attacker = testEngine.getCardModel(calhounMarineSergeant);

    defender.updateCardMeta({ exerted: true });

    await testEngine.passTurn();

    expect(testEngine.getCardModel(mrSmeeBumblingMate).damage).toBe(1);

    expect(testEngine.getPlayerLore()).toBe(0);
    attacker.challenge(defender);
    expect(testEngine.getPlayerLore()).toBe(0);
  });
});
