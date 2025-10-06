/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { bePrepared } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/songs";
import {
  bobbyPurplePigeon,
  joeyBluePigeon,
  rhinoPowerHamster,
  vinnieGreenPigeon,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";

describe("Vinnie - Green Pigeon", () => {
  it("LEARNING EXPERIENCE During an opponent's turn, whenever one of your other characters is banished, gain 1 lore.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: vinnieGreenPigeon.cost,
        play: [vinnieGreenPigeon, joeyBluePigeon, bobbyPurplePigeon],
        hand: [],
        lore: 0,
      },
      {
        inkwell: 7,
        hand: [bePrepared],
      },
    );

    testEngine.passTurn();

    await testEngine.playCard(bePrepared);

    testEngine.changeActivePlayer("player_one");
    await testEngine.resolveTopOfStack({}, true);

    expect(testEngine.getPlayerLore("player_one")).toEqual(2);
  });

  it("LEARNING EXPERIENCE Does not trigger during your turn", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: vinnieGreenPigeon.cost,
        play: [vinnieGreenPigeon, joeyBluePigeon, bobbyPurplePigeon],
        hand: [],
        lore: 0,
      },
      {
        inkwell: 7,
        play: [rhinoPowerHamster],
      },
    );

    const defender = testEngine.getCardModel(rhinoPowerHamster);
    defender.updateCardMeta({ exerted: true });

    const challenger = testEngine.getCardModel(bobbyPurplePigeon);
    await testEngine.challenge({ attacker: challenger, defender: defender });

    expect(testEngine.getPlayerLore("player_one")).toEqual(0);
  });
});
