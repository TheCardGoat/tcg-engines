import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { luisaMadrigalConfidentClimber } from "./060-luisa-madrigal-confident-climber";

const friendlyCharacter = createMockCharacter({
  id: "luisa-test-friendly",
  name: "Friendly Character",
  cost: 2,
  strength: 2,
  willpower: 5,
});

const undamagedFriendlyCharacter = createMockCharacter({
  id: "luisa-test-undamaged-friendly",
  name: "Undamaged Friendly Character",
  cost: 2,
  strength: 2,
  willpower: 5,
});

const opposingCharacter = createMockCharacter({
  id: "luisa-test-opposing",
  name: "Opposing Character",
  cost: 3,
  strength: 3,
  willpower: 6,
});

describe("Luisa Madrigal - Confident Climber", () => {
  describe("I CAN TAKE IT - 1 {I} - Move up to 1 damage from chosen character of yours to this character. Then, if this character has 3 or more damage, move all damage from this character to chosen opposing character.", () => {
    it("moves 1 damage from friendly character to self, then moves all damage to opposing character when self has 3+ damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: luisaMadrigalConfidentClimber, damage: 2 },
            { card: friendlyCharacter, damage: 1 },
          ],
          inkwell: 1,
          deck: 5,
        },
        {
          play: [opposingCharacter],
          deck: 5,
        },
      );

      const friendlyId = testEngine.findCardInstanceId(friendlyCharacter, "play");
      const opposingId = testEngine.findCardInstanceId(opposingCharacter, "play", "player_two");

      const activateResult = testEngine
        .asPlayerOne()
        .activateAbility(luisaMadrigalConfidentClimber);
      expect(activateResult).toBeSuccessfulCommand();

      // Choose friendly character as source of move-damage
      const moveResult = testEngine.asPlayerOne().resolveNextPending({ targets: [friendlyId] });
      expect(moveResult).toBeSuccessfulCommand();

      // Luisa should now have 3 damage (2 + 1), friendly should have 0
      expect(testEngine.asPlayerOne().getDamage(luisaMadrigalConfidentClimber)).toBe(3);
      expect(testEngine.asPlayerOne().getDamage(friendlyCharacter)).toBe(0);

      // The conditional should trigger - choose opposing character for all damage move
      const condResult = testEngine.asPlayerOne().resolveNextPending({ targets: [opposingId] });
      expect(condResult).toBeSuccessfulCommand();

      // All damage should have moved from Luisa to opposing character
      expect(testEngine.asPlayerOne().getDamage(luisaMadrigalConfidentClimber)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(3);
    });

    it("moves lethal fourth damage away before Luisa is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: luisaMadrigalConfidentClimber, damage: 3 },
            { card: friendlyCharacter, damage: 1 },
          ],
          inkwell: 1,
          deck: [],
        },
        {
          play: [opposingCharacter],
          deck: [],
        },
      );

      const friendlyId = testEngine.findCardInstanceId(friendlyCharacter, "play");
      const opposingId = testEngine.findCardInstanceId(opposingCharacter, "play", "player_two");

      expect(
        testEngine.asPlayerOne().activateAbility(luisaMadrigalConfidentClimber),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [friendlyId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(luisaMadrigalConfidentClimber)).toBe("play");
      expect(testEngine.asPlayerOne().getDamage(luisaMadrigalConfidentClimber)).toBe(4);

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [opposingId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(luisaMadrigalConfidentClimber)).toBe("play");
      expect(testEngine.asPlayerOne().getDamage(luisaMadrigalConfidentClimber)).toBe(0);
      expect(testEngine.asPlayerOne().getDamage(friendlyCharacter)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(4);
    });

    it("does not move all damage to opposing if self has less than 3 damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: luisaMadrigalConfidentClimber, damage: 1 },
            { card: friendlyCharacter, damage: 1 },
          ],
          inkwell: 1,
          deck: 5,
        },
        {
          play: [opposingCharacter],
          deck: 5,
        },
      );

      const friendlyId = testEngine.findCardInstanceId(friendlyCharacter, "play");

      expect(
        testEngine.asPlayerOne().activateAbility(luisaMadrigalConfidentClimber),
      ).toBeSuccessfulCommand();

      // Choose friendly character as source
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [friendlyId] }),
      ).toBeSuccessfulCommand();

      // Luisa should have 2 damage (1 + 1) - less than 3, no second move
      expect(testEngine.asPlayerOne().getDamage(luisaMadrigalConfidentClimber)).toBe(2);
      expect(testEngine.asPlayerOne().getDamage(friendlyCharacter)).toBe(0);
      // Opposing character should have no damage since condition was not met
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(0);
    });

    it("offers undamaged friendly characters as source targets because the amount is up to 1", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: luisaMadrigalConfidentClimber, damage: 2 },
            { card: friendlyCharacter, damage: 1 },
            undamagedFriendlyCharacter,
          ],
          inkwell: 1,
          deck: [],
        },
        { deck: [] },
      );

      const friendlyId = testEngine.findCardInstanceId(friendlyCharacter, "play");
      const undamagedFriendlyId = testEngine.findCardInstanceId(undamagedFriendlyCharacter, "play");

      expect(
        testEngine.asPlayerOne().activateAbility(luisaMadrigalConfidentClimber),
      ).toBeSuccessfulCommand();

      const [pending] = testEngine.asPlayerOne().getPendingEffects();
      expect(pending?.selectionContext).toMatchObject({
        targetDsl: [
          {
            excludeSelf: true,
          },
        ],
        expectedSlottedKind: "move-damage",
        cardCandidateIds: expect.arrayContaining([friendlyId, undamagedFriendlyId]),
      });
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: {
            kind: "move-damage",
            from: [friendlyId],
            to: [],
          },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(luisaMadrigalConfidentClimber)).toBe(3);
      expect(testEngine.asPlayerOne().getDamage(friendlyCharacter)).toBe(0);
    });

    it("can choose an undamaged friendly character for the up-to-1 step and still move Luisa's damage to an opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: luisaMadrigalConfidentClimber, damage: 3 }, undamagedFriendlyCharacter],
          inkwell: 1,
          deck: [],
        },
        {
          play: [opposingCharacter],
          deck: [],
        },
      );

      const undamagedFriendlyId = testEngine.findCardInstanceId(undamagedFriendlyCharacter, "play");
      const opposingId = testEngine.findCardInstanceId(opposingCharacter, "play", "player_two");

      expect(
        testEngine.asPlayerOne().activateAbility(luisaMadrigalConfidentClimber),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          targets: {
            kind: "move-damage",
            from: [undamagedFriendlyId],
            to: [],
          },
          amount: 0,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(luisaMadrigalConfidentClimber)).toBe(3);
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [opposingId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(luisaMadrigalConfidentClimber)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(3);
    });

    it("can be activated multiple times per turn (no exert required — cost is 1 ink only)", () => {
      // The card text across all non-English localizations shows "1 {I}" with no {E}.
      // The English description includes "{E}" but this is a text-display artefact —
      // the mechanical cost is ink-only.  Luisa must remain un-exerted after activation
      // so the ability can be used again in the same turn.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: luisaMadrigalConfidentClimber, damage: 0 },
            { card: friendlyCharacter, damage: 2 },
          ],
          inkwell: 2, // enough for two activations
          deck: 5,
        },
        { deck: 2 },
      );

      const friendlyId = testEngine.findCardInstanceId(friendlyCharacter, "play");

      // First activation — should succeed
      expect(
        testEngine.asPlayerOne().activateAbility(luisaMadrigalConfidentClimber),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [friendlyId] }),
      ).toBeSuccessfulCommand();

      // Luisa should NOT be exerted after the first use (ink-only cost)
      expect(testEngine.asPlayerOne().isExerted(luisaMadrigalConfidentClimber)).toBe(false);

      // Second activation in the same turn must succeed (would fail if exert was required)
      expect(
        testEngine.asPlayerOne().activateAbility(luisaMadrigalConfidentClimber),
      ).toBeSuccessfulCommand();
      const [secondPending] = testEngine.asPlayerOne().getPendingEffects();
      const secondCandidateIds =
        secondPending?.selectionContext && "cardCandidateIds" in secondPending.selectionContext
          ? secondPending.selectionContext.cardCandidateIds
          : [];
      expect(secondCandidateIds).toEqual([friendlyId]);
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [friendlyId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(luisaMadrigalConfidentClimber)).toBe(2);
      expect(testEngine.asPlayerOne().getDamage(friendlyCharacter)).toBe(0);
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    });

    it("cannot activate without enough ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [luisaMadrigalConfidentClimber, { card: friendlyCharacter, damage: 1 }],
          inkwell: 0,
          deck: 5,
        },
        {
          play: [opposingCharacter],
          deck: 5,
        },
      );

      const result = testEngine.asPlayerOne().activateAbility(luisaMadrigalConfidentClimber);
      expect(result.success).toBe(false);
    });
  });
});
