// We're migrating to the new type definition

import type { LorcanaEffect } from "~/game-engine/engines/lorcana/src/abilities/effect-types";
import type {
  AbilityTarget,
  CardTarget,
  PlayerTarget,
} from "~/game-engine/engines/lorcana/src/abilities/targets/targets";
import type { LorcanaTriggerTiming as TriggerTiming } from "~/game-engine/engines/lorcana/src/abilities/triggered/triggered-ability";
// Deprecated
import type {
  LorcanaAbility as Ability,
  AbilityCondition,
  LorcanaAbilityType as AbilityType,
  LorcanaAbility,
  LorcanaAbilityCost,
  LorcanaBaseAbility,
} from "../ability-types";
import type {
  LorcanaKeywords as Keyword,
  LorcanaKeywordAbility as KeywordAbility,
  LorcanaKeywords,
} from "../keyword/keyword";

/**
 * AbilityBuilder - Implements the Builder pattern for creating abilities
 * Allows step-by-step construction of complex abilities with method chaining
 */
export class AbilityBuilder {
  private ability: any = {
    effects: [],
  };

  // === CORE BUILDER METHODS ===

  /**
   * Set the ability text
   */
  setText(text: string): AbilityBuilder {
    this.ability.text = text;
    return this;
  }

  /**
   * Set the ability name
   */
  setName(name: string): AbilityBuilder {
    this.ability.name = name;
    return this;
  }

  /**
   * Set the ability type
   */
  setType(type: AbilityType): AbilityBuilder {
    this.ability.type = type;
    return this;
  }

  /**
   * Add an effect to the ability
   */
  addEffect(effect: LorcanaEffect): AbilityBuilder {
    if (!this.ability.effects) {
      this.ability.effects = [];
    }
    this.ability.effects.push(effect);
    return this;
  }

  /**
   * Set multiple effects at once
   */
  setEffects(effects: LorcanaEffect[]): AbilityBuilder {
    this.ability.effects = [...effects];
    return this;
  }

  /**
   * Set the trigger timing (for triggered abilities)
   */
  setTiming(timing: TriggerTiming): AbilityBuilder {
    this.ability.timing = timing;
    return this;
  }

  /**
   * Set the cost (for activated abilities)
   */
  setCost(cost: LorcanaAbilityCost): AbilityBuilder {
    this.ability.cost = cost;
    return this;
  }

  /**
   * Set the condition
   */
  setCondition(condition: AbilityCondition): AbilityBuilder {
    this.ability.condition = condition;
    return this;
  }

  /**
   * Set the keyword (for keyword abilities)
   */
  setKeyword(keyword: KeywordAbility | any): AbilityBuilder {
    // Convert from LorcanaKeywordAbility to KeywordAbility if needed
    if ("keyword" in keyword) {
      // It's a LorcanaKeywordAbility
      this.ability.keyword = {
        type: keyword.keyword as unknown as Keyword,
        // Note: LorcanaKeywordAbility doesn't have a value property
      };
    } else {
      // It's a KeywordAbility
      this.ability.keyword = keyword;
    }
    return this;
  }

  /**
   * Set targets
   */
  setTargets(targets: AbilityTarget[] | AbilityTarget): AbilityBuilder {
    this.ability.targets = Array.isArray(targets) ? targets : [targets];
    return this;
  }

  /**
   * Set if the ability is optional
   */
  setOptional(optional: boolean): AbilityBuilder {
    this.ability.optional = optional;
    return this;
  }

  /**
   * Build the final ability
   */
  build(): LorcanaAbility {
    if (!this.ability.type) {
      throw new Error("Ability type is required");
    }

    // For keyword abilities, return the simple format expected by tests
    if (this.ability.type === "keyword" && this.ability.keyword) {
      return {
        type: "keyword",
        keyword: this.ability.keyword.type,
        ...(this.ability.keyword.value !== undefined && {
          value: this.ability.keyword.value,
        }),
      } as any;
    }

    if (!this.ability.text) {
      throw new Error("Ability text is required");
    }
    if (!this.ability.effects || this.ability.effects.length === 0) {
      throw new Error("At least one effect is required");
    }

    return {
      type: this.ability.type,
      text: this.ability.text,
      effects: this.ability.effects,
      ...(this.ability.name && { name: this.ability.name }),
      ...(this.ability.timing && { timing: this.ability.timing }),
      ...(this.ability.cost && { cost: this.ability.cost }),
      ...(this.ability.condition && { condition: this.ability.condition }),
      ...(this.ability.keyword && { keyword: this.ability.keyword }),
      ...(this.ability.targets && { targets: this.ability.targets }),
      ...(this.ability.optional !== undefined && {
        optional: this.ability.optional,
      }),
    } as LorcanaAbility;
  }

