import type { LorcanaZone } from "../../lorcana-engine-types";
import type {
  Ability,
  AbilityCondition,
  AbilityTarget,
  AbilityType,
  Effect,
  Keyword,
  KeywordAbility,
  LorcanaAbilityCost,
  TriggerTiming,
} from "../ability-types";

/**
 * Unified AbilityFactory - Combines both template-based creation and natural language parsing
 * for creating abilities from card text or manually through structured API
 */
export class AbilityFactory {
  // === MANUAL CREATION METHODS ===

  /**
   * Create a triggered ability manually
   */
  static triggered(
    text: string,
    timing: TriggerTiming,
    effects: Effect[],
    condition?: AbilityCondition,
    optional = false,
    name?: string,
  ): Ability {
    return {
      type: "triggered",
      text,
      name,
      effects,
      timing,
      condition,
      optional,
    };
  }

  /**
   * Create an activated ability manually
   */
  static activated(
    text: string,
    cost: LorcanaAbilityCost,
    effects: Effect[],
    targets?: AbilityTarget[],
    name?: string,
  ): Ability {
    return {
      type: "activated",
      text,
      name,
      cost,
      effects,
      targets,
    };
  }

  /**
   * Create a static ability manually
   */
  static static(
    text: string,
    effects: Effect[],
    condition?: AbilityCondition,
    name?: string,
  ): Ability {
    return {
      type: "static",
      text,
      name,
      effects,
      condition,
    };
  }

  /**
   * Create a keyword ability manually
   */
  static keyword(keyword: Keyword, value?: number, text?: string): Ability {
    return {
      type: "keyword",
      text: text || keyword,
      keyword: {
        type: keyword,
        value,
      },
      effects: [],
    };
  }

  /**
   * Create a replacement effect ability
   */
  static replacement(
    text: string,
    effects: Effect[],
    condition?: AbilityCondition,
    name?: string,
  ): Ability {
    return {
      type: "replacement",
      text,
      name,
      effects,
      condition,
    };
  }

  // === PATTERN-BASED TEMPLATE METHODS ===

  /**
   * Template: "When you play this character, [effect]"
   */
  static templateOnPlay(
    effectText: string,
    effects: Effect[],
    name?: string,
  ): Ability {
    return AbilityFactory.triggered(
      `When you play this character, ${effectText}`,
      "onPlay",
      effects,
      { type: "onEnterPlay" },
      false,
      name,
    );
  }

  /**
   * Template: "Whenever this character quests, [effect]"
   */
  static templateOnQuest(
    effectText: string,
    effects: Effect[],
    name?: string,
  ): Ability {
    return AbilityFactory.triggered(
      `Whenever this character quests, ${effectText}`,
      "onQuest",
      effects,
      { type: "onQuest" },
      false,
      name,
    );
  }

  /**
   * Template: "{E} - [effect]"
   */
  static templateExertActivated(
    effectText: string,
    effects: Effect[],
    inkCost = 0,
    name?: string,
  ): Ability {
    const cost: LorcanaAbilityCost = { exert: true };
    if (inkCost > 0) {
      cost.ink = inkCost;
    }

    return AbilityFactory.activated(
      `{E}${inkCost > 0 ? `, ${inkCost} {I}` : ""} – ${effectText}`,
      cost,
      effects,
      undefined,
      name,
    );
  }

  /**
   * Template: "While [condition], [effect]"
   */
  static templateWhileCondition(
    conditionText: string,
    effectText: string,
    effects: Effect[],
    condition: AbilityCondition,
    name?: string,
  ): Ability {
    return AbilityFactory.static(
      `While ${conditionText}, ${effectText}`,
      effects,
      condition,
      name,
    );
  }

  /**
   * Template: "When this character is banished, [effect]"
   */
  static templateOnBanish(
    effectText: string,
    effects: Effect[],
    name?: string,
  ): Ability {
    return AbilityFactory.triggered(
      `When this character is banished, ${effectText}`,
      "onBanish",
      effects,
      { type: "onBanish" },
      false,
      name,
    );
  }

  /**
   * Template: Shift ability
   */
  static templateShift(
    cost: number,
    targetName?: string,
    additionalEffects?: Effect[],
  ): Ability {
    const shiftText = targetName
      ? `Shift ${cost} (You may pay ${cost} {I} to play this on top of one of your characters named ${targetName}.)`
      : `Shift ${cost}`;

    return {
      type: "keyword",
      text: shiftText,
      keyword: {
        type: "Shift",
        value: cost,
      },
      effects: additionalEffects || [],
      shift: {
        type: targetName ? "standard" : "universal",
        cost: { ink: cost },
        value: cost,
        targetName,
      },
    };
  }

  // === QUICK CREATION HELPERS ===

