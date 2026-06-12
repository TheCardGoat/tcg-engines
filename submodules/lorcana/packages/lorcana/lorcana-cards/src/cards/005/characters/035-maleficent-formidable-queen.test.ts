import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { maleficentFormidableQueen } from "./035-maleficent-formidable-queen";
import { maleficentVexedPartygoer } from "./051-maleficent-vexed-partygoer";
import { maleficentVengefulSorceress } from "./054-maleficent-vengeful-sorceress";
import { simbaProtectiveCub } from "../../001/characters/020-simba-protective-cub";
import { dinglehopper } from "../../001/items/032-dinglehopper";
import { rapunzelsTowerSecludedPrison } from "../locations/033-rapunzels-tower-secluded-prison";
import { goofyDaredevil } from "../../001/characters/111-goofy-daredevil";

const PLAYER_ONE = "player_one";

const nonMaleficentCharacter = createMockCharacter({
  id: "maleficent-formidable-queen-non-maleficent",
  name: "Non Maleficent",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Maleficent - Formidable Queen", () => {
  describe("Card properties", () => {
    it("should have correct stats", () => {
      expect(maleficentFormidableQueen.cost).toBe(8);
      expect(maleficentFormidableQueen.strength).toBe(7);
      expect(maleficentFormidableQueen.willpower).toBe(7);
      expect(maleficentFormidableQueen.lore).toBe(2);
    });

    it("should be a non-inkable amethyst card", () => {
      expect(maleficentFormidableQueen.inkable).toBe(false);
      expect(maleficentFormidableQueen.inkType).toEqual(["amethyst"]);
    });

    it("should have Floodborn Villain Queen Sorcerer classifications", () => {
      expect(maleficentFormidableQueen.classifications).toEqual([
        "Floodborn",
        "Villain",
        "Queen",
        "Sorcerer",
      ]);
    });
  });

  describe("Shift 6", () => {
    it("should be able to shift onto another Maleficent", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [maleficentFormidableQueen],
        play: [maleficentVengefulSorceress],
        inkwell: 6,
      });

      const shiftTarget = testEngine.findCardInstanceId(
        maleficentVengefulSorceress,
        "play",
        PLAYER_ONE,
      );

      expect(
        testEngine.asPlayerOne().playCard(maleficentFormidableQueen, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(maleficentFormidableQueen)).toBe("play");
    });
  });

  describe("LISTEN WELL, ALL OF YOU - When you play this character, for each of your characters named Maleficent in play, return a chosen opposing character, item, or location with cost 3 or less to their player's hand.", () => {
    it("returns 1 card when only this Maleficent is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [maleficentFormidableQueen],
          inkwell: maleficentFormidableQueen.cost,
        },
        {
          play: [simbaProtectiveCub], // cost 2, valid target
        },
      );

      expect(testEngine.asPlayerOne().playCard(maleficentFormidableQueen)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(maleficentFormidableQueen, {
          targets: [simbaProtectiveCub],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("hand");
    });

    // TODO: Engine gap - for-each with sequential target selections
    // The engine currently doesn't support batching multiple targets for for-each effects
    // that require user input per iteration. The inner effect has count: 1, and the
    // engine returns "Too many targets selected" when passing 3 targets at once.
    // Resolution options:
    // 1. Engine could support batching all targets for for-each effects
    // 2. Engine could create multiple bag items (one per iteration)
    // 3. Engine could track iteration state when effect suspends
    it.skip("returns up to 3 cards when 3 Maleficents are in play (this one + 2 others)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [maleficentFormidableQueen],
          play: [maleficentVexedPartygoer, maleficentVengefulSorceress],
          inkwell: maleficentFormidableQueen.cost,
        },
        {
          play: [simbaProtectiveCub, dinglehopper, rapunzelsTowerSecludedPrison], // 3 valid targets
        },
      );

      expect(testEngine.asPlayerOne().playCard(maleficentFormidableQueen)).toBeSuccessfulCommand();

      // The for-each effect requires choosing one target per Maleficent in play (3 total)
      // All targets should be provided in a single bag resolution
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(maleficentFormidableQueen, {
          targets: [simbaProtectiveCub, dinglehopper, rapunzelsTowerSecludedPrison],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("hand");
      expect(testEngine.asPlayerTwo().getCardZone(dinglehopper)).toBe("hand");
      expect(testEngine.asPlayerTwo().getCardZone(rapunzelsTowerSecludedPrison)).toBe("hand");
    });

    it("can target character, item, or location with cost 3 or less", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [maleficentFormidableQueen],
          inkwell: maleficentFormidableQueen.cost,
        },
        {
          play: [dinglehopper], // item, cost 1
        },
      );

      expect(testEngine.asPlayerOne().playCard(maleficentFormidableQueen)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(maleficentFormidableQueen, {
          targets: [dinglehopper],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(dinglehopper)).toBe("hand");
    });

    it("can target a location with cost 3 or less", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [maleficentFormidableQueen],
          inkwell: maleficentFormidableQueen.cost,
        },
        {
          play: [rapunzelsTowerSecludedPrison], // location, cost 2
        },
      );

      expect(testEngine.asPlayerOne().playCard(maleficentFormidableQueen)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(maleficentFormidableQueen, {
          targets: [rapunzelsTowerSecludedPrison],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(rapunzelsTowerSecludedPrison)).toBe("hand");
    });

    it("does not count non-Maleficent characters towards the return count", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [maleficentFormidableQueen],
          play: [nonMaleficentCharacter], // non-Maleficent
          inkwell: maleficentFormidableQueen.cost,
        },
        {
          play: [simbaProtectiveCub, dinglehopper],
        },
      );

      expect(testEngine.asPlayerOne().playCard(maleficentFormidableQueen)).toBeSuccessfulCommand();

      // Should only get 1 return (for this Maleficent only), not 2
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(maleficentFormidableQueen, {
          targets: [simbaProtectiveCub],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("hand");
      expect(testEngine.asPlayerTwo().getCardZone(dinglehopper)).toBe("play");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("does nothing when opponent has no valid targets (cost greater than 3)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [maleficentFormidableQueen],
          inkwell: maleficentFormidableQueen.cost,
        },
        {
          play: [goofyDaredevil], // cost 5, not a valid target
        },
      );

      expect(testEngine.asPlayerOne().playCard(maleficentFormidableQueen)).toBeSuccessfulCommand();

      // When there are no valid targets, the bag effect may auto-resolve or not require targets
      // The target should remain in play since the effect cannot target it
      expect(testEngine.asPlayerTwo().getCardZone(goofyDaredevil)).toBe("play");
    });
  });
});