  /**
   * Reset the builder to create a new ability
   */
  reset(): AbilityBuilder {
    this.ability = { effects: [] };
    return this;
  }

  // === STATIC FACTORY METHODS ===

  /**
   * Create a new builder instance
   */
  static create(): AbilityBuilder {
    return new AbilityBuilder();
  }

  /**
   * Create a triggered ability builder
   */
  static triggered(text: string, timing: TriggerTiming): AbilityBuilder {
    return new AbilityBuilder()
      .setType("triggered")
      .setText(text)
      .setTiming(timing);
  }

  /**
   * Create an activated ability builder
   */
  static activated(text: string, cost: LorcanaAbilityCost): AbilityBuilder {
    return new AbilityBuilder()
      .setType("activated")
      .setText(text)
      .setCost(cost);
  }

  /**
   * Create a static ability builder
   */
  static static(text: string): AbilityBuilder {
    return new AbilityBuilder().setType("static").setText(text);
  }

  /**
   * Create a keyword ability builder
   */
  static keyword(
    keyword: LorcanaKeywords,
    value?: number,
    text?: string,
  ): AbilityBuilder {
    const keywordText = text || keyword;
    const keywordAbility = {
      type: "keyword" as const,
      keyword: keyword,
      ...(value !== undefined && { value }),
    };

    return new AbilityBuilder()
      .setType("keyword")
      .setText(keywordText)
      .setKeyword(keywordAbility)
      .addEffect({ type: "multiEffect", parameters: { effects: [] } }); // Placeholder effect for keywords
  }

  /**
   * Create a replacement effect ability builder
   */
  static replacement(text: string): AbilityBuilder {
    return new AbilityBuilder().setType("replacement").setText(text);
  }

  // === TEXT PARSING METHODS ===

  /**
   * Parse card text into abilities (main entry point)
   */
  static fromText(cardText: string): LorcanaAbility[] {
    const abilities: LorcanaAbility[] = [];
    const text = cardText.trim();

    if (!text) {
      return abilities;
    }

    // Split by ability separators
    const abilityTexts = AbilityBuilder.splitIntoAbilities(text);

    for (const abilityText of abilityTexts) {
      const ability = AbilityBuilder.parseAbilityText(abilityText);
      if (ability) {
        abilities.push(ability);
      }
    }

    return abilities;
  }

  /**
   * Parse single ability text with intelligent fallbacks
   */
  private static parseAbilityText(text: string): LorcanaAbility | null {
    const cleanText = text.trim();
    if (!cleanText) return null;

    // Try parsing in order of specificity
    let builder: AbilityBuilder | null = null;

    // 1. Try keywords first (most specific)
    builder = AbilityBuilder.parseKeyword(cleanText);
    if (builder) return builder.build();

    // 2. Try triggered abilities
    builder = AbilityBuilder.parseTriggeredAbility(cleanText);
    if (builder) return builder.build();

    // 3. Try activated abilities
    builder = AbilityBuilder.parseActivatedAbility(cleanText);
    if (builder) return builder.build();

    // 4. Try static abilities
    builder = AbilityBuilder.parseStaticAbility(cleanText);
    if (builder) return builder.build();

    // 5. Create generic ability as fallback
    return AbilityBuilder.createGenericAbility(cleanText);
  }

  // === PARSING PATTERNS ===

  private static readonly PATTERNS = {
    // Keywords - Updated to include all missing keywords
    SIMPLE_KEYWORD:
      /^(Bodyguard|Evasive|Rush|Ward|Vanish|Support|Reckless|Voiceless)$/i,
    KEYWORD_WITH_VALUE:
      /^\*\*(Challenger|Resist|Singer|Shift|Sing[\s-]?Together)\*\*\s*\+?(\d+)\s*_\([^)]+\)_\.?$/i,

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
      "Reckless",
      "Voiceless",
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

