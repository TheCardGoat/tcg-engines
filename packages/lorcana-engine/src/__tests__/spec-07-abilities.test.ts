/**
 * Spec 7: Abilities System Test Suite
 *
 * Tests for triggered, activated, static abilities,
 * replacement effects, and ability modifiers.
 */

import { describe, expect, it } from "bun:test";
import {
  ActionTypes,
  type ActivatedAbilityDefinition,
  applyReplacementToEvent,
  CommonReplacements,
  calculateCostModifier,
  calculateStrengthModifier,
  calculateWillpowerModifier,
  canPayDiscardCost,
  // Activated
  canPayExertCost,
  canPayInkCost,
  // Replacement
  canReplaceEvent,
  createCantModifier,
  createContinuousEffect,
  // Modifiers
  createGainModifier,
  createLoseModifier,
  createMustModifier,
  createReplacementEffect,
  createTriggeredInstance,
  findActivatedAbility,
  findApplicableReplacement,
  type GameEvent,
  getActivatedAbilities,
  getEffectiveKeywords,
  getGainModifiers,
  getGrantedKeywords,
  getLoseModifiers,
  getTriggeredAbilities,
  hasCantModifier,
  hasMustModifier,
  isAbilityFree,
  isActionAllowed,
  isActionPrevented,
  isActionRequired,
  isDurationExpired,
  isFloatingTrigger,
  isOptionalTrigger,
  isSkipEffect,
  // Static
  isStaticAbilityActive,
  isWheneverTrigger,
  matchesCardFilter,
  // Triggered
  matchesTrigger,
  type ReplacementEffect,
  requiresExert,
  type StaticAbilityDefinition,
  // Types
  type TriggeredAbilityDefinition,
  validateActivatedAbility,
} from "../abilities";
import type {
  AbilityDefinition,
  LorcanaCardDefinition,
} from "../types/card-types";
import type { CardId, PlayerId } from "../types/game-state";
import type { Keyword } from "../types/keywords";
import {
  clearDrying,
  createCardInstanceState,
  exertCard,
} from "../zones/card-state";

const player1 = "player1" as PlayerId;
const player2 = "player2" as PlayerId;
const cardId = (id: string): CardId => id as CardId;

// Helper to create mock cards
function createMockCard(
  overrides: Partial<LorcanaCardDefinition> & { keywords?: Keyword[] } = {},
): LorcanaCardDefinition {
  const { keywords, ...rest } = overrides;
  let abilities: AbilityDefinition[] = rest.abilities || [];

  if (keywords) {
    const keywordAbilities: AbilityDefinition[] = keywords.map((k, i) => {
      // 1. Simple Keyword (string)
      if (typeof k === "string") {
        return {
          type: "keyword",
          keyword: k,
          id: `kw-${i}`,
          text: k,
        } as AbilityDefinition;
      }

      // 2. Complex/Parameterized Keyword (object)
      const { type: keywordType, ...kRest } = k;

      // Handle Shift specifically
      if (keywordType === "Shift") {
        const shiftCost = (kRest as any).cost;
        const target = (kRest as any).targetName;

        const shiftAbility = {
          type: "keyword",
          keyword: "Shift",
          cost: typeof shiftCost === "number" ? { ink: shiftCost } : shiftCost,
          shiftTarget: target,
          id: `kw-${i}`,
          text: `Shift ${shiftCost} (${target || ""})`,
        };
        return shiftAbility as unknown as AbilityDefinition;
      }

      // Default for others
      return {
        type: "keyword",
        keyword: keywordType,
        ...kRest,
        id: `kw-${i}`,
        text: `${keywordType} ${(kRest as any).value || ""}`,
      } as unknown as AbilityDefinition;
    });
    abilities = [...abilities, ...keywordAbilities];
  }

  return {
    id: `card-${Math.random().toString(36).slice(2)}`,
    name: "Test Card",
    version: "Test Version",
    fullName: "Test Card - Test Version",
    inkType: ["amber"],
    cost: 3,
    inkable: true,
    cardType: "character",
    strength: 2,
    willpower: 3,
    lore: 1,
    set: "TFC",
    abilities,
    ...rest,
  };
}

