import type {
  LorcanaCardFilter,
  LorcanaZone,
} from "../../lorcana-engine-types";
import type {
  AbilityTarget,
  Effect,
  EffectParameters,
  EffectType,
  Keyword,
} from "../ability-types";

/**
 * Effect Factory - Template-based approach for creating common effects
 * Pre-defines templates for frequent patterns in Lorcana card text
 */
export class EffectFactory {
  /**
   * Create a damage dealing effect
   */
  static dealDamage(
    amount: number,
    target?: AbilityTarget,
    optional = false,
  ): Effect {
    return {
      type: "dealDamage",
      parameters: {
        amount,
        target,
      },
      optional,
    };
  }

  /**
   * Create a card draw effect
   */
  static draw(
    amount: number,
    target?: AbilityTarget,
    optional = false,
  ): Effect {
    return {
      type: "draw",
      parameters: {
        amount,
        target,
      },
      optional,
    };
  }

  /**
   * Create a lore gain effect
   */
  static gainLore(amount: number, optional = false): Effect {
    return {
      type: "gainLore",
      parameters: {
        amount,
      },
      optional,
    };
  }

  /**
   * Create a stat modification effect
   */
  static modifyStat(
    stat: "strength" | "willpower" | "lore",
    value: number,
    target?: AbilityTarget,
    duration?: Effect["duration"],
    optional = false,
  ): Effect {
    return {
      type: "modifyStat",
      parameters: {
        stat,
        value,
        target,
      },
      duration,
      optional,
    };
  }

  /**
   * Create a keyword granting effect
   */
  static addKeyword(
    keyword: Keyword,
    keywordValue?: number,
    target?: AbilityTarget,
    duration?: Effect["duration"],
    optional = false,
  ): Effect {
    return {
      type: "addKeyword",
      parameters: {
        keyword,
        keywordValue,
        target,
      },
      duration,
      optional,
    };
  }

  /**
   * Create a banish effect
   */
  static banish(target?: AbilityTarget, optional = false): Effect {
    return {
      type: "banish",
      parameters: {
        target,
      },
      optional,
    };
  }

  /**
   * Create an exert effect
   */
  static exert(target?: AbilityTarget, optional = false): Effect {
    return {
      type: "exert",
      parameters: {
        target,
      },
      optional,
    };
  }

  /**
   * Create a ready effect
   */
  static ready(target?: AbilityTarget, optional = false): Effect {
    return {
      type: "ready",
      parameters: {
        target,
      },
      optional,
    };
  }

  /**
   * Create a damage removal effect
   */
  static removeDamage(
    amount: number,
    target?: AbilityTarget,
    optional = false,
  ): Effect {
    return {
      type: "removeDamage",
      parameters: {
        amount,
        target,
      },
      optional,
    };
  }

  /**
   * Create a search effect
   */
  static search(
    zoneTo: LorcanaZone,
    zoneFrom: LorcanaZone,
    filter?: LorcanaCardFilter,
    amount = 1,
    optional = false,
  ): Effect {
    return {
      type: "search",
      parameters: {
        zoneTo,
        zoneFrom,
        cardType: filter?.cardType,
        amount,
      },
      optional,
    };
  }

  /**
   * Create a move to zone effect (return to hand, etc.)
   */
  static moveToZone(
    zoneTo: LorcanaZone,
    target?: AbilityTarget,
    optional = false,
  ): Effect {
    return {
      type: "moveToZone",
      parameters: {
        zoneTo,
        target,
      },
      optional,
    };
  }

  /**
   * Create a discard effect
   */
  static discard(
    amount: number,
    target?: AbilityTarget,
    optional = false,
  ): Effect {
    return {
      type: "discard",
      parameters: {
        amount,
        target,
      },
      optional,
    };
  }

  /**
   * Create an if-then-else conditional effect
   */
  static conditional(
    conditionType: string,
    trueEffect: Effect,
    falseEffect?: Effect,
  ): Effect {
    return {
      type: "ifThenElse",
      parameters: {
        condition: { type: conditionType } as any,
        effects: falseEffect ? [trueEffect, falseEffect] : [trueEffect],
      },
    };
  }