  private static parseKeyword(text: string): AbilityBuilder | null {
    // Simple keywords
    const simpleMatch = text.match(AbilityBuilder.PATTERNS.SIMPLE_KEYWORD);
    if (simpleMatch) {
      const keyword = simpleMatch[1].toLowerCase() as LorcanaKeywords;
      return AbilityBuilder.keyword(keyword, undefined, text);
    }

    // Keywords with values
    const valueMatch = text.match(AbilityBuilder.PATTERNS.KEYWORD_WITH_VALUE);
    if (valueMatch) {
      const [, keywordRaw, value] = valueMatch;
      // Normalize keyword name to match LorcanaKeywords type
      let keyword: string = keywordRaw.toLowerCase();
      if (
        keyword.includes("sing") &&
        (keyword.includes("together") || keyword.includes(" together"))
      ) {
        keyword = "sing-together";
      }

      return AbilityBuilder.keyword(
        keyword as LorcanaKeywords,
        Number.parseInt(value, 10),
        text,
      );
    }

    return null;
  }

  private static parseTriggeredAbility(text: string): AbilityBuilder | null {
    const patterns: Array<{
      pattern: RegExp;
      timing: TriggerTiming;
      conditionType: string;
    }> = [
      {
        pattern: AbilityBuilder.PATTERNS.ON_PLAY,
        timing: "onPlay",
        conditionType: "onEnterPlay",
      },
      {
        pattern: AbilityBuilder.PATTERNS.ON_QUEST,
        timing: "onQuest",
        conditionType: "onQuest",
      },
      {
        pattern: AbilityBuilder.PATTERNS.ON_BANISH,
        timing: "onBanish",
        conditionType: "onBanish",
      },
      {
        pattern: AbilityBuilder.PATTERNS.ON_CHALLENGE,
        timing: "onChallenge",
        conditionType: "onChallenge",
      },
      {
        pattern: AbilityBuilder.PATTERNS.AT_START,
        timing: "startOfTurn",
        conditionType: "activePlayerOnly",
      },
      {
        pattern: AbilityBuilder.PATTERNS.AT_END,
        timing: "endOfTurn",
        conditionType: "activePlayerOnly",
      },
    ];

    for (const { pattern, timing, conditionType } of patterns) {
      const match = text.match(pattern);
      if (match) {
        const effectText = match[1];
        const effects = AbilityBuilder.parseSimpleEffects(effectText);
        const isOptional = effectText.includes("may");

        return AbilityBuilder.triggered(text, timing)
          .setCondition({ type: conditionType as any })
          .setEffects(effects)
          .setOptional(isOptional);
      }
    }

    return null;
  }

  private static parseActivatedAbility(text: string): AbilityBuilder | null {
    // Exert abilities
    const exertMatch = text.match(AbilityBuilder.PATTERNS.EXERT_ABILITY);
    if (exertMatch) {
      const [, inkCost, effectText] = exertMatch;
      const cost: LorcanaAbilityCost = { exert: true };
      if (inkCost) {
        cost.ink = Number.parseInt(inkCost, 10);
      }

      const effects = AbilityBuilder.parseSimpleEffects(effectText);
      return AbilityBuilder.activated(text, cost).setEffects(effects);
    }

    // Ink-only abilities
    const inkMatch = text.match(AbilityBuilder.PATTERNS.INK_ABILITY);
    if (inkMatch) {
      const [, inkCost, , effectText] = inkMatch;
      const cost: LorcanaAbilityCost = { ink: Number.parseInt(inkCost, 10) };
      const effects = AbilityBuilder.parseSimpleEffects(effectText);
      return AbilityBuilder.activated(text, cost).setEffects(effects);
    }

    return null;
  }

  private static parseStaticAbility(text: string): AbilityBuilder | null {
    const whileMatch = text.match(AbilityBuilder.PATTERNS.WHILE_CONDITION);
    if (whileMatch) {
      const [, conditionText, effectText] = whileMatch;
      const condition = AbilityBuilder.parseSimpleCondition(conditionText);
      const effects = AbilityBuilder.parseSimpleEffects(effectText);

      return AbilityBuilder.static(text)
        .setCondition(condition)
        .setEffects(effects);
    }

    return null;
  }

