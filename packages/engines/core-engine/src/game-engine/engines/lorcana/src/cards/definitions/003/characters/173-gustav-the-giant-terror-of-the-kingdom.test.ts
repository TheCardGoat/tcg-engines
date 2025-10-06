/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { dragonFire } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import {
  gustavTheGiantTerrorOfTheKingdom,
  miloThatchCleverCartographer,
  starkeyDeviousPirate,
} from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Gustav the Giant - Terror of the Kingdom", () => {
  it("**ALL TIED UP** This character enters play exerted and can't ready at the start of your turn.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: gustavTheGiantTerrorOfTheKingdom.cost,
        hand: [gustavTheGiantTerrorOfTheKingdom],
        deck: 1,
      },
      {
        deck: 1,
      },
    );

    const cardUnderTest = await testEngine.playCard(
      gustavTheGiantTerrorOfTheKingdom,
    );

    expect(cardUnderTest.exerted).toBe(true);

    await testEngine.passTurn();
    await testEngine.passTurn();

    expect(cardUnderTest.exerted).toBe(true);
  });

  describe("**BREAK FREE** During your turn, whenever one of your other characters banishes another character in a challenge, you may ready this character.", () => {
    it("Banished in a challenge", async () => {
      const testEngine = new TestEngine(
        {
          play: [gustavTheGiantTerrorOfTheKingdom, starkeyDeviousPirate],
        },
        {
          play: [miloThatchCleverCartographer],
        },
      );

      const cardUnderTest = await testEngine.tapCard(
        gustavTheGiantTerrorOfTheKingdom,
      );
      const defender = await testEngine.tapCard(miloThatchCleverCartographer);

      await testEngine.challenge({
        attacker: starkeyDeviousPirate,
        defender: miloThatchCleverCartographer,
      });
      await testEngine.resolveOptionalAbility();

      expect(defender.zone).toBe("discard");
      expect(cardUnderTest.exerted).toBe(false);
    });

    it("Banished by an action card", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: dragonFire.cost,
          hand: [dragonFire],
          play: [gustavTheGiantTerrorOfTheKingdom],
        },
        {
          play: [miloThatchCleverCartographer],
        },
      );

      const cardUnderTest = await testEngine.tapCard(
        gustavTheGiantTerrorOfTheKingdom,
      );

      await testEngine.playCard(dragonFire, {
        targets: [miloThatchCleverCartographer],
      });

      expect(testEngine.getCardModel(miloThatchCleverCartographer).zone).toBe(
        "discard",
      );
      expect(testEngine.stackLayers).toHaveLength(0);
      expect(cardUnderTest.exerted).toBe(true);
    });
  });
});
