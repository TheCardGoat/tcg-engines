import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { holdStill } from "../../002/actions/028-hold-still";
import { healingGlow } from "../../001/actions/028-healing-glow";
import { isabelaMadrigalPerfectlyInControl } from "./153-isabela-madrigal-perfectly-in-control";
import { pepaMadrigalCalmBeforeTheStorm } from "./056-pepa-madrigal-calm-before-the-storm";

const allyA = createMockCharacter({
  id: "pepa-calm-ally-a",
  name: "Ally A",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const allyB = createMockCharacter({
  id: "pepa-calm-ally-b",
  name: "Ally B",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const damagedAlly = createMockCharacter({
  id: "pepa-calm-damaged-ally",
  name: "Damaged Ally",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("Pepa Madrigal - Calm Before the Storm", () => {
  it("is no longer marked as missing executable coverage", () => {
    expect(pepaMadrigalCalmBeforeTheStorm.missingImplementation).toBeUndefined();
    expect(pepaMadrigalCalmBeforeTheStorm.missingTests).toBeUndefined();
  });

  describe("STORMY WEATHER - When you play this character, deal 1 damage to each of your other characters.", () => {
    it("deals 1 damage to each of your other characters (not self, not opponents)", () => {
      const opponentChar = createMockCharacter({
        id: "pepa-calm-opponent",
        name: "Opponent",
        cost: 2,
        strength: 2,
        willpower: 3,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [pepaMadrigalCalmBeforeTheStorm],
          play: [allyA, allyB],
          inkwell: pepaMadrigalCalmBeforeTheStorm.cost,
        },
        {
          play: [opponentChar],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(pepaMadrigalCalmBeforeTheStorm),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(allyA)).toBe(1);
      expect(testEngine.asPlayerOne().getDamage(allyB)).toBe(1);
      expect(testEngine.asPlayerOne().getDamage(pepaMadrigalCalmBeforeTheStorm)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(opponentChar)).toBe(0);
    });
  });

  describe("SILVER LINING - Once during your turn, whenever you remove 1 or more damage from one of your characters, draw a card.", () => {
    it("draws a card when you remove damage from one of your characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pepaMadrigalCalmBeforeTheStorm, { card: damagedAlly, damage: 2 }],
          hand: [holdStill],
          inkwell: holdStill.cost,
          deck: 3,
        },
        {},
      );

      expect(
        testEngine.asPlayerOne().playCard(holdStill, { targets: [damagedAlly] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(damagedAlly)?.damage).toBe(0);

      // Played holdStill (-1 hand), SILVER LINING draws 1 (-1 deck, +1 hand).
      // Net: hand unchanged (1), deck 3 -> 2.
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 2 });
    });

    it("only triggers once per turn", () => {
      const secondDamagedAlly = createMockCharacter({
        id: "pepa-calm-damaged-ally-2",
        name: "Damaged Ally 2",
        cost: 2,
        strength: 2,
        willpower: 4,
      });

      const thirdHoldStill = {
        ...holdStill,
        id: `${holdStill.id}-2`,
      };

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            pepaMadrigalCalmBeforeTheStorm,
            { card: damagedAlly, damage: 2 },
            { card: secondDamagedAlly, damage: 2 },
          ],
          hand: [holdStill, thirdHoldStill],
          inkwell: holdStill.cost * 2,
          deck: 5,
        },
        {},
      );

      expect(
        testEngine.asPlayerOne().playCard(holdStill, { targets: [damagedAlly] }),
      ).toBeSuccessfulCommand();

      // After first heal: played holdStill (-1) + drew from SILVER LINING (+1). Hand 2, deck 4.
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 2, deck: 4 });

      expect(
        testEngine.asPlayerOne().playCard(thirdHoldStill, { targets: [secondDamagedAlly] }),
      ).toBeSuccessfulCommand();

      // Second heal in the same turn should NOT produce an additional draw.
      // Played thirdHoldStill (-1), no draw. Hand 1, deck still 4.
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 4 });
    });

    it("does NOT trigger when you remove damage from an opponent's character", () => {
      const opponentDamagedChar = createMockCharacter({
        id: "pepa-calm-opp-damaged",
        name: "Opponent Damaged Char",
        cost: 2,
        strength: 2,
        willpower: 5,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pepaMadrigalCalmBeforeTheStorm],
          hand: [healingGlow],
          inkwell: healingGlow.cost,
          deck: 3,
        },
        {
          play: [{ card: opponentDamagedChar, damage: 2 }],
        },
      );

      // Player one heals the opponent's character — this is NOT "one of your characters"
      expect(
        testEngine.asPlayerOne().playCard(healingGlow, { targets: [opponentDamagedChar] }),
      ).toBeSuccessfulCommand();

      // SILVER LINING must NOT have triggered
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      // Hand count: started with healingGlow (1), played it (0) — no draw
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 3 });
    });
  });

  describe("release notes ruling", () => {
    it("triggers when damage is MOVED from one of your characters (moving counts as removing)", () => {
      // Q&A: Moving damage counts as removing damage; Silver Lining must
      // trigger on damage moves. Use Isabela – Perfectly in Control's quest
      // ability to MOVE damage between two friendly characters.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            pepaMadrigalCalmBeforeTheStorm,
            { card: isabelaMadrigalPerfectlyInControl, isDrying: false },
            { card: damagedAlly, damage: 2 },
          ],
          deck: 5,
        },
        {},
      );

      const handBefore = testEngine.asPlayerOne().getZonesCardCount("player_one").hand;
      const deckBefore = testEngine.asPlayerOne().getZonesCardCount("player_one").deck;

      // Quest with Isabela-PIC, then accept Feel Better and target damagedAlly.
      expect(
        testEngine.asPlayerOne().quest(isabelaMadrigalPerfectlyInControl),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(isabelaMadrigalPerfectlyInControl, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [damagedAlly] }),
      ).toBeSuccessfulCommand();

      // Damage moved from damagedAlly → Isabela-PIC.
      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(0);
      expect(testEngine.asPlayerOne().getDamage(isabelaMadrigalPerfectlyInControl)).toBe(2);

      // SILVER LINING should have drawn 1 card.
      const handAfter = testEngine.asPlayerOne().getZonesCardCount("player_one").hand;
      const deckAfter = testEngine.asPlayerOne().getZonesCardCount("player_one").deck;
      expect(handAfter - handBefore).toBe(1);
      expect(deckBefore - deckAfter).toBe(1);
    });
  });
});
