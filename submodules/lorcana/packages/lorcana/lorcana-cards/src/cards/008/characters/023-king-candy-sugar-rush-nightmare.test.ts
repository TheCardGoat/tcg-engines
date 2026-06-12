import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { kingCandySugarRushNightmare } from "./023-king-candy-sugar-rush-nightmare";
import { candleheadDedicatedRacer } from "../../007/characters/017-candlehead-dedicated-racer";
import { gloydOrangeboarFierceCompetitor } from "./121-gloyd-orangeboar-fierce-competitor";

const banishAction = createMockAction({
  id: "king-candy-srn-banish-action",
  name: "Banish Action",
  cost: 2,
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "banish",
      },
      type: "action",
    },
  ],
});

const nonRacerCharacter = createMockCharacter({
  id: "king-candy-srn-non-racer",
  name: "Non-Racer Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  classifications: ["Storyborn", "Hero"],
});

describe("King Candy - Sugar Rush Nightmare", () => {
  describe("A NEW ROSTER - When this character is banished, you may return another Racer character card from your discard to your hand.", () => {
    it("returns a Racer character from discard to hand when banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [kingCandySugarRushNightmare],
        hand: [banishAction],
        inkwell: banishAction.cost,
        discard: [candleheadDedicatedRacer],
        deck: 2,
      });

      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [kingCandySugarRushNightmare] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(kingCandySugarRushNightmare)).toBe("discard");

      // A NEW ROSTER triggers as optional
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kingCandySugarRushNightmare, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [candleheadDedicatedRacer] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(candleheadDedicatedRacer)).toBe("hand");
    });

    it("can be declined (optional)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [kingCandySugarRushNightmare],
        hand: [banishAction],
        inkwell: banishAction.cost,
        discard: [candleheadDedicatedRacer],
        deck: 2,
      });

      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [kingCandySugarRushNightmare] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(kingCandySugarRushNightmare)).toBe("discard");

      // Decline the optional ability
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kingCandySugarRushNightmare, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Candlehead should remain in discard
      expect(testEngine.asPlayerOne().getCardZone(candleheadDedicatedRacer)).toBe("discard");
    });

    it("only returns Racer characters (non-Racer targets are ignored)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [kingCandySugarRushNightmare],
        hand: [banishAction],
        inkwell: banishAction.cost,
        discard: [nonRacerCharacter, gloydOrangeboarFierceCompetitor],
        deck: 2,
      });

      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [kingCandySugarRushNightmare] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kingCandySugarRushNightmare, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Target the Racer character (non-racer is in discard but not a valid candidate)
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [gloydOrangeboarFierceCompetitor] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(gloydOrangeboarFierceCompetitor)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(nonRacerCharacter)).toBe("discard");
    });

    it("does not trigger when no Racer characters are in discard (cannot return himself)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [kingCandySugarRushNightmare],
        hand: [banishAction],
        inkwell: banishAction.cost,
        discard: [],
        deck: 2,
      });

      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [kingCandySugarRushNightmare] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(kingCandySugarRushNightmare)).toBe("discard");

      // With no other Racer to return, the optional bag entry auto-drains as a no-op.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("regression: triggers when banished via challenge (not just action)", () => {
      const strongAttacker = createMockCharacter({
        id: "king-candy-srn-strong-attacker",
        name: "Strong Attacker",
        cost: 5,
        strength: 5,
        willpower: 5,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [strongAttacker],
          deck: 2,
        },
        {
          play: [{ card: kingCandySugarRushNightmare, exerted: true }],
          discard: [candleheadDedicatedRacer],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(strongAttacker, kingCandySugarRushNightmare),
      ).toBeSuccessfulCommand();

      // King Candy should be banished (willpower 2 < strength 5)
      expect(testEngine.asPlayerTwo().getCardZone(kingCandySugarRushNightmare)).toBe("discard");

      // A NEW ROSTER should trigger
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerTwo()
          .resolvePendingByCard(kingCandySugarRushNightmare, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().resolveNextPending({ targets: [candleheadDedicatedRacer] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(candleheadDedicatedRacer)).toBe("hand");
    });
  });
});
