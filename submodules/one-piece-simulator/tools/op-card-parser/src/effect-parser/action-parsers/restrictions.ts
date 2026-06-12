import type { Action, Duration, EffectTrigger, Target, TargetFilter, Zone } from "@tcg/op-types";
import { parseTarget, parseTargetWithoutPlayer, parseModifyPowerTarget } from "../target-parser.ts";
import { parseComparison } from "../helpers.ts";
import { parseFullDuration } from "./helpers.ts";
import { KEYWORD_BRACKET_TO_TYPE } from "../constants.ts";

// ── CanAttackActive action parsing ──

type CanAttackActiveAction = Extract<Action, { action: "canAttackActive" }>;

/**
 * Parse "This Character can also attack your opponent's active Characters".
 */
export function parseCanAttackActiveAction(text: string): CanAttackActiveAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "This Character/Leader can also attack (your opponent's )?active Characters (during this turn)?"
  const selfMatch =
    /^This\s+(?:Character|Leader)\s+can\s+also\s+attack\s+(?:your\s+opponent's\s+)?active\s+Characters(?:\s+during\s+this\s+(turn|battle))?$/i.exec(
      trimmed,
    );
  if (selfMatch) {
    const zone = /^This Leader/i.test(trimmed) ? "leader" : "character";
    const duration = selfMatch[1]
      ? selfMatch[1].toLowerCase() === "battle"
        ? "thisBattle"
        : "thisTurn"
      : "permanent";
    return {
      action: "canAttackActive",
      target: { player: "self", zones: [zone as Zone], count: { amount: 1 }, self: true },
      duration,
    };
  }

  // "Up to 1 of your {Trait} type Leader or Character cards can also attack active Characters during this turn"
  const targetMatch =
    /^(.+?)\s+can\s+also\s+attack\s+(?:your\s+opponent's\s+)?active\s+Characters\s+during\s+this\s+(turn|battle)$/i.exec(
      trimmed,
    );
  if (targetMatch) {
    const target = parseTarget(targetMatch[1]!) ?? parseModifyPowerTarget(targetMatch[1]!);
    if (!target) return null;
    return {
      action: "canAttackActive",
      target,
      duration: targetMatch[2]!.toLowerCase() === "battle" ? "thisBattle" : "thisTurn",
    };
  }

  return null;
}

// ── CannotActivate action parsing ──

type CannotActivateAction = Extract<Action, { action: "cannotActivate" }>;

/**
 * Parse "Your opponent cannot activate [Blocker] during this battle/turn" variants.
 */