// Helper to create ready, dry state
function createReadyDryState(id: string) {
  return clearDrying(createCardInstanceState(cardId(id)));
}

// Sample abilities for testing
const sampleTriggeredAbility: TriggeredAbilityDefinition = {
  type: "triggered",
  id: "whenPlayed1",
  name: "On Play",
  text: "When you play this character, draw a card.",
  trigger: { type: "whenPlayed" },
  effect: { type: "drawCards", params: { count: 1 } },
  isOptional: false,
};

const sampleFloatingTriggered: TriggeredAbilityDefinition = {
  type: "triggered",
  id: "whenBanished1",
  name: "Last Words",
  text: "When this character is banished, deal 2 damage.",
  trigger: { type: "whenBanished" },
  effect: { type: "dealDamage", params: { amount: 2 } },
  isFloating: true,
};

const sampleOptionalTriggered: TriggeredAbilityDefinition = {
  type: "triggered",
  id: "mayDraw1",
  name: "Optional Draw",
  text: "When this character quests, you may draw a card.",
  trigger: { type: "whenQuests" },
  effect: { type: "drawCards", params: { count: 1 } },
  isOptional: true,
};

const sampleActivatedAbility: ActivatedAbilityDefinition = {
  type: "activated",
  id: "exertDraw",
  name: "Tap Draw",
  text: "⬇, 2 ink: Draw a card.",
  cost: { exert: true, ink: 2 },
  effect: { type: "drawCards", params: { count: 1 } },
};

const sampleStaticAbility: StaticAbilityDefinition = {
  type: "static",
  id: "buffAllies",
  name: "Battle Cry",
  text: "Your other characters get +1 Strength.",
  effect: {
    type: "modifyStrength",
    params: { amount: 1 },
    affectedCards: { controller: "you" },
  },
};

