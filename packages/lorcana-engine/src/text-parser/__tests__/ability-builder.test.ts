// Unit tests for the ability builder system

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import {
  chosenCharacter,
  self,
} from "@lorcanito/lorcana-engine/abilities/targets";
import {
  buildAbilitiesFromClauses,
  buildAbilitiesWithGrouping,
  buildAbilitiesWithModalSupport,
  buildAbilitiesWithTriggeredSupport,
  buildDelayedTriggeredAbilityFromClause,
  buildFloatingTriggeredAbilityFromClause,
  buildModalAbilityFromClause,
  buildResolutionAbilityFromEffects,
  combineEffectsIntoSingleAbility,
  createDelayedTriggeredAbility,
  createFloatingTriggeredAbility,
  createModalEffect,
  createModalEffectMode,
  createResolutionAbility,
  detectDependentEffects,
  isDelayedTriggeredClause,
  isDetrimentalAbility,
  isFloatingTriggeredClause,
  isModalClause,
  parseModalOptions,
  parseTimingFromClause,
  shouldCombineClauses,
  shouldResolveEffectsIndividually,
} from "../ability-builder";
import type { ParsedClause, ParsedEffect } from "../types";

describe("Ability Builder", () => {
  describe("detectDependentEffects", () => {
    it("should return false for single effect", () => {
      const effects: ParsedEffect[] = [
        {
          type: "draw",
          amount: 1,
          parameters: {},
        },
      ];

      expect(detectDependentEffects(effects)).toBe(false);
    });

    it("should return false for empty effects", () => {
      expect(detectDependentEffects([])).toBe(false);
    });

    it("should return true when effect has dependsOnPrevious parameter", () => {
      const effects: ParsedEffect[] = [
        {
          type: "draw",
          amount: 1,
          parameters: {},
        },
        {
          type: "damage",
          amount: 2,
          target: chosenCharacter,
          parameters: { dependsOnPrevious: true },
        },
      ];

      expect(detectDependentEffects(effects)).toBe(true);
    });

    it("should return true when effect text contains dependency keywords", () => {
      const effects: ParsedEffect[] = [
        {
          type: "draw",
          amount: 1,
          parameters: {},
        },
        {
          type: "banish",
          target: chosenCharacter,
          parameters: { originalText: "then banish chosen character" },
        },
      ];

      expect(detectDependentEffects(effects)).toBe(true);
    });

    it("should return false for independent effects", () => {
      const effects: ParsedEffect[] = [
        {
          type: "draw",
          amount: 1,
          parameters: {},
        },
        {
          type: "damage",
          amount: 2,
          target: chosenCharacter,
          parameters: {},
        },
      ];

      expect(detectDependentEffects(effects)).toBe(false);
    });
  });

  describe("shouldResolveEffectsIndividually", () => {
    it("should return false for single effect", () => {
      const effects: ParsedEffect[] = [
        {
          type: "draw",
          amount: 1,
          parameters: {},
        },
      ];

      expect(shouldResolveEffectsIndividually(effects)).toBe(false);
    });

    it("should return true for effects with different targets", () => {
      const effects: ParsedEffect[] = [
        {
          type: "draw",
          amount: 1,
          target: self,
          parameters: {},
        },
        {
          type: "damage",
          amount: 2,
          target: chosenCharacter,
          parameters: {},
        },
      ];

      expect(shouldResolveEffectsIndividually(effects)).toBe(true);
    });

    it("should return true for multiple individual-type effects", () => {
      const effects: ParsedEffect[] = [
        {
          type: "draw",
          amount: 1,
          parameters: {},
        },
        {
          type: "damage",
          amount: 2,
          target: chosenCharacter,
          parameters: {},
        },
      ];

      expect(shouldResolveEffectsIndividually(effects)).toBe(true);
    });

    it("should return true for effects with different durations", () => {
      const effects: ParsedEffect[] = [
        {
          type: "attribute",
          amount: 2,
          target: chosenCharacter,
          duration: "turn",
          parameters: { attribute: "strength" },
        },
        {
          type: "attribute",
          amount: 1,
          target: chosenCharacter,
          parameters: { attribute: "willpower" },
        },
      ];

      expect(shouldResolveEffectsIndividually(effects)).toBe(true);
    });
  });

  describe("isDetrimentalAbility", () => {
    it("should return true for damage effects", () => {
      const effects: ParsedEffect[] = [
        {
          type: "damage",
          amount: 2,
          target: chosenCharacter,
          parameters: {},
        },
      ];

      expect(isDetrimentalAbility(effects)).toBe(true);
    });

    it("should return true for banish effects", () => {
      const effects: ParsedEffect[] = [
        {
          type: "banish",
          target: chosenCharacter,
          parameters: {},
        },
      ];

      expect(isDetrimentalAbility(effects)).toBe(true);
    });

    it("should return false for beneficial effects", () => {
      const effects: ParsedEffect[] = [
        {
          type: "draw",
          amount: 1,
          parameters: {},
        },
        {
          type: "attribute",
          amount: 2,
          target: chosenCharacter,
          parameters: { attribute: "strength" },
        },
      ];

      expect(isDetrimentalAbility(effects)).toBe(false);
    });
  });

  describe("createResolutionAbility", () => {
    it("should create basic resolution ability", () => {
      const effects = [
        {
          type: "draw" as const,
          amount: 1,
          target: self,
        },
      ];

      const ability = createResolutionAbility(effects);

      expect(ability).toEqual({
        type: "resolution",
        effects,
      });
    });

    it("should create resolution ability with options", () => {
      const effects = [
        {
          type: "draw" as const,
          amount: 1,
          target: self,
        },
      ];

      const ability = createResolutionAbility(effects, {
        name: "Test Ability",
        optional: true,
        resolveEffectsIndividually: true,
        dependentEffects: true,
      });

      expect(ability).toEqual({
        type: "resolution",
        effects,
        name: "Test Ability",
        optional: true,
        resolveEffectsIndividually: true,
        dependentEffects: true,
      });
    });
  });

  describe("buildResolutionAbilityFromEffects", () => {
    it("should build ability from single effect", () => {
      const parsedEffects: ParsedEffect[] = [
        {
          type: "draw",
          amount: 1,
          parameters: {},
        },
      ];

      const ability = buildResolutionAbilityFromEffects(parsedEffects);

      expect(ability.type).toBe("resolution");
      expect(ability.effects).toHaveLength(1);
      expect(ability.effects?.[0]?.type).toBe("draw");
      expect(ability.resolveEffectsIndividually).toBe(false);
      expect(ability.dependentEffects).toBe(false);
    });

    it("should build ability with dependent effects", () => {
      const parsedEffects: ParsedEffect[] = [
        {
          type: "draw",
          amount: 1,
          parameters: {},
        },
        {
          type: "banish",
          target: chosenCharacter,
          parameters: { originalText: "then banish chosen character" },
        },
      ];

      const ability = buildResolutionAbilityFromEffects(parsedEffects);

      expect(ability.dependentEffects).toBe(true);
      expect(ability.resolveEffectsIndividually).toBe(true);
    });

    it("should build detrimental ability", () => {
      const parsedEffects: ParsedEffect[] = [
        {
          type: "damage",
          amount: 2,
          target: chosenCharacter,
          parameters: {},
        },
      ];

      const ability = buildResolutionAbilityFromEffects(parsedEffects);

      expect(ability.detrimental).toBe(true);
    });

    it("should throw error for empty effects", () => {
      expect(() => buildResolutionAbilityFromEffects([])).toThrow(
        "Cannot build ability from empty effects array",
      );
    });
  });

  describe("shouldCombineClauses", () => {
    it("should return false for single clause", () => {
      const clauses: ParsedClause[] = [
        {
          text: "Draw a card",
          type: "effect",
          effects: [
            {
              type: "draw",
              amount: 1,
              parameters: {},
            },
          ],
        },
      ];

      expect(shouldCombineClauses(clauses)).toBe(false);
    });

    it("should return true for clauses with dependencies", () => {
      const clauses: ParsedClause[] = [
        {
          text: "Draw a card",
          type: "effect",
          effects: [
            {
              type: "draw",
              amount: 1,
              parameters: {},
            },
          ],
        },
        {
          text: "then banish chosen character",
          type: "effect",
          effects: [
            {
              type: "banish",
              target: chosenCharacter,
              parameters: {},
            },
          ],
          dependencies: ["Draw a card"],
        },
      ];

      expect(shouldCombineClauses(clauses)).toBe(true);
    });

    it("should return true for clauses with sequential types", () => {
      const clauses: ParsedClause[] = [
        {
          text: "if you have 5 or more cards in hand",
          type: "condition",
          effects: [],
        },
        {
          text: "draw a card",
          type: "effect",
          effects: [
            {
              type: "draw",
              amount: 1,
              parameters: {},
            },
          ],
        },
      ];

      expect(shouldCombineClauses(clauses)).toBe(true);
    });
  });

  describe("buildAbilitiesFromClauses", () => {
    it("should build abilities from multiple clauses", () => {
      const clauses: ParsedClause[] = [
        {
          text: "Draw a card",
          type: "effect",
          effects: [
            {
              type: "draw",
              amount: 1,
              parameters: {},
            },
          ],
        },
        {
          text: "Deal 2 damage to chosen character",
          type: "effect",
          effects: [
            {
              type: "damage",
              amount: 2,
              target: chosenCharacter,
              parameters: {},
            },
          ],
        },
      ];

      const abilities = buildAbilitiesFromClauses(clauses);

      expect(abilities).toHaveLength(2);
      expect(abilities[0]?.effects?.[0]?.type).toBe("draw");
      expect(abilities[1]?.effects?.[0]?.type).toBe("damage");
      expect(abilities[0]?.text).toBe("Draw a card");
      expect(abilities[1]?.text).toBe("Deal 2 damage to chosen character");
    });

    it("should skip clauses with no effects", () => {
      const clauses: ParsedClause[] = [
        {
          text: "Draw a card",
          type: "effect",
          effects: [
            {
              type: "draw",
              amount: 1,
              parameters: {},
            },
          ],
        },
        {
          text: "empty clause",
          type: "effect",
          effects: [],
        },
      ];

      const abilities = buildAbilitiesFromClauses(clauses);

      expect(abilities).toHaveLength(1);
      expect(abilities[0]?.effects?.[0]?.type).toBe("draw");
    });
  });

  describe("buildAbilitiesWithGrouping", () => {
    it("should return empty array for empty clauses", () => {
      const abilities = buildAbilitiesWithGrouping([]);
      expect(abilities).toEqual([]);
    });

    it("should combine dependent clauses into single ability", () => {
      const clauses: ParsedClause[] = [
        {
          text: "Draw a card",
          type: "effect",
          effects: [
            {
              type: "draw",
              amount: 1,
              parameters: {},
            },
          ],
        },
        {
          text: "then banish chosen character",
          type: "effect",
          effects: [
            {
              type: "banish",
              target: chosenCharacter,
              parameters: {},
            },
          ],
          dependencies: ["Draw a card"],
        },
      ];

      const abilities = buildAbilitiesWithGrouping(clauses);

      expect(abilities).toHaveLength(1);
      expect(abilities[0]?.effects).toHaveLength(2);
      expect(abilities[0]?.text).toBe(
        "Draw a card then banish chosen character",
      );
      expect(abilities[0]?.dependentEffects).toBe(true);
    });

    it("should build separate abilities for independent clauses", () => {
      const clauses: ParsedClause[] = [
        {
          text: "Draw a card",
          type: "effect",
          effects: [
            {
              type: "draw",
              amount: 1,
              parameters: {},
            },
          ],
        },
        {
          text: "Deal 2 damage to chosen character",
          type: "effect",
          effects: [
            {
              type: "damage",
              amount: 2,
              target: chosenCharacter,
              parameters: {},
            },
          ],
        },
      ];

      const abilities = buildAbilitiesWithGrouping(clauses);

      expect(abilities).toHaveLength(2);
      expect(abilities[0]?.effects?.[0]?.type).toBe("draw");
      expect(abilities[1]?.effects?.[0]?.type).toBe("damage");
    });
  });

  describe("combineEffectsIntoSingleAbility", () => {
    it("should combine multiple effects into single ability", () => {
      const parsedEffects: ParsedEffect[] = [
        {
          type: "draw",
          amount: 1,
          parameters: {},
        },
        {
          type: "damage",
          amount: 2,
          target: chosenCharacter,
          parameters: {},
        },
      ];

      const ability = combineEffectsIntoSingleAbility(parsedEffects);

      expect(ability.effects).toHaveLength(2);
      expect(ability.effects?.[0]?.type).toBe("draw");
      expect(ability.effects?.[1]?.type).toBe("damage");
      expect(ability.resolveEffectsIndividually).toBe(true);
    });
  });
});
describe("Modal Effect Support", () => {
  describe("createModalEffectMode", () => {
    it("should create modal effect mode from parsed effects", () => {
      const parsedEffects: ParsedEffect[] = [
        {
          type: "draw",
          amount: 1,
          parameters: {},
        },
      ];

      const mode = createModalEffectMode("1", "Draw a card", parsedEffects);

      expect(mode).toEqual({
        id: "1",
        text: "Draw a card",
        effects: [
          {
            type: "draw",
            amount: 1,
            target: self,
          },
        ],
      });
    });

    it("should create modal effect mode with options", () => {
      const parsedEffects: ParsedEffect[] = [
        {
          type: "damage",
          amount: 2,
          target: chosenCharacter,
          parameters: {},
        },
      ];

      const mode = createModalEffectMode("2", "Deal 2 damage", parsedEffects, {
        optional: true,
        responder: "opponent",
      });

      expect(mode.id).toBe("2");
      expect(mode.text).toBe("Deal 2 damage");
      expect(mode.optional).toBe(true);
      expect(mode.responder).toBe("opponent");
      expect(mode.effects).toHaveLength(1);
      expect(mode.effects?.[0]?.type).toBe("damage");
    });
  });

  describe("createModalEffect", () => {
    it("should create modal effect from modes", () => {
      const modes = [
        {
          id: "1",
          text: "Draw a card",
          effects: [
            {
              type: "draw" as const,
              amount: 1,
              target: self,
            },
          ],
        },
        {
          id: "2",
          text: "Deal 2 damage",
          effects: [
            {
              type: "damage" as const,
              amount: 2,
              target: chosenCharacter,
            },
          ],
        },
      ];

      const modalEffect = createModalEffect(modes);

      expect(modalEffect.type).toBe("modal");
      expect(modalEffect.modes).toEqual(modes);
      expect(modalEffect.target).toBeDefined(); // Has placeholder target
    });
  });

  describe("parseModalOptions", () => {
    it("should parse simple modal options", () => {
      const optionsText = "Draw a card or deal 2 damage";

      const { modes, errors } = parseModalOptions(optionsText);

      expect(errors).toEqual([]);
      expect(modes).toHaveLength(2);
      expect(modes[0]?.id).toBe("1");
      expect(modes[0]?.text).toBe("Draw a card");
      expect(modes[1]?.id).toBe("2");
      expect(modes[1]?.text).toBe("deal 2 damage");
    });

    it("should parse complex modal options", () => {
      const optionsText =
        "Draw 2 cards or deal 3 damage to chosen character or banish all characters";

      const { modes, errors } = parseModalOptions(optionsText);

      expect(errors).toEqual([]);
      expect(modes).toHaveLength(3);
      expect(modes[0]?.text).toBe("Draw 2 cards");
      expect(modes[1]?.text).toBe("deal 3 damage to chosen character");
      expect(modes[2]?.text).toBe("banish all characters");
    });

    it("should handle empty options text", () => {
      const { modes, errors } = parseModalOptions("");

      expect(modes).toEqual([]);
      expect(errors).toContain("No modal options found in text");
    });

    it("should handle single option", () => {
      const optionsText = "Draw a card";

      const { modes, errors } = parseModalOptions(optionsText);

      expect(errors).toEqual([]);
      expect(modes).toHaveLength(1);
      expect(modes[0]?.text).toBe("Draw a card");
    });
  });

  describe("isModalClause", () => {
    it("should identify modal clause by type", () => {
      const clause: ParsedClause = {
        text: "Choose one: Draw a card or deal damage",
        type: "modal",
        effects: [],
      };

      expect(isModalClause(clause)).toBe(true);
    });

    it("should identify modal clause by parameters", () => {
      const clause: ParsedClause = {
        text: "Choose one: Draw a card or deal damage",
        type: "effect",
        effects: [],
      };

      expect(isModalClause(clause)).toBe(true);
    });

    it("should identify modal clause by text pattern", () => {
      const clause: ParsedClause = {
        text: "Choose one: Draw a card or deal damage",
        type: "effect",
        effects: [],
      };

      expect(isModalClause(clause)).toBe(true);
    });

    it("should not identify non-modal clause", () => {
      const clause: ParsedClause = {
        text: "Draw a card",
        type: "effect",
        effects: [
          {
            type: "draw",
            amount: 1,
            parameters: {},
          },
        ],
      };

      expect(isModalClause(clause)).toBe(false);
    });
  });

  describe("buildModalAbilityFromClause", () => {
    it("should build modal ability from clause", () => {
      const clause: ParsedClause = {
        text: "Choose one: Draw a card or deal 2 damage",
        type: "modal",
        effects: [],
      };

      const { ability, errors } = buildModalAbilityFromClause(clause);

      expect(errors).toEqual([]);
      expect(ability).toBeDefined();
      expect(ability!.type).toBe("resolution");
      expect(ability!.effects).toHaveLength(1);
      expect(ability?.effects?.[0]?.type).toBe("modal");
      expect((ability!.effects[0] as any).modes).toHaveLength(2);
    });

    it("should handle clause with no options text", () => {
      const clause: ParsedClause = {
        text: "Choose one:",
        type: "modal",
        effects: [],
      };

      const { ability, errors } = buildModalAbilityFromClause(clause);

      expect(ability).toBeUndefined();
      expect(errors).toContain("No modal options text found in clause");
    });

    it("should handle non-modal clause", () => {
      const clause: ParsedClause = {
        text: "Draw a card",
        type: "effect",
        effects: [],
      };

      const { ability, errors } = buildModalAbilityFromClause(clause);

      expect(ability).toBeUndefined();
      expect(errors).toContain("Expected modal clause, got effect");
    });
  });

  describe("buildAbilitiesWithModalSupport", () => {
    it("should build abilities with modal support", () => {
      const clauses: ParsedClause[] = [
        {
          text: "Draw a card",
          type: "effect",
          effects: [
            {
              type: "draw",
              amount: 1,
              parameters: {},
            },
          ],
        },
        {
          text: "Choose one: Deal 2 damage or banish chosen character",
          type: "modal",
          effects: [],
        },
      ];

      const { abilities, errors } = buildAbilitiesWithModalSupport(clauses);

      expect(errors).toEqual([]);
      expect(abilities).toHaveLength(2);
      expect(abilities[0]?.effects?.[0]?.type).toBe("draw");
      expect(abilities[1]?.effects?.[0]?.type).toBe("modal");
    });

    it("should handle mixed clauses with errors", () => {
      const clauses: ParsedClause[] = [
        {
          text: "Choose one:",
          type: "modal",
          effects: [],
        },
        {
          text: "Draw a card",
          type: "effect",
          effects: [
            {
              type: "draw",
              amount: 1,
              parameters: {},
            },
          ],
        },
      ];

      const { abilities, errors } = buildAbilitiesWithModalSupport(clauses);

      expect(abilities).toHaveLength(1); // Only the valid clause
      expect(abilities[0]?.effects?.[0]?.type).toBe("draw");
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
describe("Triggered Ability Support", () => {
  describe("createDelayedTriggeredAbility", () => {
    it("should create delayed triggered ability from parsed effects", () => {
      const parsedEffects: ParsedEffect[] = [
        {
          type: "banish",
          target: chosenCharacter,
          parameters: {},
        },
      ];

      const ability = createDelayedTriggeredAbility(parsedEffects, {
        text: "At the end of your turn, banish chosen character",
      });

      expect(ability.type).toBe("static-triggered");
      expect(ability.text).toBe(
        "At the end of your turn, banish chosen character",
      );
      expect(ability.layer.effects).toHaveLength(1);
      expect(ability.layer?.effects?.[0]?.type).toBe("banish");
    });

    it("should create delayed triggered ability with options", () => {
      const parsedEffects: ParsedEffect[] = [
        {
          type: "damage",
          amount: 2,
          target: chosenCharacter,
          parameters: {},
        },
      ];

      const ability = createDelayedTriggeredAbility(parsedEffects, {
        optional: true,
        detrimental: true,
        resolveEffectsIndividually: true,
      });

      expect(ability.optional).toBe(true);
      expect(ability.layer.detrimental).toBe(true);
      expect(ability.layer.resolveEffectsIndividually).toBe(true);
    });
  });

  describe("createFloatingTriggeredAbility", () => {
    it("should create floating triggered ability", () => {
      const parsedEffects: ParsedEffect[] = [
        {
          type: "draw",
          amount: 1,
          parameters: {},
        },
      ];

      const trigger = {
        on: "end_turn" as const,
        target: self,
      };

      const ability = createFloatingTriggeredAbility(parsedEffects, trigger, {
        text: "Whenever something happens, draw a card",
        duration: "turn",
      });

      expect(ability.type).toBe("floating-triggered");
      expect(ability.duration).toBe("turn");
      expect(ability.trigger).toEqual(trigger);
      expect(ability.layer.effects).toHaveLength(1);
      expect(ability.layer?.effects?.[0]?.type).toBe("draw");
    });
  });

  describe("isDelayedTriggeredClause", () => {
    it("should identify timing clause", () => {
      const clause: ParsedClause = {
        text: "At the end of your turn, banish this character",
        type: "timing",
        effects: [],
      };

      expect(isDelayedTriggeredClause(clause)).toBe(true);
    });

    it("should identify clause by text pattern", () => {
      const clause: ParsedClause = {
        text: "At the end of your turn, banish this character",
        type: "effect",
        effects: [],
      };

      expect(isDelayedTriggeredClause(clause)).toBe(true);
    });

    it("should identify beginning of turn pattern", () => {
      const clause: ParsedClause = {
        text: "At the beginning of your turn, draw a card",
        type: "effect",
        effects: [],
      };

      expect(isDelayedTriggeredClause(clause)).toBe(true);
    });

    it("should not identify non-timing clause", () => {
      const clause: ParsedClause = {
        text: "Draw a card",
        type: "effect",
        effects: [],
      };

      expect(isDelayedTriggeredClause(clause)).toBe(false);
    });
  });

  describe("isFloatingTriggeredClause", () => {
    it("should identify condition clause", () => {
      const clause: ParsedClause = {
        text: "Whenever this character quests, draw a card",
        type: "condition",
        effects: [],
      };

      expect(isFloatingTriggeredClause(clause)).toBe(true);
    });

    it("should identify clause by text pattern", () => {
      const clause: ParsedClause = {
        text: "Whenever this character quests, draw a card",
        type: "effect",
        effects: [],
      };

      expect(isFloatingTriggeredClause(clause)).toBe(true);
    });

    it("should identify when pattern", () => {
      const clause: ParsedClause = {
        text: "When you play this character, draw a card",
        type: "effect",
        effects: [],
      };

      expect(isFloatingTriggeredClause(clause)).toBe(true);
    });

    it("should not identify non-triggered clause", () => {
      const clause: ParsedClause = {
        text: "Draw a card",
        type: "effect",
        effects: [],
      };

      expect(isFloatingTriggeredClause(clause)).toBe(false);
    });
  });

  describe("parseTimingFromClause", () => {
    it("should parse end of turn timing", () => {
      const clause: ParsedClause = {
        text: "At the end of your turn, banish this character",
        type: "timing",
        effects: [],
      };

      const timing = parseTimingFromClause(clause);

      expect(timing.isEndOfTurn).toBe(true);
      expect(timing.isStartOfTurn).toBe(false);
      expect(timing.isNextTurn).toBe(false);
      expect(timing.duration).toBe("turn");
    });

    it("should parse start of turn timing", () => {
      const clause: ParsedClause = {
        text: "At the beginning of your turn, draw a card",
        type: "timing",
        effects: [],
      };

      const timing = parseTimingFromClause(clause);

      expect(timing.isEndOfTurn).toBe(false);
      expect(timing.isStartOfTurn).toBe(true);
      expect(timing.isNextTurn).toBe(false);
      expect(timing.duration).toBe("turn");
    });

    it("should parse next turn timing", () => {
      const clause: ParsedClause = {
        text: "Next turn, this character gets +2 strength",
        type: "timing",
        effects: [],
      };

      const timing = parseTimingFromClause(clause);

      expect(timing.isEndOfTurn).toBe(false);
      expect(timing.isStartOfTurn).toBe(false);
      expect(timing.isNextTurn).toBe(true);
      expect(timing.duration).toBe("next_turn");
    });

    it("should handle no timing markers", () => {
      const clause: ParsedClause = {
        text: "Draw a card",
        type: "effect",
        effects: [],
      };

      const timing = parseTimingFromClause(clause);

      expect(timing.isEndOfTurn).toBe(false);
      expect(timing.isStartOfTurn).toBe(false);
      expect(timing.isNextTurn).toBe(false);
      expect(timing.duration).toBeUndefined();
    });
  });

  describe("buildDelayedTriggeredAbilityFromClause", () => {
    it("should build delayed triggered ability from clause", () => {
      const clause: ParsedClause = {
        text: "At the end of your turn, banish chosen character",
        type: "timing",
        effects: [
          {
            type: "banish",
            target: chosenCharacter,
            parameters: {},
          },
        ],
      };

      const { ability, errors } =
        buildDelayedTriggeredAbilityFromClause(clause);

      expect(errors).toEqual([]);
      expect(ability).toBeDefined();
      expect(ability!.type).toBe("static-triggered");
      expect(ability!.layer.effects).toHaveLength(1);
      expect(ability?.layer?.effects?.[0]?.type).toBe("banish");
    });

    it("should handle clause with no effects", () => {
      const clause: ParsedClause = {
        text: "At the end of your turn",
        type: "timing",
        effects: [],
      };

      const { ability, errors } =
        buildDelayedTriggeredAbilityFromClause(clause);

      expect(ability).toBeUndefined();
      expect(errors).toContain("No effects found in delayed triggered clause");
    });

    it("should handle non-timing clause", () => {
      const clause: ParsedClause = {
        text: "Draw a card",
        type: "effect",
        effects: [],
      };

      const { ability, errors } =
        buildDelayedTriggeredAbilityFromClause(clause);

      expect(ability).toBeUndefined();
      expect(errors).toContain(
        'Clause is not a delayed triggered ability: "Draw a card"',
      );
    });
  });

  describe("buildFloatingTriggeredAbilityFromClause", () => {
    it("should build floating triggered ability from clause", () => {
      const clause: ParsedClause = {
        text: "Whenever this character quests, draw a card",
        type: "condition",
        effects: [
          {
            type: "draw",
            amount: 1,
            parameters: {},
          },
        ],
      };

      const { ability, errors } =
        buildFloatingTriggeredAbilityFromClause(clause);

      expect(errors).toEqual([]);
      expect(ability).toBeDefined();
      expect(ability!.type).toBe("floating-triggered");
      expect(ability!.layer.effects).toHaveLength(1);
      expect(ability?.layer?.effects?.[0]?.type).toBe("draw");
    });

    it("should handle clause with no effects", () => {
      const clause: ParsedClause = {
        text: "Whenever this character quests",
        type: "condition",
        effects: [],
      };

      const { ability, errors } =
        buildFloatingTriggeredAbilityFromClause(clause);

      expect(ability).toBeUndefined();
      expect(errors).toContain("No effects found in floating triggered clause");
    });
  });

  describe("buildAbilitiesWithTriggeredSupport", () => {
    it("should build mixed abilities with triggered support", () => {
      const clauses: ParsedClause[] = [
        {
          text: "Draw a card",
          type: "effect",
          effects: [
            {
              type: "draw",
              amount: 1,
              parameters: {},
            },
          ],
        },
        {
          text: "At the end of your turn, banish chosen character",
          type: "timing",
          effects: [
            {
              type: "banish",
              target: chosenCharacter,
              parameters: {},
            },
          ],
        },
        {
          text: "Whenever this character quests, draw a card",
          type: "condition",
          effects: [
            {
              type: "draw",
              amount: 1,
              parameters: {},
            },
          ],
        },
      ];

      const {
        abilities,
        triggeredAbilities,
        floatingTriggeredAbilities,
        errors,
      } = buildAbilitiesWithTriggeredSupport(clauses);

      expect(errors).toEqual([]);
      expect(abilities).toHaveLength(1);
      expect(triggeredAbilities).toHaveLength(1);
      expect(floatingTriggeredAbilities).toHaveLength(1);

      expect(abilities[0]?.effects?.[0]?.type).toBe("draw");
      expect(triggeredAbilities[0]?.layer?.effects?.[0]?.type).toBe("banish");
      expect(floatingTriggeredAbilities[0]?.layer?.effects?.[0]?.type).toBe(
        "draw",
      );
    });

    it("should handle clauses with errors", () => {
      const clauses: ParsedClause[] = [
        {
          text: "At the end of your turn",
          type: "timing",
          effects: [], // No effects
        },
        {
          text: "Draw a card",
          type: "effect",
          effects: [
            {
              type: "draw",
              amount: 1,
              parameters: {},
            },
          ],
        },
      ];

      const {
        abilities,
        triggeredAbilities,
        floatingTriggeredAbilities,
        errors,
      } = buildAbilitiesWithTriggeredSupport(clauses);

      expect(abilities).toHaveLength(1); // Only the valid clause
      expect(triggeredAbilities).toHaveLength(0);
      expect(floatingTriggeredAbilities).toHaveLength(0);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
