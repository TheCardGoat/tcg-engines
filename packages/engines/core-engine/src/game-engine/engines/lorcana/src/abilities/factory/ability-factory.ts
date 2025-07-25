import { v4 as uuid } from "uuid";
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
import { EffectFactory } from "./effect-factory";

/**
 * Ability Factory - Template-based approach for creating complete abilities
 * Combines effects into structured abilities with proper timing and costs
 */
export class AbilityFactory {
  /**
   * Create a triggered ability
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
   * Create an activated ability
   */
  static activated(
    text: string,
    cost: AbilityCost,
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
   * Create a static ability
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
   * Create a keyword ability
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

  // === COMMON ABILITY TEMPLATES ===

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
    const cost: AbilityCost = { exert: true };
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
    cost?: AbilityCost;
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

  /**
   * Create abilities from pattern strings - useful for mass creation
   */
  static fromPattern(
    pattern: string,
    text: string,
    ...args: any[]
  ): Ability | null {
    const patterns: Record<string, (text: string, ...args: any[]) => Ability> =
      {
        on_play: (text: string, effects: Effect[], name?: string) =>
          AbilityFactory.templateOnPlay(text, effects, name),
        on_quest: (text: string, effects: Effect[], name?: string) =>
          AbilityFactory.templateOnQuest(text, effects, name),
        exert_activated: (
          text: string,
          effects: Effect[],
          inkCost = 0,
          name?: string,
        ) =>
          AbilityFactory.templateExertActivated(text, effects, inkCost, name),
        while_condition: (
          text: string,
          effects: Effect[],
          condition: AbilityCondition,
          name?: string,
        ) =>
          AbilityFactory.templateWhileCondition(
            "condition",
            text,
            effects,
            condition,
            name,
          ),
        on_banish: (text: string, effects: Effect[], name?: string) =>
          AbilityFactory.templateOnBanish(text, effects, name),
        keyword: (text: string, keyword: Keyword, value?: number) =>
          AbilityFactory.keyword(keyword, value, text),
        shift: (text: string, cost: number, targetName?: string) =>
          AbilityFactory.templateShift(cost, targetName),
      };

    const template = patterns[pattern];
    return template ? template(text, ...args) : null;
  }

  /**
   * Batch create abilities from multiple patterns
   */
  static fromPatterns(
    patterns: Array<{
      pattern: string;
      text: string;
      args: any[];
    }>,
  ): Ability[] {
    return patterns
      .map(({ pattern, text, args }) =>
        AbilityFactory.fromPattern(pattern, text, ...args),
      )
      .filter((ability): ability is Ability => ability !== null);
  }

  // === COMMON CARD TEXT PATTERNS ===

  /**
   * Parse common card text patterns into abilities
   * This is a simplified parser for demonstration
   */
  static parseCardText(cardText: string): Ability[] {
    const abilities: Ability[] = [];
    const text = cardText.trim();

    // Handle keywords first
    if (text.match(/^(Bodyguard|Evasive|Rush|Ward|Vanish)$/)) {
      abilities.push(AbilityFactory.keyword(text as Keyword));
    }

    // Handle keyword with values
    const keywordWithValue = text.match(
      /^(Challenger|Resist|Singer|Shift)\s+\+?(\d+)$/,
    );
    if (keywordWithValue) {
      const [, keyword, value] = keywordWithValue;
      abilities.push(
        AbilityFactory.keyword(keyword as Keyword, Number.parseInt(value, 10)),
      );
    }

    // Handle "When you play this character" patterns
    const onPlayMatch = text.match(/^When you play this character,(.+)$/);
    if (onPlayMatch) {
      const effectText = onPlayMatch[1].trim();
      const effects = AbilityFactory.parseEffectText(effectText);
      abilities.push(AbilityFactory.templateOnPlay(effectText, effects));
    }

    // Handle "Whenever this character quests" patterns
    const onQuestMatch = text.match(/^Whenever this character quests,(.+)$/);
    if (onQuestMatch) {
      const effectText = onQuestMatch[1].trim();
      const effects = AbilityFactory.parseEffectText(effectText);
      abilities.push(AbilityFactory.templateOnQuest(effectText, effects));
    }

    // Handle activated abilities
    const activatedMatch = text.match(
      /^\{E\}(?:,\s*(\d+)\s*\{I\})?\s*[-–—]\s*(.+)$/,
    );
    if (activatedMatch) {
      const [, inkCost, effectText] = activatedMatch;
      const effects = AbilityFactory.parseEffectText(effectText);
      abilities.push(
        AbilityFactory.templateExertActivated(
          effectText,
          effects,
          inkCost ? Number.parseInt(inkCost, 10) : 0,
        ),
      );
    }

    // Handle "While" static abilities
    const whileMatch = text.match(/^While (.+?),(.+)$/);
    if (whileMatch) {
      const [, conditionText, effectText] = whileMatch;
      const effects = AbilityFactory.parseEffectText(effectText.trim());
      const condition = AbilityFactory.parseConditionText(conditionText.trim());
      abilities.push(
        AbilityFactory.templateWhileCondition(
          conditionText,
          effectText.trim(),
          effects,
          condition,
        ),
      );
    }

    return abilities;
  }

  /**
   * Parse effect text into Effect objects
   * This is a simplified parser - in practice you'd want more sophisticated parsing
   */
  private static parseEffectText(effectText: string): Effect[] {
    const effects: Effect[] = [];

    // Simple patterns
    if (effectText.includes("gain") && effectText.includes("lore")) {
      const match = effectText.match(/gain (\d+) lore/);
      if (match) {
        effects.push(EffectFactory.gainLore(Number.parseInt(match[1], 10)));
      }
    }

    if (effectText.includes("draw") && effectText.includes("card")) {
      const match = effectText.match(/draw (?:(\d+) )?cards?/);
      const amount = match?.[1] ? Number.parseInt(match[1], 10) : 1;
      effects.push(EffectFactory.draw(amount));
    }

    if (effectText.includes("deal") && effectText.includes("damage")) {
      const match = effectText.match(/deal (\d+) damage/);
      if (match) {
        effects.push(EffectFactory.dealDamage(Number.parseInt(match[1], 10)));
      }
    }

    // Default to a multi-effect if we couldn't parse specifics
    if (effects.length === 0) {
      effects.push({
        type: "multiEffect",
        parameters: { effects: [] },
      });
    }

    return effects;
  }

  /**
   * Parse condition text into AbilityCondition
   */
  private static parseConditionText(conditionText: string): AbilityCondition {
    // Simple condition parsing
    if (
      conditionText.includes("you have") &&
      conditionText.includes("in play")
    ) {
      return { type: "cardInPlay" };
    }
    if (conditionText.includes("this character has no damage")) {
      return { type: "noDamage" };
    }
    if (conditionText.includes("this character has damage")) {
      return { type: "hasDamage" };
    }

    // Default condition
    return { type: "activePlayerOnly" };
  }

  /**
   * Mass create abilities from an array of card texts
   */
  static parseMultipleCardTexts(cardTexts: string[]): Ability[] {
    return cardTexts.flatMap((text) => AbilityFactory.parseCardText(text));
  }
}
