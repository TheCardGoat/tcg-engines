import { v4 as uuid } from "uuid";
import type { LorcanaZone } from "../../lorcana-engine-types";
import type {
  Ability,
  AbilityCondition,
  AbilityCost,
  AbilityTarget,
  AbilityType,
  Effect,
  EffectType,
  Keyword,
  TriggerTiming,
} from "../ability-types";

/**
 * Parser-Based Factory for natural language processing of card text
 * Uses pattern matching and NLP techniques to convert card text to structured abilities
 */
export class ParserBasedFactory {
  // Regex patterns for common card text structures
  private static readonly PATTERNS = {
    // Keywords
    SIMPLE_KEYWORD: /^(Bodyguard|Evasive|Rush|Ward|Vanish|Support)$/i,
    KEYWORD_WITH_VALUE: /^(Challenger|Resist|Singer|Shift)\s*\+?(\d+)$/i,

    // Triggered abilities
    ON_PLAY: /^When you play this character,\s*(.+)$/i,
    ON_QUEST: /^Whenever this character quests,\s*(.+)$/i,
    ON_BANISH: /^When this character is banished,\s*(.+)$/i,
    ON_CHALLENGE: /^When(?:ever)? this character challenges,\s*(.+)$/i,
    ON_DAMAGE: /^When(?:ever)? this character (?:is )?damaged?,\s*(.+)$/i,
    DURING_TURN: /^During your turn,\s*(.+)$/i,
    AT_START: /^At the start of your turn,\s*(.+)$/i,
    AT_END: /^At the end of your turn,\s*(.+)$/i,

    // Static abilities
    WHILE_CONDITION: /^While (.+?),\s*(.+)$/i,

    // Activated abilities
    EXERT_ABILITY: /^\{E\}(?:,\s*(\d+)\s*\{I\})?\s*[-–—]\s*(.+)$/i,
    INK_ABILITY: /^(\d+)\s*\{I\}(?:,\s*(.+?))?\s*[-–—]\s*(.+)$/i,

    // Common effects
    GAIN_LORE: /gain (\d+) lore/i,
    DRAW_CARDS: /draw (?:(\d+) )?cards?/i,
    DEAL_DAMAGE: /deal (\d+) damage/i,
    REMOVE_DAMAGE: /remove up to (\d+) damage/i,
    BOOST_STAT: /(?:gets?|gains?) ([+-]\d+) \{([SWL])\}/i,
    GRANT_KEYWORD:
      /gains? (Bodyguard|Evasive|Rush|Ward|Vanish|Challenger \+?\d+|Resist \+?\d+)/i,
    BANISH_TARGET: /banish chosen (.+)/i,
    RETURN_TO_HAND: /return chosen (.+) to (?:their|your) (?:player's )?hand/i,
    EXERT_TARGET: /exert chosen (.+)/i,
    READY_TARGET: /ready chosen (.+)/i,

    // Target patterns
    CHOSEN_CHARACTER:
      /chosen (?:(opposing|enemy) )?(?:(damaged|ready|exerted) )?(?:(\w+) )?character/i,
    CHOSEN_ITEM: /chosen (?:(opposing|enemy) )?item/i,
    CHOSEN_LOCATION: /chosen (?:(opposing|enemy) )?location/i,
    YOUR_CHARACTERS: /your (?:other )?(?:(\w+) )?characters/i,
    OPPOSING_CHARACTERS: /(?:opposing|enemy) (?:(\w+) )?characters/i,

    // Conditions
    IF_CONDITION: /if (.+?)(?:,|$)/i,
    HAS_IN_PLAY: /you have (?:a |an )?(.+?) in play/i,
    HAS_DAMAGE: /this character has (?:no )?damage/i,
    MORE_THAN: /(\d+) or more/i,
    LESS_THAN: /(\d+) or less/i,

    // Duration
    THIS_TURN: /this turn/i,
    UNTIL_NEXT_TURN: /until (?:the start of )?your next turn/i,
    PERMANENTLY: /permanently|for as long as/i,
  };

  /**
   * Parse card text into structured abilities
   */
  static parseCardText(cardText: string): Ability[] {
    const abilities: Ability[] = [];
    const text = cardText.trim();

    // Split by ability separators (newlines, periods followed by caps, etc.)
    const abilityTexts = ParserBasedFactory.splitIntoAbilities(text);

    for (const abilityText of abilityTexts) {
      const ability = ParserBasedFactory.parseAbilityText(abilityText);
      if (ability) {
        abilities.push(ability);
      }
    }

    return abilities;
  }

  /**
   * Split card text into individual ability strings
   */
  private static splitIntoAbilities(text: string): string[] {
    // Handle named abilities like "ABILITY NAME Effect text"
    const namedAbilityPattern = /\b[A-Z][A-Z\s]+?\b(?=\s+[A-Z]|\s*$)/g;
    const abilities: string[] = [];

    // Split on common separators
    const parts = text.split(/\n+|(?<=\.)\s*(?=[A-Z])/);

    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed && trimmed.length > 0) {
        abilities.push(trimmed);
      }
    }