export function parseCannotActivateAction(text: string): CannotActivateAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "Your opponent cannot activate [Keyword] during this battle/turn"
  const match = /^Your opponent cannot activate \[([^\]]+)\] during this (battle|turn)$/i.exec(
    trimmed,
  );
  if (match) {
    const keyword = KEYWORD_BRACKET_TO_TYPE[match[1]!.toLowerCase()];
    if (!keyword) return null;
    return {
      action: "cannotActivate",
      target: { player: "opponent", zones: ["character"], count: { amount: "all" } },
      keyword,
      duration: match[2]!.toLowerCase() === "battle" ? "thisBattle" : "thisTurn",
    };
  }

  // "your opponent cannot activate [Keyword] whenever your Leader attacks during this turn"
  const wheneverMatch =
    /^your opponent cannot activate \[([^\]]+)\] whenever your Leader attacks during this (turn|battle)$/i.exec(
      trimmed,
    );
  if (wheneverMatch) {
    const keyword = KEYWORD_BRACKET_TO_TYPE[wheneverMatch[1]!.toLowerCase()];
    if (!keyword) return null;
    return {
      action: "cannotActivate",
      target: { player: "opponent", zones: ["character"], count: { amount: "all" } },
      keyword,
      duration: wheneverMatch[2]!.toLowerCase() === "battle" ? "thisBattle" : "thisTurn",
    };
  }

  // "your opponent cannot activate the [Keyword] of any Character with a cost of N or less during this battle"
  const detailedMatch =
    /^your opponent cannot activate the \[([^\]]+)\] of any Character with a cost of (\d+) or (less|more) during this (battle|turn)$/i.exec(
      trimmed,
    );
  if (detailedMatch) {
    const keyword = KEYWORD_BRACKET_TO_TYPE[detailedMatch[1]!.toLowerCase()];
    if (!keyword) return null;
    return {
      action: "cannotActivate",
      target: {
        player: "opponent",
        zones: ["character"],
        count: { amount: "all" },
        filters: [
          {
            filter: "cost",
            comparison: parseComparison(detailedMatch[3]),
            value: parseInt(detailedMatch[2]!, 10),
          },
        ],
      },
      keyword,
      duration: detailedMatch[4]!.toLowerCase() === "battle" ? "thisBattle" : "thisTurn",
    };
  }

  // "Your opponent cannot activate up to 1 [Keyword] Character that has N power or less during this turn"
  const upToMatch =
    /^Your opponent cannot activate up to (\d+) \[([^\]]+)\] Character that has (\d+) power or (less|more) during this (battle|turn)$/i.exec(
      trimmed,
    );
  if (upToMatch) {
    const keyword = KEYWORD_BRACKET_TO_TYPE[upToMatch[2]!.toLowerCase()];
    if (!keyword) return null;
    return {
      action: "cannotActivate",
      target: {
        player: "opponent",
        zones: ["character"],
        count: { amount: parseInt(upToMatch[1]!, 10), upTo: true },
        filters: [
          {
            filter: "power",
            comparison: parseComparison(upToMatch[4]),
            value: parseInt(upToMatch[3]!, 10),
          },
        ],
      },
      keyword,
      duration: upToMatch[5]!.toLowerCase() === "battle" ? "thisBattle" : "thisTurn",
    };
  }

  // "Your opponent cannot activate a [Keyword] Character that has N or less power during this battle"
  const powerMatch =
    /^Your opponent cannot activate a \[([^\]]+)\] Character that has (\d+) or (less|more) power during this (battle|turn)$/i.exec(
      trimmed,
    );
  if (powerMatch) {
    const keyword = KEYWORD_BRACKET_TO_TYPE[powerMatch[1]!.toLowerCase()];
    if (!keyword) return null;
    return {
      action: "cannotActivate",
      target: {
        player: "opponent",
        zones: ["character"],
        count: { amount: "all" },
        filters: [
          {
            filter: "power",
            comparison: parseComparison(powerMatch[3]),
            value: parseInt(powerMatch[2]!, 10),
          },
        ],
      },
      keyword,
      duration: powerMatch[4]!.toLowerCase() === "battle" ? "thisBattle" : "thisTurn",
    };
  }

  // "<target> cannot activate [Keyword] during this turn"
  // Handles: "All of your opponent's Characters with 2000 power or less cannot activate [Blocker] during this turn"
  // Handles: "Up to 1 of your opponent's Characters with a base cost of 4 or less cannot activate [Blocker] during this turn"
  const targetCannotMatch =
    /^(.+?)\s+cannot\s+activate\s+\[([^\]]+)\]\s+during\s+this\s+(battle|turn)$/i.exec(trimmed);
  if (targetCannotMatch) {
    const keyword = KEYWORD_BRACKET_TO_TYPE[targetCannotMatch[2]!.toLowerCase()];
    if (!keyword) return null;
    const target =
      parseModifyPowerTarget(targetCannotMatch[1]!) ?? parseTarget(targetCannotMatch[1]!);
    if (target) {
      return {
        action: "cannotActivate",
        target,
        keyword,
        duration: targetCannotMatch[3]!.toLowerCase() === "battle" ? "thisBattle" : "thisTurn",
      };
    }
  }

  return null;
}

// ── CannotBeKod action parsing ──

type CannotBeKodAction = Extract<Action, { action: "cannotBeKod" }>;