  private static parseSimpleEffects(effectText: string): LorcanaEffect[] {
    const effects: LorcanaEffect[] = [];

    // Default targets
    const selfPlayerTarget: PlayerTarget = { type: "player", value: "self" };
    const chosenCharacterTarget: CardTarget = {
      type: "card",
      cardType: "character",
      count: 1,
    };

    // Gain lore
    const loreMatch = effectText.match(AbilityBuilder.PATTERNS.GAIN_LORE);
    if (loreMatch) {
      effects.push({
        type: "gainLore",
        parameters: {
          value: Number.parseInt(loreMatch[1], 10),
          target: selfPlayerTarget,
        },
        optional: false,
      });
    }

    // Draw cards
    const drawMatch = effectText.match(AbilityBuilder.PATTERNS.DRAW_CARDS);
    if (drawMatch) {
      const amount = drawMatch[1] ? Number.parseInt(drawMatch[1], 10) : 1;
      effects.push({
        type: "draw",
        parameters: {
          value: amount,
          target: selfPlayerTarget,
        },
        optional: false,
      });
    }

    // Deal damage
    const damageMatch = effectText.match(AbilityBuilder.PATTERNS.DEAL_DAMAGE);
    if (damageMatch) {
      effects.push({
        type: "dealDamage",
        parameters: {
          value: Number.parseInt(damageMatch[1], 10),
        },
        targets: [chosenCharacterTarget],
        optional: false,
      });
    }

    // Stat modifications
    const statMatch = effectText.match(AbilityBuilder.PATTERNS.BOOST_STAT);
    if (statMatch) {
      const [, valueStr, statLetter] = statMatch;
      const value = Number.parseInt(valueStr, 10);
      const statMap = { S: "strength", W: "willpower", L: "lore" } as const;
      const stat = statMap[statLetter as keyof typeof statMap];

      effects.push({
        type: "modifyStat",
        parameters: {
          attribute: stat,
          value,
        },
        targets: [chosenCharacterTarget],
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

  private static createGenericAbility(text: string): Ability {
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

    return AbilityBuilder.create()
      .setType(type)
      .setText(text)
      .addEffect({ type: "multiEffect", parameters: { effects: [] } })
      .build();
  }

  // === TEMPLATE METHODS ===

  /**
   * Template: "When you play this character, [effect]"
   */
  static onPlay(
    effectText: string,
    effects: LorcanaEffect[],
    name?: string,
  ): Ability {
    return AbilityBuilder.triggered(
      `When you play this character, ${effectText}`,
      "onPlay",
    )
      .setCondition({ type: "onEnterPlay" })
      .setEffects(effects)
      .setName(name || "")
      .build();
  }

  /**
   * Template: "Whenever this character quests, [effect]"
   */
  static onQuest(
    effectText: string,
    effects: LorcanaEffect[],
    name?: string,
  ): Ability {
    return AbilityBuilder.triggered(
      `Whenever this character quests, ${effectText}`,
      "onQuest",
    )
      .setCondition({ type: "onQuest" })
      .setEffects(effects)
      .setName(name || "")
      .build();
  }

  /**
   * Template: "{E} - [effect]"
   */
  static exertActivated(
    effectText: string,
    effects: LorcanaEffect[],
    inkCost = 0,
    name?: string,
  ): Ability {
    const cost: LorcanaAbilityCost = { exert: true };
    if (inkCost > 0) {
      cost.ink = inkCost;
    }

    const text = `{E}${inkCost > 0 ? `, ${inkCost} {I}` : ""} – ${effectText}`;
    return AbilityBuilder.activated(text, cost)
      .setEffects(effects)
      .setName(name || "")
      .build();
  }

  /**
   * Template: "While [condition], [effect]"
   */
  static whileCondition(
    conditionText: string,
    effectText: string,
    effects: LorcanaEffect[],
    condition: AbilityCondition,
    name?: string,
  ): Ability {
    return AbilityBuilder.static(`While ${conditionText}, ${effectText}`)
      .setCondition(condition)
      .setEffects(effects)
      .setName(name || "")
      .build();
  }

  /**
   * Template: "When this character is banished, [effect]"
   */
  static onBanish(
    effectText: string,
    effects: LorcanaEffect[],
    name?: string,
  ): Ability {
    return AbilityBuilder.triggered(
      `When this character is banished, ${effectText}`,
      "onBanish",
    )
      .setCondition({ type: "onBanish" })
      .setEffects(effects)
      .setName(name || "")
      .build();
  }

  /**
   * Template: Create a Shift ability
   */
  static shift(value: number, targetName: string): Ability {
    const text = `Shift ${value} (You may pay ${value} {I} to play this on top of one of your characters named ${targetName}.)`;

    return AbilityBuilder.keyword("shift", value, text).build();
  }
}