describe("Spec 7: Abilities System", () => {
  describe("Triggered Abilities (Rule 7.4)", () => {
    it("triggers when condition is met", () => {
      const event: GameEvent = {
        type: "cardPlayed",
        sourceCardId: cardId("card1"),
        playerId: player1,
      };

      const matches = matchesTrigger(
        { type: "whenPlayed" },
        event,
        cardId("card1"),
        player1,
      );

      expect(matches).toBe(true);
    });

    it("does not trigger when condition is not met", () => {
      const event: GameEvent = {
        type: "cardPlayed",
        sourceCardId: cardId("card2"), // Different card
        playerId: player1,
      };

      const matches = matchesTrigger(
        { type: "whenPlayed" },
        event,
        cardId("card1"),
        player1,
      );

      expect(matches).toBe(false);
    });

    it("creates triggered ability instance", () => {
      const instance = createTriggeredInstance(
        sampleTriggeredAbility,
        cardId("card1"),
        player1,
      );

      expect(instance.sourceCardId).toBe(cardId("card1"));
      expect(instance.controllerId).toBe(player1);
      expect(instance.isOptional).toBe(false);
      expect(instance.instanceId).toBeDefined();
    });

    it("floating triggers work after card leaves play", () => {
      expect(isFloatingTrigger(sampleFloatingTriggered)).toBe(true);
      expect(isFloatingTrigger(sampleTriggeredAbility)).toBe(false);
    });

    it("'when' vs 'whenever' trigger semantics", () => {
      expect(isWheneverTrigger({ type: "wheneverYouPlay" })).toBe(true);
      expect(isWheneverTrigger({ type: "wheneverOpponentPlays" })).toBe(true);
      expect(isWheneverTrigger({ type: "whenPlayed" })).toBe(false);
    });

    it("optional trigger is detected", () => {
      expect(isOptionalTrigger(sampleOptionalTriggered)).toBe(true);
      expect(isOptionalTrigger(sampleTriggeredAbility)).toBe(false);
    });

    it("gets triggered abilities from card", () => {
      const card = createMockCard({
        abilities: [
          sampleTriggeredAbility as any,
          sampleActivatedAbility as any,
        ],
      });

      const triggered = getTriggeredAbilities(card);
      expect(triggered).toHaveLength(1);
      expect(triggered[0].id).toBe("whenPlayed1");
    });

    it("atStartOfTurn triggers for correct player", () => {
      const event: GameEvent = {
        type: "turnStart",
        playerId: player1,
      };

      expect(
        matchesTrigger({ type: "atStartOfTurn" }, event, cardId("c1"), player1),
      ).toBe(true);
      expect(
        matchesTrigger({ type: "atStartOfTurn" }, event, cardId("c1"), player2),
      ).toBe(false);
    });

    it("whenChallenges triggers when card challenges", () => {
      const event: GameEvent = {
        type: "challenge",
        sourceCardId: cardId("attacker"),
        targetCardId: cardId("defender"),
      };

      expect(
        matchesTrigger(
          { type: "whenChallenges" },
          event,
          cardId("attacker"),
          player1,
        ),
      ).toBe(true);
      expect(
        matchesTrigger(
          { type: "whenChallenged" },
          event,
          cardId("defender"),
          player1,
        ),
      ).toBe(true);
    });
  });

  describe("Activated Abilities (Rule 7.5)", () => {
    it("requires paying full cost", () => {
      const card = createMockCard();
      const state = createReadyDryState("card1");

      const result = validateActivatedAbility(
        card,
        state,
        player1,
        player1,
        true,
        sampleActivatedAbility,
        5, // 5 ink available
        3, // 3 cards in hand
      );

      expect(result.valid).toBe(true);
    });

    it("rejects if ink cost cannot be paid", () => {
      const card = createMockCard();
      const state = createReadyDryState("card1");

      const result = validateActivatedAbility(
        card,
        state,
        player1,
        player1,
        true,
        sampleActivatedAbility,
        1, // Only 1 ink available
        3,
      );

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "INSUFFICIENT_INK")).toBe(
        true,
      );
    });

    it("exert abilities require ready and dry card", () => {
      const card = createMockCard();
      const exertedState = exertCard(createReadyDryState("card1"));

      const result = validateActivatedAbility(
        card,
        exertedState,
        player1,
        player1,
        true,
        sampleActivatedAbility,
        5,
        3,
      );

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.type === "CARD_NOT_READY")).toBe(true);
    });

    it("items can use abilities turn they're played", () => {
      const item = createMockCard({ cardType: "item" });
      const dryingState = createCardInstanceState(cardId("item1")); // Still drying

      expect(canPayExertCost(item, dryingState)).toBe(true);
    });

    it("characters must be dry for exert abilities", () => {
      const character = createMockCard({ cardType: "character" });
      const dryingState = createCardInstanceState(cardId("char1"));

      expect(canPayExertCost(character, dryingState)).toBe(false);
    });

    it("characters with Rush can use abilities turn played", () => {
      const rushCharacter = createMockCard({
        cardType: "character",
        keywords: ["Rush"],
      });
      const dryingState = createCardInstanceState(cardId("char1"));

      expect(canPayExertCost(rushCharacter, dryingState)).toBe(true);
    });

    it("canPayInkCost validates correctly", () => {
      expect(canPayInkCost(3, 5)).toBe(true);
      expect(canPayInkCost(5, 3)).toBe(false);
      expect(canPayInkCost(0, 0)).toBe(true);
    });

    it("canPayDiscardCost validates correctly", () => {
      expect(canPayDiscardCost(2, 5)).toBe(true);
      expect(canPayDiscardCost(5, 2)).toBe(false);
    });

    it("gets activated abilities from card", () => {
      const card = createMockCard({
        abilities: [
          sampleTriggeredAbility as any,
          sampleActivatedAbility as any,
        ],
      });

      const activated = getActivatedAbilities(card);
      expect(activated).toHaveLength(1);
      expect(activated[0].id).toBe("exertDraw");
    });

    it("finds activated ability by ID", () => {
      const card = createMockCard({
        abilities: [sampleActivatedAbility as any],
      });

      const ability = findActivatedAbility(card, "exertDraw");
      expect(ability).toBeDefined();
      if (ability) {
        expect(ability.id).toBe("exertDraw");
      }
    });

    it("isAbilityFree checks ink cost", () => {
      expect(isAbilityFree({ exert: true, ink: 0 })).toBe(true);
      expect(isAbilityFree({ exert: true, ink: 2 })).toBe(false);
      expect(isAbilityFree({ exert: true })).toBe(true);
    });

    it("requiresExert checks exert cost", () => {
      expect(requiresExert({ exert: true })).toBe(true);
      expect(requiresExert({ ink: 2 })).toBe(false);
    });
  });

  describe("Static Abilities (Rule 7.6)", () => {
    it("applies effect while card is in play", () => {
      expect(isStaticAbilityActive(sampleStaticAbility, true)).toBe(true);
    });

    it("removes effect when card leaves play", () => {
      const ability: StaticAbilityDefinition = {
        ...sampleStaticAbility,
        worksOutsidePlay: false,
      };
      expect(isStaticAbilityActive(ability, false)).toBe(false);
    });

    it("some abilities work outside of play", () => {
      const ability: StaticAbilityDefinition = {
        ...sampleStaticAbility,
        worksOutsidePlay: true,
      };
      expect(isStaticAbilityActive(ability, false)).toBe(true);
    });

    it("tracks 'this turn' duration expiration", () => {
      expect(
        isDurationExpired(
          { type: "untilEndOfTurn" },
          2, // Current turn
          1, // Effect created turn
          player1,
          player1,
        ),
      ).toBe(true);

      expect(
        isDurationExpired(
          { type: "untilEndOfTurn" },
          1, // Same turn
          1, // Effect created turn
          player1,
          player1,
        ),
      ).toBe(false);
    });

    it("whileInPlay duration never expires from time", () => {
      expect(
        isDurationExpired({ type: "whileInPlay" }, 100, 1, player1, player1),
      ).toBe(false);
    });

    it("permanent duration never expires", () => {
      expect(
        isDurationExpired({ type: "permanent" }, 100, 1, player1, player1),
      ).toBe(false);
    });

    it("creates continuous effect", () => {
      const effect = createContinuousEffect(
        sampleStaticAbility,
        cardId("source"),
        [cardId("target1"), cardId("target2")],
      );

      expect(effect.sourceCardId).toBe(cardId("source"));
      expect(effect.affectedCardIds).toHaveLength(2);
    });

    it("calculates strength modifier", () => {
      const effects = [
        { type: "modifyStrength" as const, params: { amount: 2 } },
        { type: "modifyStrength" as const, params: { amount: 1 } },
      ];
      expect(calculateStrengthModifier(effects)).toBe(3);
    });

    it("calculates willpower modifier", () => {
      const effects = [
        { type: "modifyWillpower" as const, params: { amount: 3 } },
      ];
      expect(calculateWillpowerModifier(effects)).toBe(3);
    });

    it("calculates cost modifier", () => {
      const effects = [{ type: "modifyCost" as const, params: { amount: -1 } }];
      expect(calculateCostModifier(effects)).toBe(-1);
    });

    it("gets granted keywords", () => {
      const effects = [
        { type: "grantKeyword" as const, params: { keyword: "Rush" } },
        { type: "grantKeyword" as const, params: { keyword: "Ward" } },
      ];
      const keywords = getGrantedKeywords(effects);
      expect(keywords).toContain("Rush");
      expect(keywords).toContain("Ward");
    });

    it("checks prevented actions", () => {
      const effects = [
        { type: "preventAction" as const, params: { action: "quest" } },
      ];
      expect(isActionPrevented(effects, "quest")).toBe(true);
      expect(isActionPrevented(effects, "challenge")).toBe(false);
    });

    it("checks required actions", () => {
      const effects = [
        { type: "requireAction" as const, params: { action: "challenge" } },
      ];
      expect(isActionRequired(effects, "challenge")).toBe(true);
      expect(isActionRequired(effects, "quest")).toBe(false);
    });

    it("matches card filter correctly", () => {
      const character = createMockCard({ cardType: "character" });
      const item = createMockCard({ cardType: "item" });

      expect(
        matchesCardFilter(
          character,
          player1,
          { cardType: "character" },
          player1,
        ),
      ).toBe(true);
      expect(
        matchesCardFilter(item, player1, { cardType: "character" }, player1),
      ).toBe(false);
      expect(
        matchesCardFilter(character, player1, { controller: "you" }, player1),
      ).toBe(true);
      expect(
        matchesCardFilter(character, player2, { controller: "you" }, player1),
      ).toBe(false);
    });
  });

  describe("Replacement Effects (Rule 7.7)", () => {
    const damageReplacement: ReplacementEffect = {
      type: "replacement",
      id: "preventDamage1",
      text: "Prevent all damage.",
      replaceEvent: "damage",
      withEffect: "nothing",
    };

    it("replaces original event with replacement", () => {
      const event: GameEvent = { type: "damage", params: { amount: 3 } };

      expect(canReplaceEvent(damageReplacement, event)).toBe(true);
    });

    it("skip effects prevent event entirely", () => {
      expect(isSkipEffect(damageReplacement)).toBe(true);

      const replaceWithEffect: ReplacementEffect = {
        ...damageReplacement,
        withEffect: { type: "drawCards", params: { count: 1 } },
      };
      expect(isSkipEffect(replaceWithEffect)).toBe(false);
    });

    it("finds applicable replacement", () => {
      const replacements = [damageReplacement];
      const event: GameEvent = { type: "damage" };

      const found = findApplicableReplacement(replacements, event);
      expect(found).toBe(damageReplacement);
    });

    it("returns null when no replacement applies", () => {
      const replacements = [damageReplacement];
      const event: GameEvent = { type: "draw" };

      const found = findApplicableReplacement(replacements, event);
      expect(found).toBeNull();
    });

    it("applies replacement to event", () => {
      const event: GameEvent = { type: "damage", params: { amount: 3 } };

      // Skip effect returns null
      const result = applyReplacementToEvent(damageReplacement, event);
      expect(result).toBeNull();

      // Replacement effect returns modified event
      const replaceWithEffect: ReplacementEffect = {
        ...damageReplacement,
        withEffect: { type: "drawCards", params: { count: 1 } },
      };
      const modified = applyReplacementToEvent(replaceWithEffect, event);
      expect(modified).not.toBeNull();
      if (modified) {
        expect(modified.type).toBe("replaced_damage");
      }
    });

    it("creates replacement effect", () => {
      const effect = createReplacementEffect(
        "test1",
        "Test replacement",
        "banish",
        { type: "returnToHand", params: {} },
      );

      expect(effect.type).toBe("replacement");
      expect(effect.replaceEvent).toBe("banish");
    });

    it("CommonReplacements.skipDraw creates skip effect", () => {
      const skip = CommonReplacements.skipDraw("skip1", "Skip draw");
      expect(skip.replaceEvent).toBe("draw");
      expect(isSkipEffect(skip)).toBe(true);
    });
  });

  describe("Ability Modifiers (Rule 7.8)", () => {
    it("'gain' adds ability to card", () => {
      const modifier = createGainModifier(
        cardId("source"),
        cardId("target"),
        "Rush",
        { type: "untilEndOfTurn" },
      );

      expect(modifier.type).toBe("gain");
      expect(modifier.targetCardId).toBe(cardId("target"));
    });

    it("'lose' removes ability from card", () => {
      const modifier = createLoseModifier(
        cardId("source"),
        cardId("target"),
        "Bodyguard",
        { type: "untilEndOfTurn" },
      );

      expect(modifier.type).toBe("lose");
    });

    it("'can't' prevents action", () => {
      const modifier = createCantModifier(
        cardId("source"),
        cardId("target"),
        ActionTypes.QUEST,
        { type: "untilEndOfTurn" },
      );

      expect(modifier.type).toBe("cant");
      expect(modifier.action).toBe("quest");
    });

    it("'must' forces action", () => {
      const modifier = createMustModifier(
        cardId("source"),
        cardId("target"),
        ActionTypes.CHALLENGE,
        { type: "untilEndOfTurn" },
      );

      expect(modifier.type).toBe("must");
      expect(modifier.action).toBe("challenge");
    });

    it("hasCantModifier detects can't modifiers", () => {
      const modifiers = [
        createCantModifier(cardId("s"), cardId("t1"), ActionTypes.QUEST, {
          type: "permanent",
        }),
      ];

      expect(hasCantModifier(modifiers, cardId("t1"), "quest")).toBe(true);
      expect(hasCantModifier(modifiers, cardId("t1"), "challenge")).toBe(false);
      expect(hasCantModifier(modifiers, cardId("t2"), "quest")).toBe(false);
    });

    it("hasMustModifier detects must modifiers", () => {
      const modifiers = [
        createMustModifier(cardId("s"), cardId("t1"), ActionTypes.CHALLENGE, {
          type: "permanent",
        }),
      ];

      expect(hasMustModifier(modifiers, cardId("t1"), "challenge")).toBe(true);
      expect(hasMustModifier(modifiers, cardId("t1"), "quest")).toBe(false);
    });

    it("prohibition beats permission", () => {
      const modifiers = [
        createCantModifier(cardId("s"), cardId("t1"), ActionTypes.QUEST, {
          type: "permanent",
        }),
      ];

      // Even if base action is allowed, can't prevents it
      expect(isActionAllowed(modifiers, cardId("t1"), "quest", true)).toBe(
        false,
      );
      expect(isActionAllowed(modifiers, cardId("t1"), "challenge", true)).toBe(
        true,
      );
    });

    it("getEffectiveKeywords adds gained and removes lost", () => {
      const baseKeywords = ["Bodyguard" as const, "Evasive" as const];

      const gainModifiers = [
        createGainModifier(cardId("s"), cardId("t"), "Rush", {
          type: "permanent",
        }),
      ];

      const loseModifiers = [
        createLoseModifier(cardId("s"), cardId("t"), "Bodyguard", {
          type: "permanent",
        }),
      ];

      const effective = getEffectiveKeywords(
        baseKeywords,
        gainModifiers,
        loseModifiers,
      );

      expect(effective).toContain("Evasive");
      expect(effective).toContain("Rush");
      expect(effective).not.toContain("Bodyguard");
    });

    it("getGainModifiers filters correctly", () => {
      const modifiers = [
        createGainModifier(cardId("s"), cardId("t1"), "Rush", {
          type: "permanent",
        }),
        createLoseModifier(cardId("s"), cardId("t1"), "Ward", {
          type: "permanent",
        }),
        createGainModifier(cardId("s"), cardId("t2"), "Rush", {
          type: "permanent",
        }),
      ];

      const gains = getGainModifiers(modifiers, cardId("t1"));
      expect(gains).toHaveLength(1);
    });

    it("getLoseModifiers filters correctly", () => {
      const modifiers = [
        createGainModifier(cardId("s"), cardId("t1"), "Rush", {
          type: "permanent",
        }),
        createLoseModifier(cardId("s"), cardId("t1"), "Ward", {
          type: "permanent",
        }),
      ];

      const loses = getLoseModifiers(modifiers, cardId("t1"));
      expect(loses).toHaveLength(1);
    });
  });

  describe("General Rules (Rule 7.1)", () => {
    it("'may' effects are optional", () => {
      const optionalAbility: TriggeredAbilityDefinition = {
        type: "triggered",
        id: "mayDraw",
        text: "You may draw a card.",
        trigger: { type: "whenPlayed" },
        effect: { type: "drawCards", params: { count: 1 }, isOptional: true },
      };

      // Both ability-level and effect-level optional should be detected
      expect(isOptionalTrigger(optionalAbility)).toBe(true);
    });
  });
});
