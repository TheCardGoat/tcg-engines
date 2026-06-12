import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { buzzsArm } from "../items/098-buzzs-arm";
import { babyheadLeaderOfSidsToys } from "./119-babyhead-leader-of-sids-toys";

const cheapAlly = createMockCharacter({
  id: "babyhead-cheap-ally",
  name: "Cheap Ally",
  cost: 2,
  strength: 1,
  willpower: 1,
});

const expensiveAlly = createMockCharacter({
  id: "babyhead-expensive-ally",
  name: "Expensive Ally",
  cost: 5,
  strength: 2,
  willpower: 3,
});

const chosenCharacter = createMockCharacter({
  id: "babyhead-chosen",
  name: "Chosen Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const otherAlly = createMockCharacter({
  id: "babyhead-other-ally",
  name: "Other Ally",
  cost: 2,
  strength: 2,
  willpower: 2,
});

// Cost 3 so this action itself does not trigger "Tighten the Bolts" (pay 2 {I} or less).
const banishAction = createMockAction({
  id: "babyhead-banish-action",
  name: "Banish Action",
  cost: 3,
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

describe("Babyhead - Leader of Sid's Toys", () => {
  describe("Tighten the Bolts - Whenever you pay 2 {I} or less to play a card, chosen character gets +2 {S} this turn.", () => {
    it("grants +2 strength to chosen character when you play a card for 2 ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: babyheadLeaderOfSidsToys, isDrying: false },
            { card: chosenCharacter, isDrying: false },
          ],
          hand: [cheapAlly],
          inkwell: cheapAlly.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(cheapAlly)).toBeSuccessfulCommand();

      // Resolve Tighten the Bolts, choosing the chosenCharacter
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(babyheadLeaderOfSidsToys, {
          targets: [chosenCharacter],
        }),
      ).toBeSuccessfulCommand();

      const chosen = testEngine.asPlayerOne().getCard(chosenCharacter);
      expect(chosen.strength).toBe(chosenCharacter.strength + 2);
    });

    it("release notes ruling: triggers based on total ink paid AFTER payment modifiers — paying 2 ink for a 3-cost action via -1 modifier triggers", () => {
      // Q&A: Tighten the Bolts cares about total paid (post-modifiers).
      // Use Buzz's Arm SOME ASSEMBLY REQUIRED to reduce a 3-cost action's
      // cost by 1 and pay only 2 ink to play it.
      const threeCostAction = createMockAction({
        id: "babyhead-release-3cost-action",
        name: "Three Cost Action",
        cost: 3,
        abilities: [
          {
            id: "babyhead-release-3cost-action-1",
            type: "action",
            text: "Draw a card.",
            effect: { type: "draw", amount: 1, target: "CONTROLLER" },
          },
        ],
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: babyheadLeaderOfSidsToys, isDrying: false },
            { card: chosenCharacter, isDrying: false },
            buzzsArm,
          ],
          hand: [threeCostAction],
          inkwell: 2,
          deck: 5,
        },
        { deck: 2 },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(buzzsArm, {
          ability: "SOME ASSEMBLY REQUIRED",
        }),
      ).toBeSuccessfulCommand();

      // Pay 2 ink for the (modified-to-2) action.
      expect(testEngine.asPlayerOne().playCard(threeCostAction)).toBeSuccessfulCommand();

      // Tighten the Bolts triggers because total ink paid was 2.
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(babyheadLeaderOfSidsToys, {
          targets: [chosenCharacter],
        }),
      ).toBeSuccessfulCommand();

      const chosen = testEngine.asPlayerOne().getCard(chosenCharacter);
      expect(chosen.strength).toBe(chosenCharacter.strength + 2);
    });

    it("does NOT trigger when you play a card for more than 2 ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: babyheadLeaderOfSidsToys, isDrying: false },
            { card: chosenCharacter, isDrying: false },
          ],
          hand: [expensiveAlly],
          inkwell: expensiveAlly.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(expensiveAlly)).toBeSuccessfulCommand();

      // The trigger fires but its condition fails, so nothing is enqueued for resolution.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      const chosen = testEngine.asPlayerOne().getCard(chosenCharacter);
      expect(chosen.strength).toBe(chosenCharacter.strength);
    });
  });

  describe("Replacement Parts - During your turn, whenever one of your other characters is banished, draw a card.", () => {
    it("draws a card when another of your characters is banished during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: babyheadLeaderOfSidsToys, isDrying: false },
            { card: otherAlly, isDrying: false },
          ],
          hand: [banishAction],
          inkwell: banishAction.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [otherAlly] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(otherAlly)).toBe("discard");

      // The draw is deterministic with no choices, so the bag auto-resolves.
      // Hand count: -1 (played banishAction) + 1 (drew from Replacement Parts) = net 0
      expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(handBefore);
    });

    it("does NOT trigger when Babyhead himself is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: babyheadLeaderOfSidsToys, isDrying: false }],
          hand: [banishAction],
          inkwell: banishAction.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [babyheadLeaderOfSidsToys] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(babyheadLeaderOfSidsToys)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("does NOT trigger during the opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: babyheadLeaderOfSidsToys, isDrying: false },
            { card: otherAlly, isDrying: false },
          ],
          deck: 2,
        },
        {
          hand: [banishAction],
          inkwell: banishAction.cost,
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().playCard(banishAction, { targets: [otherAlly] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(otherAlly)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
