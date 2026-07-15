import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mrsIncredibleDeterminedRescuer } from "./195-mrs-incredible-determined-rescuer";

const superTeammate = createMockCharacter({
  id: "mrs-incredible-super-teammate",
  name: "Super Teammate",
  cost: 3,
  strength: 3,
  willpower: 3,
  classifications: ["Storyborn", "Hero", "Super"],
});

const nonSuperTeammate = createMockCharacter({
  id: "mrs-incredible-non-super-teammate",
  name: "Non-Super Teammate",
  cost: 3,
  strength: 3,
  willpower: 3,
  classifications: ["Storyborn", "Hero"],
});

const sacrificialDefender = createMockCharacter({
  id: "mrs-incredible-defender",
  name: "Sacrificial Defender",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const opponentAttacker = createMockCharacter({
  id: "mrs-incredible-attacker",
  name: "Opponent Attacker",
  cost: 3,
  strength: 5,
  willpower: 5,
});

describe("Mrs. Incredible - Determined Rescuer", () => {
  describe("REGROUP - During your turn, whenever another character is banished in a challenge, you may ready chosen Super character. If you do, they can't quest for the rest of this turn.", () => {
    it("readies a chosen Super character and applies cant-quest when an ally is banished in a challenge during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            mrsIncredibleDeterminedRescuer,
            sacrificialDefender,
            { card: superTeammate, exerted: true },
          ],
          deck: 3,
        },
        {
          play: [{ card: opponentAttacker, exerted: true }],
          deck: 3,
        },
      );

      // Make defender exerted so opponent can challenge it on our turn? No — challenges happen on the active player's turn.
      // Active player is p1. p1 challenges p2's exerted attacker with our defender to banish defender.
      const superId = testEngine.findCardInstanceId(superTeammate, "play", "player_one");

      expect(testEngine.asPlayerOne().isExerted(superId)).toBe(true);

      // p1 challenges with sacrificial defender into the opposing attacker; defender (1 willpower vs 5 str) is banished.
      expect(
        testEngine.asPlayerOne().challenge(sacrificialDefender, opponentAttacker),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(sacrificialDefender)).toBe("discard");

      // REGROUP should fire as an optional triggered ability
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mrsIncredibleDeterminedRescuer, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Pick the Super teammate to be readied
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [superId] }),
      ).toBeSuccessfulCommand();

      // Super teammate should be ready and have cant-quest restriction
      expect(testEngine.asPlayerOne().isExerted(superId)).toBe(false);
      expect(testEngine.hasRestriction(superTeammate, "cant-quest")).toBe(true);
    });

    it("triggers when Mrs. Incredible banishes an opposing character in her own challenge", () => {
      const fragileOpponent = createMockCharacter({
        id: "mrs-incredible-fragile-opponent",
        name: "Fragile Opponent",
        cost: 1,
        strength: 0,
        willpower: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mrsIncredibleDeterminedRescuer],
          deck: 3,
        },
        {
          play: [{ card: fragileOpponent, exerted: true }],
          deck: 3,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(mrsIncredibleDeterminedRescuer, fragileOpponent),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(fragileOpponent)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
    });

    it("does not trigger when no challenge banish happens", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mrsIncredibleDeterminedRescuer, { card: superTeammate, exerted: true }],
          deck: 3,
        },
        { deck: 3 },
      );

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().isExerted(superTeammate)).toBe(true);
    });

    it("can decline the optional ability — Super teammate stays exerted with no restriction", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            mrsIncredibleDeterminedRescuer,
            sacrificialDefender,
            { card: superTeammate, exerted: true },
          ],
          deck: 3,
        },
        {
          play: [{ card: opponentAttacker, exerted: true }],
          deck: 3,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(sacrificialDefender, opponentAttacker),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mrsIncredibleDeterminedRescuer, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(superTeammate)).toBe(true);
      expect(testEngine.hasRestriction(superTeammate, "cant-quest")).toBe(false);
    });

    it("PULL BACK — your characters gain Resist +1", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mrsIncredibleDeterminedRescuer, nonSuperTeammate],
          deck: 3,
        },
        { deck: 3 },
      );

      expect(testEngine.hasKeyword(nonSuperTeammate, "Resist")).toBe(true);
      expect(testEngine.hasKeyword(mrsIncredibleDeterminedRescuer, "Resist")).toBe(true);
    });
  });
});
