import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { cantHoldItBackAnymore } from "../../010/actions/062-cant-hold-it-back-anymore";
import { meridaFormidableArcher } from "./191-merida-formidable-archer";
import { threeArrows } from "../actions/197-three-arrows";
import { tianaCelebratingPrincess } from "../../002/characters/196-tiana-celebrating-princess";
import { heHurledHisThunderbolt } from "../../010/actions/197-he-hurled-his-thunderbolt";
import { mosquitoBite } from "../../006/actions/096-mosquito-bite";

const threeArrowsMock = createMockAction({
  id: "three-arrows-mock",
  name: "Three Arrows",
  cost: 3,
});

const opposingCharacter = createMockCharacter({
  id: "merida-fa-opposing",
  name: "Opposing Character",
  cost: 3,
  strength: 2,
  willpower: 10,
});

const opposingCharacter2 = createMockCharacter({
  id: "merida-fa-opposing-2",
  name: "Opposing Character 2",
  cost: 3,
  strength: 2,
  willpower: 10,
});

const ownCharacter = createMockCharacter({
  id: "merida-fa-own",
  name: "Own Character",
  cost: 3,
  strength: 2,
  willpower: 10,
});

describe("Merida - Formidable Archer", () => {
  describe("FULL QUIVER - When you play this character, you may return an action card named Three Arrows from your discard to your hand.", () => {
    it("returns Three Arrows from discard to hand when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [meridaFormidableArcher],
          discard: [threeArrowsMock],
          inkwell: meridaFormidableArcher.cost,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(meridaFormidableArcher)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(meridaFormidableArcher, {
          resolveOptional: true,
          targets: [threeArrowsMock],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(threeArrowsMock)).toBe("hand");
    });

    it("does not return Three Arrows if declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [meridaFormidableArcher],
          discard: [threeArrowsMock],
          inkwell: meridaFormidableArcher.cost,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(meridaFormidableArcher)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(meridaFormidableArcher, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(threeArrowsMock)).toBe("discard");
    });

    it("does not trigger when Three Arrows is not in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [meridaFormidableArcher],
          inkwell: meridaFormidableArcher.cost,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(meridaFormidableArcher)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });

  describe("STEADY AIM - Whenever one of your actions deals damage to an opposing character, deal 2 damage to that character.", () => {
    it("deals 2 extra damage to opposing character hit by Three Arrows", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [meridaFormidableArcher],
          hand: [threeArrows],
          inkwell: threeArrows.cost,
          deck: 1,
        },
        {
          play: [opposingCharacter],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(threeArrows, { targets: [opposingCharacter] }),
      ).toBeSuccessfulCommand();

      // Decline the optional second hit so the action finishes and STEADY AIM flushes
      expect(
        testEngine.asPlayerOne().resolvePendingEffect(threeArrows, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Three Arrows deals 2 + STEADY AIM deals 2 = 4 total
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(4);
    });

    it("deals 2 extra damage to each character hit by Three Arrows when both targets used", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [meridaFormidableArcher],
          hand: [threeArrows],
          inkwell: threeArrows.cost,
          deck: 1,
        },
        {
          play: [opposingCharacter, opposingCharacter2],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(threeArrows, { targets: [opposingCharacter] }),
      ).toBeSuccessfulCommand();

      // Resolve optional second hit targeting opposingCharacter2
      expect(
        testEngine.asPlayerOne().resolvePendingEffect(threeArrows, {
          resolveOptional: true,
          targets: [opposingCharacter2],
        }),
      ).toBeSuccessfulCommand();

      // First target: Three Arrows 2 + STEADY AIM 2 = 4
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(4);
      // Second target: Three Arrows 1 + STEADY AIM 2 = 3
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter2)).toBe(3);
    });

    it("does NOT trigger when action damages own character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [meridaFormidableArcher, ownCharacter],
          hand: [threeArrows],
          inkwell: threeArrows.cost,
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(threeArrows, { targets: [ownCharacter] }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingEffect(threeArrows, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Only Three Arrows damage, no STEADY AIM bonus
      expect(testEngine.asPlayerOne().getDamage(ownCharacter)).toBe(2);
    });

    it("does NOT trigger when an action's damage is fully prevented by Resist", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [meridaFormidableArcher],
          hand: [threeArrows],
          inkwell: threeArrows.cost,
          deck: 1,
        },
        {
          play: [tianaCelebratingPrincess],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(threeArrows, { targets: [tianaCelebratingPrincess] }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingEffect(threeArrows, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(tianaCelebratingPrincess)).toBe(0);
    });

    it("does NOT trigger when an action puts damage counters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [meridaFormidableArcher],
          hand: [mosquitoBite],
          inkwell: mosquitoBite.cost,
          deck: 1,
        },
        {
          play: [opposingCharacter],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(mosquitoBite, { targets: [opposingCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(1);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });

  describe("STEADY AIM triggers on Song actions (BUG-13)", () => {
    it("deals 2 extra damage when He Hurled His Thunderbolt hits an opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [meridaFormidableArcher],
          hand: [heHurledHisThunderbolt],
          inkwell: heHurledHisThunderbolt.cost,
          deck: 1,
        },
        {
          play: [opposingCharacter],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(heHurledHisThunderbolt, { targets: [opposingCharacter] }),
      ).toBeSuccessfulCommand();

      // He Hurled His Thunderbolt deals 4 + STEADY AIM deals 2 = 6 total
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(6);
    });

    it("does NOT trigger when He Hurled His Thunderbolt targets own character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [meridaFormidableArcher, ownCharacter],
          hand: [heHurledHisThunderbolt],
          inkwell: heHurledHisThunderbolt.cost,
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(heHurledHisThunderbolt, { targets: [ownCharacter] }),
      ).toBeSuccessfulCommand();

      // Only He Hurled His Thunderbolt damage (4), no STEADY AIM bonus
      expect(testEngine.asPlayerOne().getDamage(ownCharacter)).toBe(4);
    });
  });

  describe("release notes ruling", () => {
    it("STEADY AIM does NOT trigger when an action MOVES damage instead of dealing it (Can't Hold It Back Anymore)", () => {
      // Q&A: Moving damage isn't the same as dealing damage. An action must
      // actually "deal" damage for Steady Aim to trigger.
      const ownDamagedAlly = createMockCharacter({
        id: "merida-release-own-damaged",
        name: "Own Damaged",
        cost: 2,
        strength: 2,
        willpower: 5,
      });

      const opposingTarget = createMockCharacter({
        id: "merida-release-opp-target",
        name: "Opposing Target",
        cost: 3,
        strength: 2,
        willpower: 10,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [meridaFormidableArcher, { card: ownDamagedAlly, damage: 3 }],
          hand: [cantHoldItBackAnymore],
          inkwell: cantHoldItBackAnymore.cost,
          deck: 1,
        },
        {
          play: [{ card: opposingTarget, isDrying: false }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(cantHoldItBackAnymore, { targets: [opposingTarget] }),
      ).toBeSuccessfulCommand();

      // The opposing character receives the moved damage counters (3)
      // but Steady Aim must NOT add an extra 2. So damage is exactly 3.
      expect(testEngine.asPlayerTwo().getDamage(opposingTarget)).toBe(3);
    });
  });

  describe("FULL QUIVER + STEADY AIM synergy with Three Arrows", () => {
    it("recovers Three Arrows via FULL QUIVER then amplifies its damage via STEADY AIM", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [meridaFormidableArcher],
          discard: [threeArrows],
          inkwell: meridaFormidableArcher.cost + threeArrows.cost,
          deck: 1,
        },
        {
          play: [opposingCharacter],
          deck: 1,
        },
      );

      // Play Merida — FULL QUIVER triggers, return Three Arrows to hand
      expect(testEngine.asPlayerOne().playCard(meridaFormidableArcher)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(meridaFormidableArcher, {
          resolveOptional: true,
          targets: [threeArrows],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(threeArrows)).toBe("hand");

      // Play Three Arrows — STEADY AIM amplifies the damage
      expect(
        testEngine.asPlayerOne().playCard(threeArrows, { targets: [opposingCharacter] }),
      ).toBeSuccessfulCommand();

      // Decline optional second hit to finish the action
      expect(
        testEngine.asPlayerOne().resolvePendingEffect(threeArrows, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Two Arrow + STEADY AIM: 2 + 2 = 4 total damage
      expect(testEngine.asPlayerTwo().getDamage(opposingCharacter)).toBe(4);
    });
  });
});
