import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { holdStill } from "../../002/actions/028-hold-still";
import { healingGlow } from "../../001/actions/028-healing-glow";
import { almaMadrigalKeeperOfTheFlame } from "./058-alma-madrigal-keeper-of-the-flame";
import { luisaMadrigalConfidentClimber } from "./060-luisa-madrigal-confident-climber";
import { luisaMadrigalNoPressure } from "./151-luisa-madrigal-no-pressure";

const damagedAlly = createMockCharacter({
  id: "alma-keeper-damaged-ally",
  name: "Damaged Ally",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const opposingCharacter = createMockCharacter({
  id: "alma-keeper-opposing-character",
  name: "Opposing Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Alma Madrigal - Keeper of the Flame", () => {
  it("is no longer marked as missing executable coverage", () => {
    expect(almaMadrigalKeeperOfTheFlame.missingImplementation).toBeUndefined();
    expect(almaMadrigalKeeperOfTheFlame.missingTests).toBeUndefined();
  });

  describe("THAT'S ENOUGH - Whenever you remove 1 or more damage from one of your characters, you may exert chosen opposing character.", () => {
    it("exerts chosen opposing character when you remove damage from one of your characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [almaMadrigalKeeperOfTheFlame, { card: damagedAlly, damage: 2 }],
          hand: [holdStill],
          inkwell: holdStill.cost,
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(testEngine.isExerted(opposingCharacter)).toBe(false);

      expect(
        testEngine.asPlayerOne().playCard(holdStill, {
          targets: [damagedAlly],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(damagedAlly)?.damage).toBe(0);

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(almaMadrigalKeeperOfTheFlame, {
          resolveOptional: true,
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(opposingCharacter)).toBe(true);
    });

    it("can decline the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [almaMadrigalKeeperOfTheFlame, { card: damagedAlly, damage: 2 }],
          hand: [holdStill],
          inkwell: holdStill.cost,
        },
        {
          play: [opposingCharacter],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(holdStill, {
          targets: [damagedAlly],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(almaMadrigalKeeperOfTheFlame, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(opposingCharacter)).toBe(false);
    });

    it("triggers when a friendly character moves damage away via an activated ability (BUG-10)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            almaMadrigalKeeperOfTheFlame,
            { card: damagedAlly, damage: 2 },
            { card: luisaMadrigalConfidentClimber, isDrying: false },
          ],
          inkwell: 1,
        },
        {
          play: [opposingCharacter],
        },
      );

      // Luisa uses her activated ability to move 1 damage from damagedAlly to herself
      expect(
        testEngine.asPlayerOne().activateAbility(luisaMadrigalConfidentClimber, {
          targets: [damagedAlly],
        }),
      ).toBeSuccessfulCommand();

      // Alma's THAT'S ENOUGH should have triggered
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(almaMadrigalKeeperOfTheFlame, {
          resolveOptional: true,
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(opposingCharacter)).toBe(true);
    });

    it("triggers when Luisa No Pressure quests and moves damage away via triggered move-damage (BUG-10)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            almaMadrigalKeeperOfTheFlame,
            { card: damagedAlly, damage: 3 },
            { card: luisaMadrigalNoPressure, isDrying: false },
          ],
          deck: 5,
        },
        {
          play: [opposingCharacter],
          deck: 5,
        },
      );

      // Luisa quests, triggering SHOULDER THE BURDEN
      expect(testEngine.asPlayerOne().quest(luisaMadrigalNoPressure)).toBeSuccessfulCommand();

      // SHOULDER THE BURDEN bag entry
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Resolve Luisa's triggered ability: move 3 damage from damagedAlly to Luisa
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(luisaMadrigalNoPressure, {
          resolveOptional: true,
          targets: [damagedAlly],
          amount: 3,
        }),
      ).toBeSuccessfulCommand();

      // Alma's THAT'S ENOUGH should now be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(almaMadrigalKeeperOfTheFlame, {
          resolveOptional: true,
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(opposingCharacter)).toBe(true);
    });

    it("does NOT trigger when the opponent removes damage from one of your characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [almaMadrigalKeeperOfTheFlame, { card: damagedAlly, damage: 2 }],
        },
        {
          play: [opposingCharacter],
          hand: [healingGlow],
          inkwell: healingGlow.cost,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent heals player one's damaged ally
      expect(
        testEngine.asPlayerTwo().playCard(healingGlow, {
          targets: [damagedAlly],
        }),
      ).toBeSuccessfulCommand();

      // Alma's ability must not have triggered for player one
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.isExerted(opposingCharacter)).toBe(false);
    });
  });
});
