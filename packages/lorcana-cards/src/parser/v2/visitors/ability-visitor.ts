/**
 * Visitor for transforming CST to AST.
 * Converts the Concrete Syntax Tree from Chevrotain into typed Ability objects.
 */

import type { CstNode, ICstVisitor, IToken } from "chevrotain";
import { logger } from "../logging";
import { BaseVisitor } from "./base-visitor";

/**
 * Placeholder types for abilities and effects.
 * These will be replaced with proper types from @tcg/lorcana in later phases.
 */
interface Ability {
  type: string;
  [key: string]: unknown;
}

interface Effect {
  type: string;
  [key: string]: unknown;
}

export class AbilityVisitor
  extends BaseVisitor
  implements ICstVisitor<unknown, unknown>
{
  constructor() {
    super();
    this.validateVisitor();
  }

  /**
   * Visit ability node - top level entry point
   */
  ability(ctx: {
    triggeredAbility?: CstNode[];
    otherAbility?: CstNode[];
  }): Ability {
    logger.debug("Visiting ability node", { ctx });

    if (ctx.triggeredAbility) {
      return this.visit(ctx.triggeredAbility);
    }
    if (ctx.otherAbility) {
      return this.visit(ctx.otherAbility);
    }

    throw new Error("Unknown ability type");
  }

  /**
   * Visit other ability (non-triggered) node
   */
  otherAbility(ctx: { effectPhrase?: CstNode[] }): Ability {
    logger.debug("Visiting other ability", { ctx });

    const effect = ctx.effectPhrase ? this.visit(ctx.effectPhrase) : null;

    // For now, treat as activated ability (placeholder)
    return {
      type: "activated",
      effect,
    };
  }

  /**
   * Visit triggered ability node
   */
  triggeredAbility(ctx: {
    triggerPhrase?: CstNode[];
    effectPhrase?: CstNode[];
  }): Ability {
    logger.debug("Visiting triggered ability", { ctx });

    const trigger = ctx.triggerPhrase ? this.visit(ctx.triggerPhrase) : null;
    const effect = ctx.effectPhrase ? this.visit(ctx.effectPhrase) : null;

    return {
      type: "triggered",
      trigger,
      effect,
    };
  }

  /**
   * Visit activated ability node (placeholder)
   */
  activatedAbility(ctx: { effectPhrase?: CstNode[] }): Ability {
    logger.debug("Visiting activated ability", { ctx });

    return {
      type: "activated",
    };
  }

  /**
   * Visit static ability node (placeholder)
   */
  staticAbility(ctx: { effectPhrase?: CstNode[] }): Ability {
    logger.debug("Visiting static ability", { ctx });

    return {
      type: "static",
    };
  }

  /**
   * Visit keyword ability node (placeholder)
   */
  keywordAbility(ctx: { effectPhrase?: CstNode[] }): Ability {
    logger.debug("Visiting keyword ability", { ctx });

    return {
      type: "keyword",
    };
  }

  /**
   * Visit trigger phrase node
   */
  triggerPhrase(ctx: { When?: IToken[]; Whenever?: IToken[] }): unknown {
    logger.debug("Visiting trigger phrase", { ctx });

    const triggerWord = ctx.When ? "when" : "whenever";

    return {
      triggerWord,
    };
  }

  /**
   * Visit trigger event node (placeholder)
   */
  triggerEvent(ctx: unknown): unknown {
    logger.debug("Visiting trigger event", { ctx });

    return {
      event: "placeholder",
    };
  }

  /**
   * Visit effect phrase node
   */
  effectPhrase(ctx: {
    compositeEffect?: CstNode[];
    atomicEffect?: CstNode[];
  }): Effect {
    logger.debug("Visiting effect phrase", { ctx });

    if (ctx.compositeEffect) {
      return this.visit(ctx.compositeEffect);
    }
    if (ctx.atomicEffect) {
      return this.visit(ctx.atomicEffect);
    }

    throw new Error("Unknown effect phrase type");
  }

  /**
   * Visit composite effect node
   */
  compositeEffect(ctx: { atomicEffect?: CstNode[] }): Effect {
    logger.debug("Visiting composite effect", { ctx });

    // Placeholder: will be expanded in later phases
    return {
      type: "composite",
    };
  }

  /**
   * Visit atomic effect node - delegates to specific effect visitors
   */
  atomicEffect(ctx: {
    drawEffect?: CstNode[];
    discardEffect?: CstNode[];
    damageEffect?: CstNode[];
    loreEffect?: CstNode[];
    exertEffect?: CstNode[];
    banishEffect?: CstNode[];
    statModEffect?: CstNode[];
    keywordEffect?: CstNode[];
  }): Effect {
    logger.debug("Visiting atomic effect", { ctx });

    // Try each effect type in order
    if (ctx.drawEffect) {
      return this.visit(ctx.drawEffect);
    }
    if (ctx.discardEffect) {
      return this.visit(ctx.discardEffect);
    }
    if (ctx.damageEffect) {
      return this.visit(ctx.damageEffect);
    }
    if (ctx.loreEffect) {
      return this.visit(ctx.loreEffect);
    }
    if (ctx.exertEffect) {
      return this.visit(ctx.exertEffect);
    }
    if (ctx.banishEffect) {
      return this.visit(ctx.banishEffect);
    }
    if (ctx.statModEffect) {
      return this.visit(ctx.statModEffect);
    }
    if (ctx.keywordEffect) {
      return this.visit(ctx.keywordEffect);
    }

    throw new Error("Unknown atomic effect type");
  }

  /**
   * Visit draw effect node
   * Parses "draw X card(s)" effects
   */
  drawEffect(ctx: { NumberToken?: IToken[] }): Effect {
    logger.debug("Visiting draw effect", { ctx });

    const amount = ctx.NumberToken?.[0]?.image
      ? Number.parseInt(ctx.NumberToken[0].image, 10)
      : 0;

    logger.info("Parsed draw effect from CST", { amount });

    return {
      type: "draw",
      amount,
    };
  }

  /**
   * Visit discard effect node
   * Parses "discard X card(s)" effects
   */
  discardEffect(ctx: { NumberToken?: IToken[] }): Effect {
    logger.debug("Visiting discard effect", { ctx });

    const amount = ctx.NumberToken?.[0]?.image
      ? Number.parseInt(ctx.NumberToken[0].image, 10)
      : 0;

    logger.info("Parsed discard effect from CST", { amount });

    return {
      type: "discard",
      amount,
    };
  }

  /**
   * Visit damage effect node
   * Parses "deal X damage" effects
   */
  damageEffect(ctx: { NumberToken?: IToken[] }): Effect {
    logger.debug("Visiting damage effect", { ctx });

    const amount = ctx.NumberToken?.[0]?.image
      ? Number.parseInt(ctx.NumberToken[0].image, 10)
      : 0;

    logger.info("Parsed damage effect from CST", { amount });

    return {
      type: "damage",
      amount,
    };
  }

  /**
   * Visit lore effect node
   * Parses "gain/lose X lore" effects
   */
  loreEffect(ctx: {
    NumberToken?: IToken[];
    Gain?: IToken[];
    Lose?: IToken[];
  }): Effect {
    logger.debug("Visiting lore effect", { ctx });

    const amount = ctx.NumberToken?.[0]?.image
      ? Number.parseInt(ctx.NumberToken[0].image, 10)
      : 0;
    const isGain = ctx.Gain !== undefined;

    logger.info("Parsed lore effect from CST", { amount, isGain });

    return {
      type: "lore",
      amount: isGain ? amount : -amount,
    };
  }

  /**
   * Visit exert effect node
   * Parses "exert/ready chosen character" effects
   */
  exertEffect(ctx: { Exert?: IToken[]; Ready?: IToken[] }): Effect {
    logger.debug("Visiting exert effect", { ctx });

    const isExert = ctx.Exert !== undefined;

    logger.info("Parsed exert effect from CST", { isExert });

    return {
      type: isExert ? "exert" : "ready",
    };
  }

  /**
   * Visit banish effect node
   * Parses "banish/return chosen character/item" effects
   */
  banishEffect(ctx: { Banish?: IToken[]; Return?: IToken[] }): Effect {
    logger.debug("Visiting banish effect", { ctx });

    const isBanish = ctx.Banish !== undefined;

    logger.info("Parsed banish effect from CST", { isBanish });

    return {
      type: isBanish ? "banish" : "return",
    };
  }

  /**
   * Visit stat modification effect node
   * Parses "gets +/-X strength/willpower/lore" effects
   */
  statModEffect(ctx: {
    NumberToken?: IToken[];
    Identifier?: IToken[];
    Strength?: IToken[];
    Willpower?: IToken[];
    Lore?: IToken[];
  }): Effect {
    logger.debug("Visiting stat modification effect", { ctx });

    const amount = ctx.NumberToken?.[0]?.image
      ? Number.parseInt(ctx.NumberToken[0].image, 10)
      : 0;

    // Determine which stat is being modified
    let stat = "strength";
    if (ctx.Willpower) {
      stat = "willpower";
    } else if (ctx.Lore) {
      stat = "lore";
    } else if (ctx.Strength) {
      stat = "strength";
    }

    logger.info("Parsed stat modification effect from CST", { amount, stat });

    return {
      type: "statModification",
      amount,
      stat,
    };
  }

  /**
   * Visit keyword effect node
   * Parses "gains/gets Evasive/Rush/etc" effects
   */
  keywordEffect(ctx: { Identifier?: IToken[] }): Effect {
    logger.debug("Visiting keyword effect", { ctx });

    // First identifier is "gains" or "gets", second is the keyword
    const keyword = ctx.Identifier?.[1]?.image || "unknown";

    logger.info("Parsed keyword effect from CST", { keyword });

    return {
      type: "keyword",
      keyword,
    };
  }
}
