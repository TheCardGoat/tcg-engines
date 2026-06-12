import { describe, expect, it } from "bun:test";
import type { CardInstanceId, PlayerId } from "#core";
import { evaluateCondition, type ConditionEvaluationContext } from "./condition-evaluator";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "../testing";

describe("condition-evaluator", () => {
  it("evaluates during-turn using status.turnOwnerId over priority holder", () => {
    const p1 = "player_one" as PlayerId;
    const p2 = "player_two" as PlayerId;
    const ctx: ConditionEvaluationContext = {
      framework: {
        state: {
          priority: { holder: p1, windowOpen: true, passSequence: [], stackDepth: 0 },
          status: { turn: 2, gameEnded: false, otp: p1, turnOwnerId: p2 },
          playerIds: [p1, p2],
          currentPlayer: p1,
        },
        zones: {
          getCards: () => [],
        },
      },
      cards: {
        getDefinition: () => undefined,
        require: () => ({}),
        get: () => undefined,
      },
      G: {
        lore: { [p1]: 0, [p2]: 0 },
        turnMetadata: {
          cardsPlayedThisTurn: [],
          charactersQuesting: [],
          inkedThisTurn: [],
          cardsPutIntoInkwellThisTurn: [],
          additionalInkwellActions: 0,
          shiftPlayedThisTurn: [],
          challengesByPlayerThisTurn: {},
          damagedCharactersByOwnerThisTurn: {},
          damageRemovedByPlayerThisTurn: {},
          challengedCharactersThisTurn: [],
          banishedCharactersThisTurn: [],
          banishedCharactersInChallengeByOwnerThisTurn: {},
          discardCardsLeftThisTurn: 0,
          cardsPutIntoDiscardThisTurnByOwner: {},
          pendingCostReductionsByPlayer: {},
          cardsDrawnThisTurnByPlayer: {},
        },
        triggeredAbilities: {
          pendingEvents: [],
          registrations: [],
          bag: { nextSeq: 1, items: [] },
          usageLedger: { occurrences: {}, resolutions: {} },
        },
        pendingEffects: [],
        turnsCompletedByPlayer: { [p1]: 1, [p2]: 0 },
        continuousEffects: { nextSeq: 1, instances: [], byTarget: {} },
        temporaryPlayerRestrictions: {
          restrictionsByPlayer: {},
          startsByPlayer: {},
          payloadsByPlayer: {},
        },
        playFromUnderPermissions: { permissionsByPlayer: {} },
        replacementEffects: {
          nextSeq: 1,
          registrations: [],
          usageLedger: { perTurn: {} },
          byEventKind: {},
        },
        staticEffectsVersion: 0,
      },
      playerId: p1,
      sourceCardId: "source" as CardInstanceId,
    };

    expect(evaluateCondition({ type: "during-turn", whose: "opponent" }, ctx)).toBe(true);
  });

  describe("stat-threshold condition", () => {
    const conditionalLoreCard = createMockCharacter({
      id: "stat-threshold-source",
      name: "Conditional Lore Card",
      cost: 1,
      strength: 0,
      willpower: 3,
      lore: 1,
      abilities: [
        {
          id: "st-test-1",
          type: "static",
          text: "While this character has 3 strength or more, she gets +2 lore.",
          condition: {
            type: "stat-threshold",
            stat: "strength",
            value: 3,
            comparison: "greater-or-equal",
            target: "SELF",
          },
          effect: {
            type: "modify-stat",
            stat: "lore",
            modifier: 2,
            target: "SELF",
          },
        },
      ],
    });

    const strengthBuffCard = createMockCharacter({
      id: "stat-threshold-buff",
      name: "Strength Buffer",
      cost: 2,
      strength: 2,
      willpower: 2,
      lore: 1,
      abilities: [
        {
          id: "st-test-2",
          type: "static",
          text: "Other characters you control get +3 strength.",
          effect: {
            type: "modify-stat",
            stat: "strength",
            modifier: 3,
            target: {
              selector: "all",
              count: "all",
              zones: ["play"],
              owner: "you",
              excludeSelf: true,
            },
          },
        },
      ],
    });

    it("does not grant lore bonus when strength is below threshold", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [conditionalLoreCard],
        deck: 5,
      });

      // Strength is 0, threshold is 3 => condition fails => lore should be base 1
      expect(testEngine.asPlayerOne().getCardLore(conditionalLoreCard)).toBe(1);
    });

    it("grants lore bonus when strength meets threshold", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [conditionalLoreCard, strengthBuffCard],
        deck: 5,
      });

      // strengthBuffCard gives +3 strength => 0+3 = 3 >= 3 => condition passes => lore = 1+2 = 3
      expect(testEngine.asPlayerOne().getCardStrength(conditionalLoreCard)).toBe(3);
      expect(testEngine.asPlayerOne().getCardLore(conditionalLoreCard)).toBe(3);
    });

    it("does not grant lore bonus when strength is just below threshold", () => {
      const justBelowBuffCard = createMockCharacter({
        id: "stat-threshold-small-buff",
        name: "Small Buffer",
        cost: 1,
        strength: 1,
        willpower: 1,
        lore: 1,
        abilities: [
          {
            id: "st-test-3",
            type: "static",
            text: "Other characters you control get +2 strength.",
            effect: {
              type: "modify-stat",
              stat: "strength",
              modifier: 2,
              target: {
                selector: "all",
                count: "all",
                zones: ["play"],
                owner: "you",
                excludeSelf: true,
              },
            },
          },
        ],
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [conditionalLoreCard, justBelowBuffCard],
        deck: 5,
      });

      // +2 strength => 0+2 = 2, which is < 3 => condition fails => lore stays at 1
      expect(testEngine.asPlayerOne().getCardStrength(conditionalLoreCard)).toBe(2);
      expect(testEngine.asPlayerOne().getCardLore(conditionalLoreCard)).toBe(1);
    });
  });
});
