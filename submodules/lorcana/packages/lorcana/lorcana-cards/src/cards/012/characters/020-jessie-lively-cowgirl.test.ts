import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { buzzsArm } from "../items/098-buzzs-arm";
import { jessieLivelyCowgirl } from "./020-jessie-lively-cowgirl";

const toyCharacterA = createMockCharacter({
  id: "jessie-test-toy-a",
  name: "Toy A",
  cost: 1,
  classifications: ["Storyborn", "Toy"],
});

const toyCharacterB = createMockCharacter({
  id: "jessie-test-toy-b",
  name: "Toy B",
  cost: 1,
  classifications: ["Storyborn", "Toy"],
});

const nonToyCharacter = createMockCharacter({
  id: "jessie-test-non-toy",
  name: "Non-Toy",
  cost: 1,
  classifications: ["Storyborn", "Hero"],
});

const cheapCard = createMockCharacter({
  id: "jessie-test-cheap",
  name: "Cheap Card",
  cost: 2,
});

const expensiveCard = createMockCharacter({
  id: "jessie-test-expensive",
  name: "Expensive Card",
  cost: 3,
});

const opposingCharacter = createMockCharacter({
  id: "jessie-test-opponent",
  name: "Opposing Character",
  cost: 2,
  strength: 3,
  willpower: 5,
});

describe("Jessie - Lively Cowgirl", () => {
  describe("PART OF A FAMILY - Whenever this character quests, if you have 2 or more other Toy characters in play, you may draw a card.", () => {
    it("draws a card when questing with 2+ other Toy characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: jessieLivelyCowgirl, isDrying: false }, toyCharacterA, toyCharacterB],
          deck: 10,
        },
        {
          deck: 5,
        },
      );

      const handCountBefore = testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count;

      expect(testEngine.asPlayerOne().quest(jessieLivelyCowgirl)).toBeSuccessfulCommand();

      // Triggered ability should be in bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional draw
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(jessieLivelyCowgirl, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Should have drawn 1 card
      expect(testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count).toBe(
        handCountBefore + 1,
      );
    });

    it("does not draw when fewer than 2 other Toy characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: jessieLivelyCowgirl, isDrying: false }, toyCharacterA],
          deck: 10,
        },
        {
          deck: 5,
        },
      );

      const handCountBefore = testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count;

      expect(testEngine.asPlayerOne().quest(jessieLivelyCowgirl)).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Hand count should be unchanged since condition was not met
      expect(testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count).toBe(
        handCountBefore,
      );
    });

    it("can decline the optional draw", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: jessieLivelyCowgirl, isDrying: false }, toyCharacterA, toyCharacterB],
          deck: 10,
        },
        {
          deck: 5,
        },
      );

      const handCountBefore = testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count;

      expect(testEngine.asPlayerOne().quest(jessieLivelyCowgirl)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline the draw
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(jessieLivelyCowgirl, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Hand should be unchanged
      expect(testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count).toBe(
        handCountBefore,
      );
    });
  });

  describe("YODEL-AY-HEE-HOO! - Whenever you pay 2 {I} or less to play a card, chosen opposing character gets -1 {S} until the start of your next turn.", () => {
    it("triggers when playing a card with cost 2 or less", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [jessieLivelyCowgirl],
          hand: [cheapCard],
          inkwell: cheapCard.cost,
          deck: 5,
        },
        {
          play: [opposingCharacter],
          deck: 5,
        },
      );

      const opposingId = testEngine.findCardInstanceId(opposingCharacter, "play", "player_two");
      const initialStrength = testEngine.getCard(opposingCharacter).strength!;

      expect(testEngine.asPlayerOne().playCard(cheapCard)).toBeSuccessfulCommand();

      // Triggered ability should be in bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Choose opposing character
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(jessieLivelyCowgirl, { targets: [opposingId] }),
      ).toBeSuccessfulCommand();

      // Opposing character should have -1 strength
      expect(testEngine.getCard(opposingCharacter).strength).toBe(initialStrength - 1);
    });

    it("auto-resolves with no effect when no opposing characters are in play (R10)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [jessieLivelyCowgirl],
          hand: [cheapCard],
          inkwell: cheapCard.cost,
          deck: 5,
        },
        {
          // no opposing characters
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(cheapCard)).toBeSuccessfulCommand();

      // YODEL-AY-HEE-HOO! triggers but has no valid target. The bag effect must
      // drain (auto-resolve to nothing) rather than leave the player stuck.
      testEngine.asPlayerOne().resolveAllBagEffects();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("release notes ruling: triggers based on total ink paid AFTER payment modifiers — paying 2 ink for a 3-cost action via -1 modifier triggers", () => {
      const expensiveAction = createMockAction({
        id: "jessie-release-expensive-action",
        name: "Expensive Discount Action",
        cost: 3,
        abilities: [
          {
            id: "jessie-release-expensive-action-1",
            type: "action",
            effect: { type: "draw", amount: 1, target: "CONTROLLER" },
            text: "Draw a card.",
          },
        ],
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [jessieLivelyCowgirl, buzzsArm],
          hand: [expensiveAction],
          inkwell: 2, // only 2 ink available — printed cost of 3 unaffordable
          deck: 5,
        },
        {
          play: [opposingCharacter],
          deck: 5,
        },
      );

      // Apply -1 cost modifier via Buzz's Arm — printed 3 → paid 2.
      expect(
        testEngine.asPlayerOne().activateAbility(buzzsArm, {
          ability: "SOME ASSEMBLY REQUIRED",
        }),
      ).toBeSuccessfulCommand();

      const opposingId = testEngine.findCardInstanceId(opposingCharacter, "play", "player_two");
      const initialStrength = testEngine.getCard(opposingCharacter).strength!;

      // Pay 2 ink to play a 3-cost action (modified). Total paid = 2 (≤2).
      expect(testEngine.asPlayerOne().playCard(expensiveAction)).toBeSuccessfulCommand();

      // Yodel-ay-hee-hoo! should trigger because total paid (2) is ≤ 2,
      // even though printed cost (3) is > 2.
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(jessieLivelyCowgirl, { targets: [opposingId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCard(opposingCharacter).strength).toBe(initialStrength - 1);
    });

    it("does not trigger when playing a card with cost 3 or more", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [jessieLivelyCowgirl],
          hand: [expensiveCard],
          inkwell: expensiveCard.cost,
          deck: 5,
        },
        {
          play: [opposingCharacter],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(expensiveCard)).toBeSuccessfulCommand();

      // Should not trigger for cards costing 3+
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