/**
 * Parse "This Character cannot be K.O.'d in battle/by effects" action clause.
 *
 * Also handles the split-off form "cannot be K.O.'d ..." (without subject prefix).
 */
export function parseCannotBeKodAction(text: string): CannotBeKodAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // Match with or without "This Character/Leader" prefix
  const match =
    /^(?:(?:This|this)\s+(Character|Leader)\s+)?cannot\s+be\s+K\.O\.\u2019?'?d\s+(?:(in\s+battle|by\s+(?:your\s+opponent[''\u2019]s\s+)?effects?))\s*(?:by\s+(?:[""\u201c]([^""\u201d]+)[""\u201d]\s+|\(([^)]+)\)\s+)?attribute\s+(?:cards|Characters?))?(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  if (match) {
    const zone: Zone = match[1]?.toLowerCase() === "leader" ? "leader" : "character";
    const restrictionText = match[2]!.toLowerCase();
    const restriction: "inBattle" | "byEffect" = restrictionText.startsWith("in")
      ? "inBattle"
      : "byEffect";
    const attributeText = match[3] ?? match[4];
    const duration = match[5] ? parseFullDuration(match[5]) : "permanent";

    const byFilter: TargetFilter[] | undefined = attributeText
      ? [{ filter: "attribute" as const, value: attributeText.toLowerCase() as any }]
      : undefined;

    return {
      action: "cannotBeKod",
      target: { player: "self", zones: [zone], count: { amount: 1 }, self: true },
      duration,
      restriction,
      ...(byFilter && { byFilter }),
    };
  }

  // "cannot be K.O.'d by effects of Characters without the (Attribute) attribute"
  const byEffectsOfMatch =
    /^(?:(?:This|this)\s+(Character|Leader)\s+)?cannot\s+be\s+K\.O\.\u2019?'?d\s+by\s+effects\s+of\s+Characters\s+without\s+the\s+(?:\(([^)]+)\)|[""\u201c]([^""\u201d]+)[""\u201d])\s+attribute$/i.exec(
      trimmed,
    );
  if (byEffectsOfMatch) {
    const zone: Zone = byEffectsOfMatch[1]?.toLowerCase() === "leader" ? "leader" : "character";
    const attr = (byEffectsOfMatch[2] ?? byEffectsOfMatch[3])!.toLowerCase();
    return {
      action: "cannotBeKod",
      target: { player: "self", zones: [zone], count: { amount: 1 }, self: true },
      duration: "permanent",
      restriction: "byEffect",
      byFilter: [{ filter: "attribute", value: attr as any }],
    };
  }

  // "None of your Characters can be K.O.'d by opponent's effects until..."
  const noneMatch =
    /^none\s+of\s+your\s+Characters\s+can\s+be\s+K\.O\.\u2019?'?d\s+(?:(in\s+battle|by\s+(?:your\s+opponent[''\u2019]s\s+)?effects?))(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  if (noneMatch) {
    const restrictionText = noneMatch[1]!.toLowerCase();
    const restriction: "inBattle" | "byEffect" = restrictionText.startsWith("in")
      ? "inBattle"
      : "byEffect";
    const duration = noneMatch[2] ? parseFullDuration(noneMatch[2]) : "permanent";
    return {
      action: "cannotBeKod",
      target: { player: "self", zones: ["character"], count: { amount: "all" } },
      duration,
      restriction,
    };
  }

  // Non-self target: "(all of) your (active) Characters (with filters) cannot be K.O.'d (by effects) (during ...)"
  const nonSelfMatch =
    /^(?:all\s+(?:of\s+)?)?your\s+(.+?)\s+cannot\s+be\s+K\.O\.\u2019?'?d\s+(?:(in\s+battle|by\s+(?:your\s+opponent[''\u2019]s\s+)?effects?))(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  if (nonSelfMatch) {
    const restrictionText = nonSelfMatch[2]!.toLowerCase();
    const restriction: "inBattle" | "byEffect" = restrictionText.startsWith("in")
      ? "inBattle"
      : "byEffect";
    const duration = nonSelfMatch[3] ? parseFullDuration(nonSelfMatch[3]) : "permanent";

    // Parse the target description (e.g., "active Characters with a base cost of 5")
    const targetText = nonSelfMatch[1]!;
    const target =
      parseModifyPowerTarget("your " + targetText) ?? parseTarget("1 of your " + targetText);
    if (!target) return null;
    // Adjust to "all" since this applies broadly
    target.count = { amount: "all" };

    return {
      action: "cannotBeKod",
      target,
      duration,
      restriction,
    };
  }

  return null;
}

