import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, CANONICAL_PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { tinkerBellVeryCleverFairy } from "./157-tinker-bell-very-clever-fairy";
import { benjaGuardianOfTheDragonGem } from "../../002/characters/174-benja-guardian-of-the-dragon-gem";
import { dinglehopper } from "../../001/items/032-dinglehopper";

describe("Tinker Bell - Very Clever Fairy", () => {
  describe("I CAN USE THAT - Whenever one of your items is banished, you may put that card into your inkwell facedown and exerted.", () => {
    it("puts the banished item into inkwell when optional ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: benjaGuardianOfTheDragonGem.cost,
        play: [tinkerBellVeryCleverFairy, dinglehopper],
        hand: [benjaGuardianOfTheDragonGem],
      });

      const initialInkwellCount = testEngine.asPlayerOne().getTotalInk(CANONICAL_PLAYER_ONE);

      // Play Benja which triggers "may banish chosen item"
      expect(
        testEngine.asPlayerOne().playCard(benjaGuardianOfTheDragonGem),
      ).toBeSuccessfulCommand();

      // Resolve Benja's optional banish ability (accept it)
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Choose the dinglehopper as the item to banish
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [dinglehopper] }),
      ).toBeSuccessfulCommand();

      // Dinglehopper should now be in discard
      expect(testEngine.asPlayerOne().getCardZone(dinglehopper)).toBe("discard");

      // Tinker Bell's "I CAN USE THAT" should have triggered — accept it
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(tinkerBellVeryCleverFairy, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Dinglehopper should now be in the inkwell
      expect(testEngine.asPlayerOne().getCardZone(dinglehopper)).toBe("inkwell");

      // Inkwell should have grown by 1 (the dinglehopper)
      expect(testEngine.asPlayerOne().getTotalInk(CANONICAL_PLAYER_ONE)).toBe(
        initialInkwellCount + 1,
      );
    });

    it("does not put the banished item into inkwell when optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: benjaGuardianOfTheDragonGem.cost,
        play: [tinkerBellVeryCleverFairy, dinglehopper],
        hand: [benjaGuardianOfTheDragonGem],
      });

      // Play Benja
      expect(
        testEngine.asPlayerOne().playCard(benjaGuardianOfTheDragonGem),
      ).toBeSuccessfulCommand();

      // Resolve Benja's optional banish ability (accept)
      expect(
        testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Choose the dinglehopper
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [dinglehopper] }),
      ).toBeSuccessfulCommand();

      // Dinglehopper in discard
      expect(testEngine.asPlayerOne().getCardZone(dinglehopper)).toBe("discard");

      // Tinker Bell's trigger fires — decline
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(tinkerBellVeryCleverFairy, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Dinglehopper stays in discard
      expect(testEngine.asPlayerOne().getCardZone(dinglehopper)).toBe("discard");
    });

    it("does not trigger when opponent's item is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tinkerBellVeryCleverFairy],
          hand: [],
          inkwell: 0,
        },
        {
          play: [dinglehopper],
          hand: [benjaGuardianOfTheDragonGem],
          inkwell: benjaGuardianOfTheDragonGem.cost,
        },
      );

      // Player one passes their turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Player two plays Benja and banishes their own item
      expect(
        testEngine.asPlayerTwo().playCard(benjaGuardianOfTheDragonGem),
      ).toBeSuccessfulCommand();

      // Resolve Benja's optional banish (accept)
      expect(
        testEngine.asPlayerTwo().resolveOnlyBag({ resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Choose the dinglehopper (player two's item)
      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [dinglehopper] }),
      ).toBeSuccessfulCommand();

      // Player two's dinglehopper is in discard
      expect(testEngine.asPlayerTwo().getCardZone(dinglehopper)).toBe("discard");

      // Tinker Bell (player one's) should NOT have triggered — bag should be empty
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
