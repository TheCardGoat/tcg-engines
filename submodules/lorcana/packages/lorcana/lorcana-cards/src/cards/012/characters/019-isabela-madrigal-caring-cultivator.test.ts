import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { holdStill } from "../../002/actions/028-hold-still";
import { healingGlow } from "../../001/actions/028-healing-glow";
import { isabelaMadrigalCaringCultivator } from "./019-isabela-madrigal-caring-cultivator";

const damagedAlly = createMockCharacter({
  id: "isabela-caring-damaged-ally",
  name: "Damaged Ally",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

describe("Isabela Madrigal - Caring Cultivator", () => {
  it("is no longer marked as missing executable coverage", () => {
    expect(isabelaMadrigalCaringCultivator.missingImplementation).toBeUndefined();
    expect(isabelaMadrigalCaringCultivator.missingTests).toBeUndefined();
  });

  it("has Shift 4 keyword", () => {
    const shiftAbility = isabelaMadrigalCaringCultivator.abilities?.find(
      (a) => a.type === "keyword" && a.keyword === "Shift",
    );
    expect(shiftAbility).toBeDefined();
    expect((shiftAbility as { cost?: { ink?: number } }).cost?.ink).toBe(4);
  });

  describe("DO NO WRONG - Whenever you remove damage from one of your characters, gain 1 lore for each 1 damage removed.", () => {
    it("gains 1 lore for each damage removed from one of your characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [isabelaMadrigalCaringCultivator, { card: damagedAlly, damage: 3 }],
          hand: [holdStill],
          inkwell: holdStill.cost,
        },
        {},
      );

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

      expect(
        testEngine.asPlayerOne().playCard(holdStill, {
          targets: [damagedAlly],
        }),
      ).toBeSuccessfulCommand();

      // All 3 damage should be removed
      expect(testEngine.asPlayerOne().getCard(damagedAlly)?.damage).toBe(0);

      // Resolve the DO NO WRONG trigger if it's pending
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(isabelaMadrigalCaringCultivator),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.getLore(PLAYER_ONE)).toBe(3);
    });

    it("does not trigger when no damage is actually removed", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [isabelaMadrigalCaringCultivator, damagedAlly],
          hand: [holdStill],
          inkwell: holdStill.cost,
        },
        {},
      );

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

      // Target an undamaged character - no damage is actually removed
      expect(
        testEngine.asPlayerOne().playCard(holdStill, {
          targets: [damagedAlly],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });

    it("release notes ruling: removing 2 damage in a single event triggers the ability ONCE and grants 2 lore (not 4)", () => {
      // Q&A: Do No Wrong triggers once per damage-removal event, gaining lore
      // equal to the amount removed — NOT once per damage counter.
      const allyWithTwoDamage = createMockCharacter({
        id: "isabela-caring-two-damage-ally",
        name: "Two Damage Ally",
        cost: 2,
        willpower: 5,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [isabelaMadrigalCaringCultivator, { card: allyWithTwoDamage, damage: 2 }],
          hand: [holdStill],
          inkwell: holdStill.cost,
        },
        {},
      );

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

      expect(
        testEngine.asPlayerOne().playCard(holdStill, { targets: [allyWithTwoDamage] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(allyWithTwoDamage)?.damage).toBe(0);

      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(isabelaMadrigalCaringCultivator),
        ).toBeSuccessfulCommand();
      }

      // Exactly +2 lore: ability triggered once, grants lore = damage removed.
      expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
    });

    it("does not trigger when the opponent removes damage from their own characters", () => {
      const opponentDamagedAlly = createMockCharacter({
        id: "isabela-caring-opp-damaged-ally",
        name: "Opponent Damaged Ally",
        cost: 2,
        willpower: 4,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [isabelaMadrigalCaringCultivator],
        },
        {
          play: [{ card: opponentDamagedAlly, damage: 2 }],
          hand: [healingGlow],
          inkwell: healingGlow.cost,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent heals their own damaged ally
      expect(
        testEngine.asPlayerTwo().playCard(healingGlow, {
          targets: [opponentDamagedAlly],
        }),
      ).toBeSuccessfulCommand();

      // Isabela's ability must not have triggered for player one
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });
  });
});
