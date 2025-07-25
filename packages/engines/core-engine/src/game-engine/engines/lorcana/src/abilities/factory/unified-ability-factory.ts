import type { LorcanaZone } from "../../lorcana-engine-types";
import type {
  Ability,
  AbilityCondition,
  AbilityCost,
  AbilityTarget,
  AbilityType,
  Effect,
  Keyword,
  KeywordAbility,
  TriggerTiming,
} from "../ability-types";
import { AbilityFactory } from "./ability-factory";
import { EffectFactory } from "./effect-factory";

/**
 * Unified Ability Factory - Combines parser-based and template-based approaches
 * Provides both automatic parsing from card text and manual creation methods
 */
export class UnifiedAbilityFactory {
  // === MANUAL CREATION METHODS (from AbilityFactory) ===

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
    return AbilityFactory.triggered(
      text,
      timing,
      effects,
      condition,
      optional,
      name,
    );
  }

  /**
   * Create an activated ability manually
   */
  static activated(
    text: string,
    cost: AbilityCost,
    effects: Effect[],
    targets?: AbilityTarget[],
    name?: string,
  ): Ability {
    return AbilityFactory.activated(text, cost, effects, targets, name);
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
    return AbilityFactory.static(text, effects, condition, name);
  }

  /**
   * Create a keyword ability manually
   */
  static keyword(keyword: Keyword, value?: number, text?: string): Ability {
    return AbilityFactory.keyword(keyword, value, text);
  }

  // === PARSING METHODS ===

  /**
   * Parse card text into structured abilities (main entry point)
   * Falls back to manual creation if parsing fails
   */
  static fromCardText(cardText: string, name?: string): Ability[] {
    const abilities: Ability[] = [];
    const text = cardText.trim();

    if (!text) return abilities;

    // Split by ability separators
    const abilityTexts = UnifiedAbilityFactory.splitIntoAbilities(text);

    for (const abilityText of abilityTexts) {
      const ability = UnifiedAbilityFactory.parseAbilityText(abilityText, name);
      if (ability) {
        abilities.push(ability);
      }
    }

    return abilities;
  }

  /**
   * Parse single ability text with intelligent fallbacks
   */
  static parseAbilityText(text: string, name?: string): Ability | null {
    const cleanText = text.trim();
    if (!cleanText) return null;

    // Try parsing in order of specificity
    let ability: Ability | null = null;

    // 1. Try keywords first (most specific)
    ability = UnifiedAbilityFactory.parseKeyword(cleanText);
    if (ability) return ability;

    // 2. Try triggered abilities
    ability = UnifiedAbilityFactory.parseTriggeredAbility(cleanText);
    if (ability) return ability;

    // 3. Try activated abilities
    ability = UnifiedAbilityFactory.parseActivatedAbility(cleanText);
    if (ability) return ability;

    // 4. Try static abilities
    ability = UnifiedAbilityFactory.parseStaticAbility(cleanText);
    if (ability) return ability;

    // 5. Create generic ability as fallback
    return UnifiedAbilityFactory.createGenericAbility(cleanText, name);
  }

  // === SIMPLE PARSING PATTERNS ===

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
    // Split on common separators like newlines or periods followed by capital letters
    const parts = text.split(/\n+|(?<=\.)\s*(?=[A-Z])/);
    return parts.map((part) => part.trim()).filter((part) => part.length > 0);
  }

  private static parseKeyword(text: string): Ability | null {
    // Simple keywords
    const simpleMatch = text.match(
      UnifiedAbilityFactory.PATTERNS.SIMPLE_KEYWORD,
    );
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
      UnifiedAbilityFactory.PATTERNS.KEYWORD_WITH_VALUE,
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

  private static parseTriggeredAbility(text: string): Ability | null {
    const patterns: Array<{
      pattern: RegExp;
      timing: TriggerTiming;
      conditionType: string;
    }> = [
      {
        pattern: UnifiedAbilityFactory.PATTERNS.ON_PLAY,
        timing: "onPlay",
        conditionType: "onEnterPlay",
      },
      {
        pattern: UnifiedAbilityFactory.PATTERNS.ON_QUEST,
        timing: "onQuest",
        conditionType: "onQuest",
      },
      {
        pattern: UnifiedAbilityFactory.PATTERNS.ON_BANISH,
        timing: "onBanish",
        conditionType: "onBanish",
      },
      {
        pattern: UnifiedAbilityFactory.PATTERNS.ON_CHALLENGE,
        timing: "onChallenge",
        conditionType: "onChallenge",
      },
      {
        pattern: UnifiedAbilityFactory.PATTERNS.AT_START,
        timing: "startOfTurn",
        conditionType: "activePlayerOnly",
      },
      {
        pattern: UnifiedAbilityFactory.PATTERNS.AT_END,
        timing: "endOfTurn",
        conditionType: "activePlayerOnly",
      },
    ];

    for (const { pattern, timing, conditionType } of patterns) {
      const match = text.match(pattern);
      if (match) {
        const effectText = match[1];
        const effects = UnifiedAbilityFactory.parseSimpleEffects(effectText);

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
    const exertMatch = text.match(UnifiedAbilityFactory.PATTERNS.EXERT_ABILITY);
    if (exertMatch) {
      const [, inkCost, effectText] = exertMatch;
      const cost: AbilityCost = { exert: true };
      if (inkCost) {
        cost.ink = Number.parseInt(inkCost, 10);
      }

      const effects = UnifiedAbilityFactory.parseSimpleEffects(effectText);

      return {
        type: "activated",
        text,
        cost,
        effects,
      };
    }

    // Ink-only abilities
    const inkMatch = text.match(UnifiedAbilityFactory.PATTERNS.INK_ABILITY);
    if (inkMatch) {
      const [, inkCost, , effectText] = inkMatch;
      const cost: AbilityCost = { ink: Number.parseInt(inkCost, 10) };
      const effects = UnifiedAbilityFactory.parseSimpleEffects(effectText);

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
    const whileMatch = text.match(
      UnifiedAbilityFactory.PATTERNS.WHILE_CONDITION,
    );
    if (whileMatch) {
      const [, conditionText, effectText] = whileMatch;
      const condition =
        UnifiedAbilityFactory.parseSimpleCondition(conditionText);
      const effects = UnifiedAbilityFactory.parseSimpleEffects(effectText);

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
    const loreMatch = effectText.match(
      UnifiedAbilityFactory.PATTERNS.GAIN_LORE,
    );
    if (loreMatch) {
      effects.push(EffectFactory.gainLore(Number.parseInt(loreMatch[1], 10)));
    }

    // Draw cards
    const drawMatch = effectText.match(
      UnifiedAbilityFactory.PATTERNS.DRAW_CARDS,
    );
    if (drawMatch) {
      const amount = drawMatch[1] ? Number.parseInt(drawMatch[1], 10) : 1;
      effects.push(EffectFactory.draw(amount));
    }

    // Deal damage
    const damageMatch = effectText.match(
      UnifiedAbilityFactory.PATTERNS.DEAL_DAMAGE,
    );
    if (damageMatch) {
      effects.push(
        EffectFactory.dealDamage(Number.parseInt(damageMatch[1], 10)),
      );
    }

    // Stat modifications
    const statMatch = effectText.match(
      UnifiedAbilityFactory.PATTERNS.BOOST_STAT,
    );
    if (statMatch) {
      const [, valueStr, statLetter] = statMatch;
      const value = Number.parseInt(valueStr, 10);
      const statMap = { S: "strength", W: "willpower", L: "lore" } as const;
      const stat = statMap[statLetter as keyof typeof statMap];

      effects.push(
        EffectFactory.modifyStat(
          stat,
          value,
          undefined,
          effectText.includes("this turn") ? { type: "endOfTurn" } : undefined,
        ),
      );
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

  // === CONVENIENCE METHODS ===

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
    cost?: AbilityCost;
    condition?: AbilityCondition;
    keyword?: KeywordAbility;
    optional?: boolean;
  }): Ability {
    // Try parsing first
    const parsed = UnifiedAbilityFactory.parseAbilityText(
      options.text,
      options.name,
    );

    if (!parsed) {
      // Create generic if parsing fails
      return UnifiedAbilityFactory.createGenericAbility(
        options.text,
        options.name,
      );
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
   * Quick creation methods for common patterns
   */
  static quickCreate = {
    onPlay: (effectText: string, effects: Effect[], name?: string) =>
      UnifiedAbilityFactory.triggered(
        `When you play this character, ${effectText}`,
        "onPlay",
        effects,
        { type: "onEnterPlay" },
        false,
        name,
      ),

    onQuest: (effectText: string, effects: Effect[], name?: string) =>
      UnifiedAbilityFactory.triggered(
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
      UnifiedAbilityFactory.activated(
        `{E}${inkCost > 0 ? `, ${inkCost} {I}` : ""} – ${effectText}`,
        { exert: true, ...(inkCost > 0 && { ink: inkCost }) },
        effects,
        undefined,
        name,
      ),

    gainLore: (amount: number) =>
      UnifiedAbilityFactory.fromCardText(`gain ${amount} lore`)[0] ||
      UnifiedAbilityFactory.static(`gain ${amount} lore`, [
        EffectFactory.gainLore(amount),
      ]),

    drawCard: (amount = 1) =>
      UnifiedAbilityFactory.fromCardText(
        `draw ${amount} card${amount > 1 ? "s" : ""}`,
      )[0] ||
      UnifiedAbilityFactory.static(
        `draw ${amount} card${amount > 1 ? "s" : ""}`,
        [EffectFactory.draw(amount)],
      ),
  };

  // === BATCH OPERATIONS ===

  /**
   * Parse multiple card texts
   */
  static fromMultipleCardTexts(cardTexts: string[]): Ability[] {
    return cardTexts.flatMap((text) =>
      UnifiedAbilityFactory.fromCardText(text),
    );
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
      cost?: AbilityCost;
      condition?: AbilityCondition;
      keyword?: KeywordAbility;
      optional?: boolean;
    }>,
  ): Ability[] {
    return configs.map((config) => UnifiedAbilityFactory.create(config));
  }
}