  /**
   * Create a choice effect (choose one of multiple options)
   */
  static chooseOne(effects: Effect[]): Effect {
    return {
      type: "chooseOne",
      parameters: {
        effects,
      },
    };
  }

  /**
   * Create a multi-effect container
   */
  static multiEffect(effects: Effect[]): Effect {
    return {
      type: "multiEffect",
      parameters: {
        effects,
      },
    };
  }

  /**
   * Template: "When you play this character, gain X lore"
   */
  static templateOnPlayGainLore(amount: number): Effect {
    return EffectFactory.gainLore(amount);
  }

  /**
   * Template: "Deal X damage to chosen character"
   */
  static templateDealDamageToChosen(amount: number): Effect {
    return EffectFactory.dealDamage(amount, {
      type: "card",
      zone: "play",
      filter: { cardType: "character" },
    });
  }

  /**
   * Template: "Draw a card"
   */
  static templateDrawCard(): Effect {
    return EffectFactory.draw(1);
  }

  /**
   * Template: "Chosen character gets +X {S} this turn"
   */
  static templateBoostStrengthThisTurn(amount: number): Effect {
    return EffectFactory.modifyStat(
      "strength",
      amount,
      {
        type: "card",
        zone: "play",
        filter: { cardType: "character" },
      },
      { type: "endOfTurn" },
    );
  }

  /**
   * Template: "Chosen character gains [Keyword] until start of next turn"
   */
  static templateGrantKeywordUntilNextTurn(
    keyword: Keyword,
    keywordValue?: number,
  ): Effect {
    return EffectFactory.addKeyword(
      keyword,
      keywordValue,
      {
        type: "card",
        zone: "play",
        filter: { cardType: "character" },
      },
      { type: "turns", count: 1 },
    );
  }

  /**
   * Template: "Remove up to X damage from chosen character"
   */
  static templateRemoveDamageFromChosen(amount: number): Effect {
    return EffectFactory.removeDamage(amount, {
      type: "card",
      zone: "play",
      filter: { cardType: "character" },
    });
  }

  /**
   * Template: "Return chosen character to their player's hand"
   */
  static templateReturnToHand(): Effect {
    return EffectFactory.moveToZone("hand", {
      type: "card",
      zone: "play",
      filter: { cardType: "character" },
    });
  }

  /**
   * Template: "Each opponent loses X lore"
   */
  static templateOpponentsLoseLore(amount: number): Effect {
    return {
      type: "loseLore",
      parameters: {
        amount,
        target: {
          type: "player",
          value: "opponent",
        },
      },
    };
  }

  /**
   * Create effects from a template pattern string
   * This method maps common card text patterns to effect templates
   */
  static fromPattern(pattern: string, ...args: any[]): Effect | null {
    const templates: Record<string, (...args: any[]) => Effect> = {
      gain_lore: (amount: number) =>
        EffectFactory.templateOnPlayGainLore(amount),
      deal_damage: (amount: number) =>
        EffectFactory.templateDealDamageToChosen(amount),
      draw_card: () => EffectFactory.templateDrawCard(),
      boost_strength: (amount: number) =>
        EffectFactory.templateBoostStrengthThisTurn(amount),
      grant_keyword: (keyword: Keyword, value?: number) =>
        EffectFactory.templateGrantKeywordUntilNextTurn(keyword, value),
      remove_damage: (amount: number) =>
        EffectFactory.templateRemoveDamageFromChosen(amount),
      return_to_hand: () => EffectFactory.templateReturnToHand(),
      opponents_lose_lore: (amount: number) =>
        EffectFactory.templateOpponentsLoseLore(amount),
    };

    const template = templates[pattern];
    return template ? template(...args) : null;
  }

  /**
   * Batch create effects from multiple patterns
   */
  static fromPatterns(
    patterns: Array<{ pattern: string; args: any[] }>,
  ): Effect[] {
    return patterns
      .map(({ pattern, args }) => EffectFactory.fromPattern(pattern, ...args))
      .filter((effect): effect is Effect => effect !== null);
  }
}