  /**
   * Quick creation methods for common patterns
   */
  static quickCreate = {
    onPlay: (effectText: string, effects: Effect[], name?: string) =>
      AbilityFactory.triggered(
        `When you play this character, ${effectText}`,
        "onPlay",
        effects,
        { type: "onEnterPlay" },
        false,
        name,
      ),

    onQuest: (effectText: string, effects: Effect[], name?: string) =>
      AbilityFactory.triggered(
        `Whenever this character quests, ${effectText}`,
        "onQuest",
        effects,
        { type: "onQuest" },
        false,
        name,
      ),

    exertActivated: (
      effectText: string,
      effects: Effect[],
      inkCost = 0,
      name?: string,
    ) =>
      AbilityFactory.activated(
        `{E}${inkCost > 0 ? `, ${inkCost} {I}` : ""} – ${effectText}`,
        { exert: true, ...(inkCost > 0 && { ink: inkCost }) },
        effects,
        undefined,
        name,
      ),

    gainLore: (amount: number) =>
      AbilityFactory.fromCardText(`gain ${amount} lore`)[0] ||
      AbilityFactory.static(`gain ${amount} lore`, [
        {
          type: "gainLore",
          parameters: { amount },
        },
      ]),

    drawCard: (amount = 1) => {
      // Create a direct draw card ability without relying on parsing
      return AbilityFactory.static(
        `draw ${amount} card${amount > 1 ? "s" : ""}`,
        [
          {
            type: "draw",
            parameters: {
              amount,
            },
          },
        ],
      );
    },
  };

  // === BATCH CREATION METHODS ===

  /**
   * Create multiple abilities from a configuration object
   */
  static fromConfig(config: {
    type: AbilityType;
    text: string;
    name?: string;
    effects: Effect[];
    timing?: TriggerTiming;
    cost?: LorcanaAbilityCost;
    condition?: AbilityCondition;
    keyword?: KeywordAbility;
    optional?: boolean;
    targets?: AbilityTarget[];
  }): Ability {
    const base = {
      type: config.type,
      text: config.text,
      name: config.name,
      effects: config.effects,
      optional: config.optional,
    };

    switch (config.type) {
      case "triggered":
        return {
          ...base,
          timing: config.timing,
          condition: config.condition,
        };
      case "activated":
        return {
          ...base,
          cost: config.cost,
          targets: config.targets,
        };
      case "static":
        return {
          ...base,
          condition: config.condition,
        };
      case "keyword":
        return {
          ...base,
          keyword: config.keyword,
        };
      case "replacement":
        return {
          ...base,
          condition: config.condition,
        };
      default:
        return base as Ability;
    }
  }

  // === NATURAL LANGUAGE PARSING METHODS ===

  /**
   * Parse card text into structured abilities (main entry point)
   * Falls back to manual creation if parsing fails
   */
  static fromCardText(cardText: string, name?: string): Ability[] {
    const abilities: Ability[] = [];
    const text = cardText.trim();

    if (!text) return abilities;

    // Split by ability separators
    const abilityTexts = AbilityFactory.splitIntoAbilities(text);

    for (const abilityText of abilityTexts) {
      const ability = AbilityFactory.parseAbilityText(abilityText, name);
      if (ability) {
        abilities.push(ability);
      }
    }

    return abilities;
  }

  /**
   * Parse single ability text with intelligent fallbacks
   */
  private static parseAbilityText(text: string, name?: string): Ability | null {
    const cleanText = text.trim();
    if (!cleanText) return null;

    // Try parsing in order of specificity
    let ability: Ability | null = null;

    // 1. Try keywords first (most specific)
    ability = AbilityFactory.parseKeyword(cleanText);
    if (ability) return ability;

    // 2. Try triggered abilities
    ability = AbilityFactory.parseTriggeredAbility(cleanText);
    if (ability) return ability;

    // 3. Try activated abilities
    ability = AbilityFactory.parseActivatedAbility(cleanText);
    if (ability) return ability;

    // 4. Try static abilities
    ability = AbilityFactory.parseStaticAbility(cleanText);
    if (ability) return ability;

    // 5. Create generic ability as fallback
    return AbilityFactory.createGenericAbility(cleanText, name);
  }

  // === PARSING PATTERNS ===

