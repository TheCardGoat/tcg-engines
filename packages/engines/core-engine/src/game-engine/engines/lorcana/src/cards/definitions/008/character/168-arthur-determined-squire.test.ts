/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  arthurKingVictorious,
  merlinBackFromTheBermudas,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import {
  arthurDeterminedSquire,
  liloCausingAnUproar,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Arthur - Determined Squire", () => {
  it("NO MORE BOOKS Skip your turn's Draw step.", async () => {
    const testEngine = new TestEngine({
      inkwell: arthurDeterminedSquire.cost,
      play: [arthurDeterminedSquire],
      hand: [],
      deck: [liloCausingAnUproar],
    });

    await testEngine.passTurn();
    await testEngine.passTurn();

    expect(testEngine.getCardsByZone("hand", "player_one")).toHaveLength(0);
  });

  it("NO MORE BOOKS Allows your opponent to draw.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: arthurDeterminedSquire.cost,
        play: [arthurDeterminedSquire],
        hand: [],
        deck: [],
      },
      {
        inkwell: arthurDeterminedSquire.cost,
        play: [],
        hand: [],
        deck: [liloCausingAnUproar],
      },
    );

    await testEngine.passTurn();

    expect(testEngine.getCardsByZone("hand", "player_two")).toHaveLength(1);
    expect(testEngine.getCardModel(liloCausingAnUproar).zone).toEqual("hand");
  });

  it("NO MORE BOOKS Is no longer active when shifted.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: arthurKingVictorious.cost,
        play: [arthurDeterminedSquire],
        hand: [arthurKingVictorious],
        deck: [merlinBackFromTheBermudas],
      },
      {
        inkwell: arthurDeterminedSquire.cost,
        play: [],
        hand: [],
        deck: [liloCausingAnUproar],
      },
    );

    await testEngine.shiftCard({
      shifted: arthurDeterminedSquire,
      shifter: arthurKingVictorious,
    });
    await testEngine.skipTopOfStack();

    await testEngine.passTurn();
    await testEngine.passTurn();

    expect(testEngine.getCardsByZone("hand", "player_one")).toHaveLength(1);
    expect(testEngine.getCardModel(merlinBackFromTheBermudas).zone).toEqual(
      "hand",
    );
  });
});