    return abilities.length > 0 ? abilities : [text];
  }

  /**
   * Parse a single ability text into an Ability object
   */
  private static parseAbilityText(text: string): Ability | null {
    const cleanText = text.trim();

    // Try to match different ability types
    let ability: Ability | null = null;

    // Check for keywords first
    ability = ParserBasedFactory.parseKeyword(cleanText);
    if (ability) return ability;

    // Check for triggered abilities
    ability = ParserBasedFactory.parseTriggeredAbility(cleanText);
    if (ability) return ability;

    // Check for activated abilities
    ability = ParserBasedFactory.parseActivatedAbility(cleanText);
    if (ability) return ability;

    // Check for static abilities
    ability = ParserBasedFactory.parseStaticAbility(cleanText);
    if (ability) return ability;

    // If no specific pattern matches, create a generic ability
    return ParserBasedFactory.createGenericAbility(cleanText);
  }

  /**
   * Parse keyword abilities
   */
  private static parseKeyword(text: string): Ability | null {
    // Simple keywords
    const simpleMatch = text.match(ParserBasedFactory.PATTERNS.SIMPLE_KEYWORD);
    if (simpleMatch) {
      const keyword = simpleMatch[1] as Keyword;
      return {
        type: "keyword",
        text,
        keyword: { type: keyword },
        effects: [],
      };
    }

    // Keywords with values
    const valueMatch = text.match(
      ParserBasedFactory.PATTERNS.KEYWORD_WITH_VALUE,
    );
    if (valueMatch) {
      const [, keyword, value] = valueMatch;
      return {
        type: "keyword",
        text,
        keyword: {
          type: keyword as Keyword,
          value: Number.parseInt(value, 10),
        },
        effects: [],
      };
    }

    return null;
  }

  /**
   * Parse triggered abilities
   */
  private static parseTriggeredAbility(text: string): Ability | null {
    const patterns: Array<{
      pattern: RegExp;
      timing: TriggerTiming;
      conditionType: string;
    }> = [
      {
        pattern: ParserBasedFactory.PATTERNS.ON_PLAY,
        timing: "onPlay",
        conditionType: "onEnterPlay",
      },
      {
        pattern: ParserBasedFactory.PATTERNS.ON_QUEST,
        timing: "onQuest",
        conditionType: "onQuest",
      },
      {
        pattern: ParserBasedFactory.PATTERNS.ON_BANISH,
        timing: "onBanish",
        conditionType: "onBanish",
      },
      {
        pattern: ParserBasedFactory.PATTERNS.ON_CHALLENGE,
        timing: "onChallenge",
        conditionType: "onChallenge",
      },
      {
        pattern: ParserBasedFactory.PATTERNS.ON_DAMAGE,
        timing: "onDamage",
        conditionType: "onDamage",
      },
      {
        pattern: ParserBasedFactory.PATTERNS.AT_START,
        timing: "startOfTurn",
        conditionType: "activePlayerOnly",
      },
      {
        pattern: ParserBasedFactory.PATTERNS.AT_END,
        timing: "endOfTurn",
        conditionType: "activePlayerOnly",
      },
    ];

    for (const { pattern, timing, conditionType } of patterns) {
      const match = text.match(pattern);
      if (match) {
        const effectText = match[1];
        const effects = ParserBasedFactory.parseEffects(effectText);

        return {
          type: "triggered",
          text,
          timing,
          condition: { type: conditionType as any },
          effects,
          optional: effectText.includes("may"),
        };
      }
    }

    return null;
  }

  /**
   * Parse activated abilities
   */
  private static parseActivatedAbility(text: string): Ability | null {
    // Exert abilities
    const exertMatch = text.match(ParserBasedFactory.PATTERNS.EXERT_ABILITY);
    if (exertMatch) {
      const [, inkCost, effectText] = exertMatch;
      const cost: AbilityCost = { exert: true };
      if (inkCost) {
        cost.ink = Number.parseInt(inkCost, 10);
      }

      const effects = ParserBasedFactory.parseEffects(effectText);

      return {
        type: "activated",
        text,
        cost,
        effects,
      };
    }

    // Ink-only abilities
    const inkMatch = text.match(ParserBasedFactory.PATTERNS.INK_ABILITY);
    if (inkMatch) {
      const [, inkCost, , effectText] = inkMatch;
      const cost: AbilityCost = { ink: Number.parseInt(inkCost, 10) };
      const effects = ParserBasedFactory.parseEffects(effectText);

      return {
        type: "activated",
        text,
        cost,
        effects,
      };
    }

    return null;
  }

  /**
   * Parse static abilities
   */
  private static parseStaticAbility(text: string): Ability | null {
    const whileMatch = text.match(ParserBasedFactory.PATTERNS.WHILE_CONDITION);
    if (whileMatch) {
      const [, conditionText, effectText] = whileMatch;
      const condition = ParserBasedFactory.parseCondition(conditionText);
      const effects = ParserBasedFactory.parseEffects(effectText);

      return {
        type: "static",
        text,
        condition,
        effects,
      };
    }

    return null;
  }

  /**
   * Parse effects from effect text
   */
  private static parseEffects(effectText: string): Effect[] {
    const effects: Effect[] = [];

    // Gain lore
    const loreMatch = effectText.match(ParserBasedFactory.PATTERNS.GAIN_LORE);
    if (loreMatch) {
      effects.push({
        type: "gainLore",
        parameters: { amount: Number.parseInt(loreMatch[1], 10) },
      });
    }

    // Draw cards
    const drawMatch = effectText.match(ParserBasedFactory.PATTERNS.DRAW_CARDS);
    if (drawMatch) {
      const amount = drawMatch[1] ? Number.parseInt(drawMatch[1], 10) : 1;
      effects.push({
        type: "draw",
        parameters: { amount },
      });
    }

    // Deal damage
    const damageMatch = effectText.match(
      ParserBasedFactory.PATTERNS.DEAL_DAMAGE,
    );
    if (damageMatch) {
      const target = ParserBasedFactory.parseTarget(effectText);
      effects.push({
        type: "dealDamage",
        parameters: {
          amount: Number.parseInt(damageMatch[1], 10),
          target,
        },
      });
    }

    // Remove damage
    const removeDamageMatch = effectText.match(
      ParserBasedFactory.PATTERNS.REMOVE_DAMAGE,
    );
    if (removeDamageMatch) {
      const target = ParserBasedFactory.parseTarget(effectText);
      effects.push({
        type: "removeDamage",
        parameters: {
          amount: Number.parseInt(removeDamageMatch[1], 10),
          target,
        },
      });
    }

    // Stat modifications
    const statMatch = effectText.match(ParserBasedFactory.PATTERNS.BOOST_STAT);
    if (statMatch) {
      const [, valueStr, statLetter] = statMatch;
      const value = Number.parseInt(valueStr, 10);
      const statMap = { S: "strength", W: "willpower", L: "lore" } as const;
      const stat = statMap[statLetter as keyof typeof statMap];
      const target = ParserBasedFactory.parseTarget(effectText);
      const duration = ParserBasedFactory.parseDuration(effectText);

      effects.push({
        type: "modifyStat",
        parameters: { stat, value, target },
        duration,
      });
    }

    // Grant keyword
    const keywordMatch = effectText.match(
      ParserBasedFactory.PATTERNS.GRANT_KEYWORD,
    );
    if (keywordMatch) {
      const keywordText = keywordMatch[1];
      const target = ParserBasedFactory.parseTarget(effectText);
      const duration = ParserBasedFactory.parseDuration(effectText);

      // Parse keyword and value
      const keywordValueMatch = keywordText.match(/(\w+)(?:\s*\+(\d+))?/);
      if (keywordValueMatch) {
        const [, keyword, value] = keywordValueMatch;
        effects.push({
          type: "addKeyword",
          parameters: {
            keyword: keyword as Keyword,
            keywordValue: value ? Number.parseInt(value, 10) : undefined,
            target,
          },
          duration,
        });
      }
    }

    // Banish effects
    const banishMatch = effectText.match(
      ParserBasedFactory.PATTERNS.BANISH_TARGET,
    );
    if (banishMatch) {
      const target = ParserBasedFactory.parseTarget(effectText);
      effects.push({
        type: "banish",
        parameters: { target },
      });
    }

    // Return to hand
    const returnMatch = effectText.match(
      ParserBasedFactory.PATTERNS.RETURN_TO_HAND,
    );
    if (returnMatch) {
      const target = ParserBasedFactory.parseTarget(effectText);
      effects.push({
        type: "moveToZone",
        parameters: { zoneTo: "hand", target },
      });
    }

    // Exert effects
    const exertMatch = effectText.match(
      ParserBasedFactory.PATTERNS.EXERT_TARGET,
    );
    if (exertMatch) {
      const target = ParserBasedFactory.parseTarget(effectText);
      effects.push({
        type: "exert",
        parameters: { target },
      });
    }

    // Ready effects
    const readyMatch = effectText.match(
      ParserBasedFactory.PATTERNS.READY_TARGET,
    );
    if (readyMatch) {
      const target = ParserBasedFactory.parseTarget(effectText);
      effects.push({
        type: "ready",
        parameters: { target },
      });
    }

    // If no specific effects found, create a generic multi-effect
    if (effects.length === 0) {
      effects.push({
        type: "multiEffect",
        parameters: { effects: [] },
      });
    }

    return effects;
  }

  /**
   * Parse targets from text
   */
  private static parseTarget(text: string): AbilityTarget | undefined {
    // Chosen character
    const characterMatch = text.match(
      ParserBasedFactory.PATTERNS.CHOSEN_CHARACTER,
    );
    if (characterMatch) {
      const [, controller, state, classification] = characterMatch;

      const target: AbilityTarget = {
        type: "card",
        zone: "play",
        filter: { cardType: "character" },
      };

      if (controller)
        target.controller = controller === "opposing" ? "opponent" : "self";
      if (state === "damaged") target.damaged = true;
      if (state === "ready") target.ready = true;
      if (state === "exerted") target.exerted = true;
      if (classification) target.withClassification = classification;

      return target;
    }

    // Chosen item
    const itemMatch = text.match(ParserBasedFactory.PATTERNS.CHOSEN_ITEM);
    if (itemMatch) {
      const [, controller] = itemMatch;
      return {
        type: "card",
        zone: "play",
        filter: { cardType: "item" },
        controller: controller === "opposing" ? "opponent" : undefined,
      };
    }

    // Chosen location
    const locationMatch = text.match(
      ParserBasedFactory.PATTERNS.CHOSEN_LOCATION,
    );
    if (locationMatch) {
      return {
        type: "location",
        zone: "play",
      };
    }

    // Your characters
    const yourMatch = text.match(ParserBasedFactory.PATTERNS.YOUR_CHARACTERS);
    if (yourMatch) {
      const [, classification] = yourMatch;
      return {
        type: "card",
        zone: "play",
        filter: { cardType: "character" },
        controller: "self",
        targetAll: true,
        withClassification: classification,
      };
    }

    // Opposing characters
    const opposingMatch = text.match(
      ParserBasedFactory.PATTERNS.OPPOSING_CHARACTERS,
    );
    if (opposingMatch) {
      const [, classification] = opposingMatch;
      return {
        type: "card",
        zone: "play",
        filter: { cardType: "character" },
        controller: "opponent",
        targetAll: true,
        withClassification: classification,
      };
    }

    return undefined;
  }

  /**
   * Parse conditions from text
   */
  private static parseCondition(text: string): AbilityCondition {
    // Has in play
    const hasInPlayMatch = text.match(ParserBasedFactory.PATTERNS.HAS_IN_PLAY);
    if (hasInPlayMatch) {
      return {
        type: "cardInPlay",
        cardName: hasInPlayMatch[1],
      };
    }

    // Has damage conditions
    if (text.includes("no damage")) {
      return { type: "noDamage" };
    }
    if (text.includes("has damage")) {
      return { type: "hasDamage" };
    }

    // More/less than conditions
    const moreMatch = text.match(ParserBasedFactory.PATTERNS.MORE_THAN);
    if (moreMatch) {
      return {
        type: "minCharactersInPlay",
        value: Number.parseInt(moreMatch[1], 10),
      };
    }

    // Default condition
    return { type: "activePlayerOnly" };
  }

  /**
   * Parse duration from text
   */
  private static parseDuration(text: string): Effect["duration"] {
    if (ParserBasedFactory.PATTERNS.THIS_TURN.test(text)) {
      return { type: "endOfTurn" };
    }
    if (ParserBasedFactory.PATTERNS.UNTIL_NEXT_TURN.test(text)) {
      return { type: "turns", count: 1 };
    }
    if (ParserBasedFactory.PATTERNS.PERMANENTLY.test(text)) {
      return { type: "permanent" };
    }
    return undefined;
  }

  /**
   * Create a generic ability when specific patterns don't match
   */
  private static createGenericAbility(text: string): Ability {
    // Try to determine the type based on text structure
    let type: AbilityType = "static";

    if (
      text.includes("When") ||
      text.includes("Whenever") ||
      text.includes("At the")
    ) {
      type = "triggered";
    } else if (
      text.includes("{E}") ||
      text.includes("–") ||
      text.includes("—")
    ) {
      type = "activated";
    }

    return {
      type,
      text,
      effects: [
        {
          type: "multiEffect",
          parameters: { effects: [] },
        },
      ],
    };
  }

  /**
   * Batch parse multiple card texts
   */
  static parseMultipleCardTexts(cardTexts: string[]): Ability[] {
    return cardTexts.flatMap((text) => ParserBasedFactory.parseCardText(text));
  }

  /**
   * Parse card texts with metadata
   */
  static parseWithMetadata(
    cardTexts: Array<{
      text: string;
      cardName?: string;
      cardSet?: string;
      rarity?: string;
    }>,
  ): Array<{
    abilities: Ability[];
    metadata: (typeof cardTexts)[0];
  }> {
    return cardTexts.map(({ text, ...metadata }) => ({
      abilities: ParserBasedFactory.parseCardText(text),
      metadata: { text, ...metadata },
    }));
  }
}