  private static readonly PATTERNS = {
    // Keywords
    SIMPLE_KEYWORD: /^(Bodyguard|Evasive|Rush|Ward|Vanish|Support)$/i,
    KEYWORD_WITH_VALUE: /^(Challenger|Resist|Singer|Shift)\s*\+?(\d+)$/i,

    // Triggered abilities - simplified patterns
    ON_PLAY: /^When you play this character,\s*(.+)$/i,
    ON_QUEST: /^Whenever this character quests,\s*(.+)$/i,
    ON_BANISH: /^When this character is banished,\s*(.+)$/i,
    ON_CHALLENGE: /^When(?:ever)? this character challenges,\s*(.+)$/i,
    AT_START: /^At the start of your turn,\s*(.+)$/i,
    AT_END: /^At the end of your turn,\s*(.+)$/i,

    // Activated abilities
    EXERT_ABILITY: /^\{E\}(?:,\s*(\d+)\s*\{I\})?\s*[-–—]\s*(.+)$/i,
    INK_ABILITY: /^(\d+)\s*\{I\}(?:,\s*(.+?))?\s*[-–—]\s*(.+)$/i,

    // Static abilities
    WHILE_CONDITION: /^While (.+?),\s*(.+)$/i,

    // Simple effects
    GAIN_LORE: /gain (\d+) lore/i,
    DRAW_CARDS: /draw (?:(\d+) )?cards?/i,
    DEAL_DAMAGE: /deal (\d+) damage/i,
    BOOST_STAT: /(?:gets?|gains?) ([+-]\d+) \{([SWL])\}/i,
  };

  private static splitIntoAbilities(text: string): string[] {
    // First check if this is a simple keyword
    const simpleKeywords = [
      "Bodyguard",
      "Evasive",
      "Rush",
      "Ward",
      "Vanish",
      "Support",
    ];
    if (simpleKeywords.includes(text.trim())) {
      return [text.trim()];
    }

    // Split on common separators like newlines or periods followed by spaces
    const parts = text.split(/\n+|\.\s+/);

    // Clean up each part and filter out empty ones
    return (
      parts
        .map((part) => part.trim())
        .filter((part) => part.length > 0)
        // Add back periods for non-keyword abilities
        .map((part) => {
          const isKeyword =
            simpleKeywords.includes(part) ||
            /^(Challenger|Resist|Singer|Shift)\s*\+?(\d+)$/.test(part);
          return isKeyword ? part : part.endsWith(".") ? part : part + ".";
        })
    );
  }