// ── CannotBeRested action parsing ──

type CannotBeRestedAction = Extract<Action, { action: "cannotBeRested" }>;

export function parseCannotBeRestedAction(text: string): CannotBeRestedAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "Up to N of your opponent's Characters with a cost of X or less cannot be rested until the end of your opponent's next End Phase"
  const match =
    /^(Up\s+to\s+(\d+)\s+of\s+your\s+opponent's\s+Characters?\s*(?:with\s+(.+?))?)\s+cannot\s+be\s+rested\s+until\s+the\s+end\s+of\s+your\s+opponent's\s+next\s+(?:End\s+Phase|turn)$/i.exec(
      trimmed,
    );
  if (match) {
    const amount = parseInt(match[2]!, 10);
    const filters: TargetFilter[] = [];
    if (match[3]) {
      const costFilter = /a\s+cost\s+of\s+(\d+)\s+or\s+(less|more)/i.exec(match[3]);
      if (costFilter) {
        filters.push({
          filter: "cost",
          comparison: parseComparison(costFilter[2]),
          value: parseInt(costFilter[1]!, 10),
        });
      }
    }
    return {
      action: "cannotBeRested" as const,
      target: {
        player: "opponent" as const,
        zones: ["character" as const],
        count: { amount, upTo: true },
        filters: filters.length > 0 ? filters : undefined,
      },
      duration: "untilEndOfOpponentNextTurn" as Duration,
    };
  }

  return null;
}

// ── PlayRestriction action parsing ──

type PlayRestrictionAction = Extract<Action, { action: "playRestriction" }>;

/**
 * Parse "you cannot play Character cards (with filters) during this turn" action clause.
 */
export function parsePlayRestrictionAction(text: string): PlayRestrictionAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "you cannot play [any] [Character/character] cards [with a base cost of N or more] [from your hand] [on your field] during this turn"
  const match = /^you\s+cannot\s+play\s+(?:any\s+)?(.+?)\s+during\s+this\s+(turn|battle)$/i.exec(
    trimmed,
  );
  if (!match) return null;

  const filterText = match[1]!;
  const duration =
    match[2]!.toLowerCase() === "turn" ? ("thisTurn" as Duration) : ("thisBattle" as Duration);
  const filters: TargetFilter[] = [];

  // "Character cards with a base cost of N or more/less"
  const baseCostMatch =
    /Character\s+cards?\s+with\s+a\s+base\s+cost\s+of\s+(\d+)\s+or\s+(more|less)/i.exec(filterText);
  if (baseCostMatch) {
    filters.push({ filter: "cardCategory", value: "character" });
    filters.push({
      filter: "baseCost",
      comparison: parseComparison(baseCostMatch[2]),
      value: parseInt(baseCostMatch[1]!, 10),
    });
    return { action: "playRestriction", restriction: "cannotPlay", filters, duration };
  }

  // "Character cards" (no additional filters) — covers "Character cards", "character cards", "any Character cards on your field"
  if (/Character\s+cards?/i.test(filterText)) {
    filters.push({ filter: "cardCategory", value: "character" });
    return { action: "playRestriction", restriction: "cannotPlay", filters, duration };
  }

  // "cards from your hand" (all card types)
  if (/cards?\s+from\s+your\s+hand/i.test(filterText)) {
    return { action: "playRestriction", restriction: "cannotPlay", filters: [], duration };
  }

  return null;
}

// ── NegateEffects action parsing ──