  private static parseKeyword(text: string): Ability | null {
    // Simple keywords
    const simpleMatch = text.match(AbilityFactory.PATTERNS.SIMPLE_KEYWORD);
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
    const valueMatch = text.match(AbilityFactory.PATTERNS.KEYWORD_WITH_VALUE);
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

  private static parseTriggeredAbility(text: string): Ability | null {
    const patterns: Array<{
      pattern: RegExp;
      timing: TriggerTiming;
      conditionType: string;
    }> = [
      {
        pattern: AbilityFactory.PATTERNS.ON_PLAY,
        timing: "onPlay",
        conditionType: "onEnterPlay",
      },
      {
        pattern: AbilityFactory.PATTERNS.ON_QUEST,
        timing: "onQuest",
        conditionType: "onQuest",
      },
      {
        pattern: AbilityFactory.PATTERNS.ON_BANISH,
        timing: "onBanish",
        conditionType: "onBanish",
      },
      {
        pattern: AbilityFactory.PATTERNS.ON_CHALLENGE,
        timing: "onChallenge",
        conditionType: "onChallenge",
      },
      {
        pattern: AbilityFactory.PATTERNS.AT_START,
        timing: "startOfTurn",
        conditionType: "activePlayerOnly",
      },
      {
        pattern: AbilityFactory.PATTERNS.AT_END,
        timing: "endOfTurn",
        conditionType: "activePlayerOnly",
      },
    ];

    for (const { pattern, timing, conditionType } of patterns) {
      const match = text.match(pattern);
      if (match) {
        const effectText = match[1];
        const effects = AbilityFactory.parseSimpleEffects(effectText);

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

  private static parseActivatedAbility(text: string): Ability | null {
    // Exert abilities
    const exertMatch = text.match(AbilityFactory.PATTERNS.EXERT_ABILITY);
    if (exertMatch) {
      const [, inkCost, effectText] = exertMatch;
      const cost: LorcanaAbilityCost = { exert: true };
      if (inkCost) {
        cost.ink = Number.parseInt(inkCost, 10);
      }

      const effects = AbilityFactory.parseSimpleEffects(effectText);

      return {
        type: "activated",
        text,
        cost,
        effects,
      };
    }

    // Ink-only abilities
    const inkMatch = text.match(AbilityFactory.PATTERNS.INK_ABILITY);
    if (inkMatch) {
      const [, inkCost, , effectText] = inkMatch;
      const cost: LorcanaAbilityCost = { ink: Number.parseInt(inkCost, 10) };
      const effects = AbilityFactory.parseSimpleEffects(effectText);

      return {
        type: "activated",
        text,
        cost,
        effects,
      };
    }

    return null;
  }

  private static parseStaticAbility(text: string): Ability | null {
    const whileMatch = text.match(AbilityFactory.PATTERNS.WHILE_CONDITION);
    if (whileMatch) {
      const [, conditionText, effectText] = whileMatch;
      const condition = AbilityFactory.parseSimpleCondition(conditionText);
      const effects = AbilityFactory.parseSimpleEffects(effectText);

      return {
        type: "static",
        text,
        condition,
        effects,
      };
    }

    return null;
  }

  private static parseSimpleEffects(effectText: string): Effect[] {
    const effects: Effect[] = [];

    // Gain lore
    const loreMatch = effectText.match(AbilityFactory.PATTERNS.GAIN_LORE);
    if (loreMatch) {
      effects.push({
        type: "gainLore",
        parameters: { amount: Number.parseInt(loreMatch[1], 10) },
        optional: false,
      });
    }

    // Draw cards
    const drawMatch = effectText.match(AbilityFactory.PATTERNS.DRAW_CARDS);
    if (drawMatch) {
      const amount = drawMatch[1] ? Number.parseInt(drawMatch[1], 10) : 1;
      effects.push({
        type: "draw",
        parameters: { amount },
        optional: false,
      });
    }

    // Deal damage
    const damageMatch = effectText.match(AbilityFactory.PATTERNS.DEAL_DAMAGE);
    if (damageMatch) {
      effects.push({
        type: "dealDamage",
        parameters: { amount: Number.parseInt(damageMatch[1], 10) },
        optional: false,
      });
    }

    // Stat modifications
    const statMatch = effectText.match(AbilityFactory.PATTERNS.BOOST_STAT);
    if (statMatch) {
      const [, valueStr, statLetter] = statMatch;
      const value = Number.parseInt(valueStr, 10);
      const statMap = { S: "strength", W: "willpower", L: "lore" } as const;
      const stat = statMap[statLetter as keyof typeof statMap];

      effects.push({
        type: "modifyStat",
        parameters: {
          stat,
          value,
        },
        duration: effectText.includes("this turn")
          ? { type: "endOfTurn" }
          : undefined,
        optional: false,
      });
    }

    // If no specific effects found, create a generic multi-effect
    if (effects.length === 0) {
      effects.push({
        type: "multiEffect",
        parameters: { effects: [] },
      });
    }

    // Apply duration to all effects if not already specified
    if (effectText.includes("this turn")) {
      effects.forEach((effect) => {
        if (!effect.duration) {
          effect.duration = { type: "endOfTurn" };
        }
      });
    }

    return effects;
  }

  private static parseSimpleCondition(conditionText: string): AbilityCondition {
    // Basic condition parsing - can be expanded
    if (conditionText.includes("no damage")) {
      return { type: "noDamage" };
    }
    if (conditionText.includes("has damage")) {
      return { type: "hasDamage" };
    }

    // Default condition
    return { type: "activePlayerOnly" };
  }

  private static createGenericAbility(text: string, name?: string): Ability {
    // Determine type based on text structure
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
      name,
      effects: [
        {
          type: "multiEffect",
          parameters: { effects: [] },
        },
      ],
    };
  }

  /**
   * Create ability with automatic parsing but manual override capability
   */
  static create(options: {
    text: string;
    name?: string;
    // Manual overrides
    type?: AbilityType;
    effects?: Effect[];
    timing?: TriggerTiming;
    cost?: LorcanaAbilityCost;
    condition?: AbilityCondition;
    keyword?: KeywordAbility;
    optional?: boolean;
  }): Ability {
    // Try parsing first
    const parsed = AbilityFactory.parseAbilityText(options.text, options.name);

    if (!parsed) {
      // Create generic if parsing fails
      return AbilityFactory.createGenericAbility(options.text, options.name);
    }

    // Apply manual overrides
    return {
      ...parsed,
      ...(options.type && { type: options.type }),
      ...(options.effects && { effects: options.effects }),
      ...(options.timing && { timing: options.timing }),
      ...(options.cost && { cost: options.cost }),
      ...(options.condition && { condition: options.condition }),
      ...(options.keyword && { keyword: options.keyword }),
      ...(options.optional !== undefined && { optional: options.optional }),
    };
  }

  /**
   * Parse multiple card texts
   */
  static fromMultipleCardTexts(cardTexts: string[]): Ability[] {
    return cardTexts.flatMap((text) => AbilityFactory.fromCardText(text));
  }

  /**
   * Create abilities from pattern configurations
   */
  static fromConfigs(
    configs: Array<{
      text: string;
      name?: string;
      type?: AbilityType;
      effects?: Effect[];
      timing?: TriggerTiming;
      cost?: LorcanaAbilityCost;
      condition?: AbilityCondition;
      keyword?: KeywordAbility;
      optional?: boolean;
    }>,
  ): Ability[] {
    return configs.map((config) => AbilityFactory.create(config));
  }
}