type NegateEffectsAction = Extract<Action, { action: "negateEffects" }>;

/**
 * Parse "negate the effect of <target> (during this turn)"
 */
export function parseNegateEffectsAction(text: string): NegateEffectsAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "This Character's effect is negated during this turn"
  const selfNegateMatch =
    /^This\s+(?:Character|Leader)[''\u2019]s\s+effects?\s+(?:is|are)\s+negated(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  if (selfNegateMatch) {
    const duration = selfNegateMatch[1] ? parseFullDuration(selfNegateMatch[1]) : "thisTurn";
    return {
      action: "negateEffects",
      target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
      duration,
    };
  }

  // "Your opponent's [X] effects are negated (until ...)"
  const oppEffectsMatch =
    /^your\s+opponent's\s+\[([^\]]+)\]\s+effects?\s+(?:is|are)\s+negated(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  if (oppEffectsMatch) {
    const triggerText = oppEffectsMatch[1]!.toLowerCase().replace(/\s+/g, "");
    const triggerMap: Record<string, EffectTrigger> = {
      onplay: "onPlay",
      whenattacking: "whenAttacking",
      onblock: "onBlock",
      "onk.o.": "onKo",
      trigger: "trigger",
    };
    const effectType = triggerMap[triggerText];
    const duration = oppEffectsMatch[2] ? parseFullDuration(oppEffectsMatch[2]) : "thisTurn";
    return {
      action: "negateEffects",
      target: { player: "opponent", zones: ["leader", "character"], count: { amount: "all" } },
      duration,
      ...(effectType && { effectTypes: [effectType] }),
    };
  }

  const match =
    /^negate\s+the\s+effects?\s+of\s+(.+?)(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  if (!match) return null;

  const target =
    parseTarget(match[1]!) ??
    parseTargetWithoutPlayer(match[1]!) ??
    parseModifyPowerTarget(match[1]!);
  if (!target) return null;

  const duration = match[2] ? parseFullDuration(match[2]) : "thisTurn";

  return { action: "negateEffects", target, duration };
}

// ── CannotAttack action parsing ──

type CannotAttackAction = Extract<Action, { action: "cannotAttack" }>;

/**
 * Parse "<target> cannot attack (until ...)"
 */
export function parseCannotAttackAction(text: string): CannotAttackAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "X cannot attack your opponent's Characters with <filters> during this turn" — simplified to cannotAttack on self
  const restrictedTargetMatch =
    /^(.+?)\s+cannot\s+attack\s+your\s+opponent[''\u2019]s\s+Characters?\s+(?:with\s+.+?\s+)?(during\s+this\s+(?:turn|battle)|until\s+.+)$/i.exec(
      trimmed,
    );
  if (restrictedTargetMatch) {
    const subjectTarget =
      parseTarget(restrictedTargetMatch[1]!) ?? parseModifyPowerTarget(restrictedTargetMatch[1]!);
    if (subjectTarget) {
      const duration = parseFullDuration(restrictedTargetMatch[2]!);
      return { action: "cannotAttack", target: subjectTarget, duration };
    }
  }

  const match =
    /^(.+?)\s+cannot\s+attack(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(trimmed);
  if (!match) return null;

  // Handle compound "X or Y cannot attack" targets
  const orMatch = /^(.+?)\s+or\s+(up\s+to\s+\d+\s+.+)$/i.exec(match[1]!);
  if (orMatch) {
    const target1 = parseTarget(orMatch[1]!) ?? parseModifyPowerTarget(orMatch[1]!);
    const target2 = parseTarget(orMatch[2]!);
    if (target1 && target2) {
      const duration = match[2] ? parseFullDuration(match[2]) : "thisTurn";
      // Merge into a single target with combined zones
      return {
        action: "cannotAttack",
        target: {
          player: target1.player,
          zones: [...new Set([...target1.zones, ...target2.zones])],
          count: { amount: "all" },
          ...(target2.filters && { filters: target2.filters }),
        },
        duration,
      };
    }
  }

  // "Your opponent's rested Leader or up to N of your opponent's Characters other than [Name] cannot attack"
  const restedLeaderOrMatch =
    /^Your\s+opponent[''\u2019]s\s+rested\s+Leader\s+or\s+(up\s+to\s+\d+\s+.+)$/i.exec(match[1]!);
  if (restedLeaderOrMatch) {
    const target2 = parseTarget(restedLeaderOrMatch[1]!);
    if (target2) {
      const duration = match[2] ? parseFullDuration(match[2]) : "thisTurn";
      return {
        action: "cannotAttack",
        target: {
          player: "opponent",
          zones: ["leader", ...target2.zones],
          count: { amount: "all" },
          filters: [...(target2.filters ?? []), { filter: "state", value: "rested" as const }],
        },
        duration,
      };
    }
  }

  const target =
    parseTarget(match[1]!) ??
    parseTargetWithoutPlayer(match[1]!) ??
    parseModifyPowerTarget(match[1]!);
  if (!target) return null;

  const duration = match[2] ? parseFullDuration(match[2]) : "thisTurn";

  return { action: "cannotAttack", target, duration };
}

// ── CannotBeRemoved action parsing ──

type CannotBeRemovedAction = Extract<Action, { action: "cannotBeRemoved" }>;

/**
 * Parse "this Character/Leader cannot be removed from the field by your opponent's/your effects" variants.
 *
 * Examples:
 * - "this Character cannot be removed from the field by your opponent's effects"
 * - "this Character cannot be removed from the field by your opponent's effects and gains [Blocker]"
 *   (compound — the [Blocker] portion is left as unparsed for the next parser)
 */
export function parseCannotBeRemovedAction(text: string): CannotBeRemovedAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "you cannot add Life cards to your hand using your own effects during this turn"
  const lifeRestrictionMatch =
    /^you\s+cannot\s+add\s+Life\s+cards?\s+to\s+your\s+hand\s+using\s+your\s+own\s+effects?\s+during\s+this\s+turn$/i.exec(
      trimmed,
    );
  if (lifeRestrictionMatch) {
    return {
      action: "cannotBeRemoved",
      target: { player: "self", zones: ["life" as Zone], count: { amount: "all" } },
      duration: "thisTurn",
      bySource: "ownEffect",
    };
  }

  const match =
    /^(?:this\s+(?:Character|Leader)|all\s+of\s+your\s+(?:opponent[''\u2019]s\s+)?Characters?)\s+cannot\s+be\s+removed\s+from\s+the\s+field\s+by\s+(your\s+opponent[''\u2019]s|your)\s+effects?(?:\s+and\s+gains?\s+\[[^\]]+\])?$/i.exec(
      trimmed,
    );
  if (!match) return null;

  const byOpponent = /opponent/i.test(match[1]!);
  const isAll = /^all\s+of/i.test(trimmed);

  const target: Target = isAll
    ? { player: "opponent", zones: ["field"], count: { amount: "all" } }
    : { player: "self", zones: ["field"], count: { amount: 1 }, self: true };

  return {
    action: "cannotBeRemoved",
    target,
    duration: "permanent",
    bySource: byOpponent ? "opponentEffect" : "ownEffect",
  };
}

// ── Attack restriction: "opponent cannot attack any card other than X" ──

type AttackRestrictionAction = Extract<Action, { action: "attackRestriction" }>;

export function parseAttackRestrictionAction(text: string): AttackRestrictionAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "your opponent cannot attack any card other than the Character [Name]"
  const m =
    /^your\s+opponent\s+cannot\s+attack\s+any\s+card\s+other\s+than\s+(?:the\s+)?Character\s+\[([^\]]+)\]$/i.exec(
      trimmed,
    );
  if (!m) return null;

  return {
    action: "attackRestriction",
    restriction: "cannotAttackOtherThan",
    target: {
      player: "self",
      zones: ["character"],
      count: { amount: 1 },
      filters: [{ filter: "name", value: m[1]! }],
    },
    duration: "permanent",
  };
}
