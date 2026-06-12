import type { Action, Duration, TargetFilter } from "@tcg/op-types";
import { parseModifyPowerTarget, parseTarget, parseTargetWithoutPlayer } from "../target-parser.ts";
import { parseComparison } from "../helpers.ts";
import { KEYWORD_BRACKET_TO_TYPE } from "../constants.ts";
import { parseDuration, parseFullDuration } from "./helpers.ts";
import { parseConditionText } from "../condition-parser/index.ts";

// ── ModifyPower action parsing ──

type ModifyPowerAction = Extract<Action, { action: "modifyPower" }>;

export function parseModifyPowerAction(text: string): ModifyPowerAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // Handle "for every" variable-amount patterns:
  // "This Character gains +1000 power for every 3 of your rested DON!! cards"
  // "This Character gains +1000 power for every card in your hand"
  const forEveryMatch =
    /^(.+?)\s+gains?\s+([+-]?\d+)\s+power\s+for\s+every\s+(?:(\d+)\s+(?:of\s+)?)?(.+?)(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  if (forEveryMatch) {
    const target = parseModifyPowerTarget(forEveryMatch[1]!);
    if (target) {
      const value = parseInt(forEveryMatch[2]!, 10);
      const duration = forEveryMatch[5] ? parseFullDuration(forEveryMatch[5]) : "permanent";
      return { action: "modifyPower", target, value, duration };
    }
  }

  // "Give up to 1 each of your opponent's Leader and Character cards -N power during this turn"
  const eachMatch =
    /^give\s+up\s+to\s+(\d+)\s+each\s+of\s+(your(?:\s+opponent's)?)\s+Leader\s+and\s+Character\s+cards?\s+([+-]?\d+)\s+power(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  if (eachMatch) {
    const player = /opponent/i.test(eachMatch[2]!) ? "opponent" : "self";
    const value = parseInt(eachMatch[3]!, 10);
    const duration = eachMatch[4] ? parseFullDuration(eachMatch[4]) : "permanent";
    return {
      action: "modifyPower",
      target: {
        player: player as "self" | "opponent",
        zones: ["leader", "character"],
        count: { amount: parseInt(eachMatch[1]!, 10), upTo: true },
      },
      value,
      duration,
    };
  }

  // Pattern 1: "Give <target> +/-N power (duration)?"
  const giveMatch =
    /^give\s+(.+?)\s+([+-]?\d+)\s+power(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  if (giveMatch) {
    const target = parseModifyPowerTarget(giveMatch[1]!);
    if (!target) return null;
    const value = parseInt(giveMatch[2]!, 10);
    const duration = giveMatch[3] ? parseFullDuration(giveMatch[3]) : "permanent";
    return { action: "modifyPower", target, value, duration };
  }

  // Pattern 2: "<target> gains/gain +/-N power (duration)?"
  const gainsMatch =
    /^(.+?)\s+gains?\s+([+-]?\d+)\s+power(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  if (gainsMatch) {
    const target = parseModifyPowerTarget(gainsMatch[1]!);
    if (!target) return null;
    const value = parseInt(gainsMatch[2]!, 10);
    const duration = gainsMatch[3] ? parseFullDuration(gainsMatch[3]) : "permanent";
    return { action: "modifyPower", target, value, duration };
  }

  return null;
}

// ── SetPower action parsing ──

type SetPowerAction = Extract<Action, { action: "setPower" }>;

/**
 * Parse "set this Character's/Leader's power to N" action.
 */
export function parseSetPowerAction(text: string): SetPowerAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "set this Character's power to N (duration)"
  const selfMatch =
    /^set\s+this\s+(?:Character|Leader)[''\u2019]s\s+power\s+to\s+(\d+)(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  if (selfMatch) {
    const value = parseInt(selfMatch[1]!, 10);
    const duration: Duration = selfMatch[2] ? parseFullDuration(selfMatch[2]) : "permanent";
    return {
      action: "setPower",
      target: { player: "self", zones: ["field"], count: { amount: 1 }, self: true },
      value,
      duration,
    };
  }

  // "Set the power of <target> to N (duration)"
  const targetMatch =
    /^set\s+the\s+power\s+of\s+(.+?)\s+to\s+(\d+)(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  if (targetMatch) {
    const target = parseTarget(targetMatch[1]!) ?? parseTargetWithoutPlayer(targetMatch[1]!);
    if (!target) return null;
    const value = parseInt(targetMatch[2]!, 10);
    const duration: Duration = targetMatch[3] ? parseFullDuration(targetMatch[3]) : "thisTurn";
    return { action: "setPower", target, value, duration };
  }

  // "This Character's base power becomes the same as ..."
  const becomesMatch =
    /^This\s+Character[''\u2019]s\s+base\s+power\s+becomes\s+the\s+same\s+as\s+(?:the\s+power\s+of\s+)?(.+?)(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  if (becomesMatch) {
    const duration: Duration = becomesMatch[2] ? parseFullDuration(becomesMatch[2]) : "thisTurn";
    return {
      action: "setPower",
      target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
      value: 0, // Sentinel: copy from referenced card
      duration,
    };
  }

  return null;
}

// ── ModifyCost action parsing ──

type ModifyCostAction = Extract<Action, { action: "modifyCost" }>;

/**
 * Parse a "Give <target> +/-N cost during this turn" action clause.
 *
 * Handles:
 * - "Give up to 1 of your opponent's Characters -2 cost during this turn"
 * - "Give up to 1 of your opponent's Characters 1 cost during this turn" (unsigned = positive)
 */
export function parseModifyCostAction(text: string): ModifyCostAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "give <target> +/-N cost (during this turn)?"
  const match = /^give\s+(.+?)\s+([+-]?\d+)\s+cost(?:\s+during\s+this\s+(turn|battle))?$/i.exec(
    trimmed,
  );
  if (match) {
    const target = parseTarget(match[1]!) ?? parseModifyPowerTarget(match[1]!);
    if (!target) return null;
    const value = parseInt(match[2]!, 10);
    const duration = parseDuration(match[3]);
    return { action: "modifyCost", target, value, duration };
  }

  // "Set the cost of <target> to N (during this turn)?"
  const setMatch =
    /^set\s+the\s+cost\s+of\s+(.+?)\s+to\s+(\d+)(?:\s+during\s+this\s+(turn|battle))?$/i.exec(
      trimmed,
    );
  if (setMatch) {
    const target = parseTarget(setMatch[1]!) ?? parseModifyPowerTarget(setMatch[1]!);
    if (!target) return null;
    const value = parseInt(setMatch[2]!, 10);
    const duration = parseDuration(setMatch[3]);
    // "Set to 0" means give -(current cost), but we model it as absolute set
    return { action: "modifyCost", target, value, duration };
  }

  // "<target> gains +/-N cost (duration)?" — e.g. "Up to 1 of your Characters gains +1 cost until..."
  const gainsMatch =
    /^(.+?)\s+gains?\s+([+-]?\d+)\s+cost(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  if (gainsMatch) {
    const target = parseTarget(gainsMatch[1]!) ?? parseModifyPowerTarget(gainsMatch[1]!);
    if (!target) return null;
    const value = parseInt(gainsMatch[2]!, 10);
    const duration = gainsMatch[3] ? parseFullDuration(gainsMatch[3]) : undefined;
    return { action: "modifyCost", target, value, duration };
  }

  return null;
}

// ── CostReduction permanent parsing ──

export function parseCostReductionAction(text: string): ModifyCostAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "The cost of playing [Trait] type Character cards with a cost of N or more from your hand will be reduced by M"
  const playingMatch =
    /^The cost of playing\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+Character\s+cards?\s+(?:with\s+a\s+cost\s+of\s+(\d+)\s+or\s+(more|less)\s+)?from\s+your\s+hand\s+will\s+be\s+reduced\s+by\s+(\d+)$/i.exec(
      trimmed,
    );
  if (playingMatch) {
    const trait = playingMatch[1]!;
    const reduction = -parseInt(playingMatch[4]!, 10);
    const filters: TargetFilter[] = [
      { filter: "trait", value: trait },
      { filter: "cardCategory", value: "character" as any },
    ];
    if (playingMatch[2]) {
      filters.push({
        filter: "cost",
        comparison: parseComparison(playingMatch[3]),
        value: parseInt(playingMatch[2], 10),
      });
    }
    return {
      action: "modifyCost",
      target: { player: "self", zones: ["hand"], count: { amount: "all" }, filters },
      value: reduction,
    };
  }

  // "The next time you play [Name/Trait] (type Character card) with a cost of N or more from your hand during this turn, the cost will be reduced by M"
  const nextTimeMatch =
    /^The next time you play\s+(?:a\s+)?(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+(?:type\s+Character\s+cards?\s+)?(?:with\s+a\s+cost\s+of\s+(\d+)\s+or\s+(more|less)\s+)?(?:that\s+is\s+equal\s+to\s+or\s+less\s+than\s+.+?\s+)?from\s+your\s+hand\s+during\s+this\s+turn,?\s+the\s+cost\s+will\s+be\s+reduced\s+by\s+(\d+)$/i.exec(
      trimmed,
    );
  if (nextTimeMatch) {
    const nameOrTrait = nextTimeMatch[1]!;
    const reduction = -parseInt(nextTimeMatch[4]!, 10);
    const isName = /^[A-Z]/.test(nameOrTrait) && !/ /.test(nameOrTrait);
    const filters: TargetFilter[] = isName
      ? [{ filter: "name", value: nameOrTrait }]
      : [{ filter: "trait", value: nameOrTrait }];
    if (/type\s+Character/i.test(trimmed)) {
      filters.push({ filter: "cardCategory", value: "character" });
    }
    if (nextTimeMatch[2]) {
      filters.push({
        filter: "cost",
        comparison: parseComparison(nextTimeMatch[3]),
        value: parseInt(nextTimeMatch[2], 10),
      });
    }
    return {
      action: "modifyCost",
      target: { player: "self", zones: ["hand"], count: { amount: 1 }, filters },
      value: reduction,
      duration: "thisTurn",
    };
  }

  // "Give blue Events in your hand -1 cost"
  const giveColorCostMatch =
    /^Give\s+(red|green|blue|purple|black|yellow)\s+Events?\s+in\s+your\s+hand\s+([+-]?\d+)\s+cost$/i.exec(
      trimmed,
    );
  if (giveColorCostMatch) {
    const color = giveColorCostMatch[1]!.toLowerCase();
    const value = parseInt(giveColorCostMatch[2]!, 10);
    return {
      action: "modifyCost",
      target: {
        player: "self",
        zones: ["hand"],
        count: { amount: "all" },
        filters: [
          { filter: "color", value: color as any },
          { filter: "cardCategory", value: "event" as any },
        ],
      },
      value,
    };
  }

  return null;
}

// ── GrantKeyword action parsing ──

type GrantKeywordAction = Extract<Action, { action: "grantKeyword" }>;

/**
 * Parse a "<target> gains [Keyword] (during this turn/battle)?" action clause.
 */
export function parseGrantKeywordAction(text: string): GrantKeywordAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "<target> gains [Keyword] if <condition>"
  const condMatch = /^(.+?)\s+gains?\s+\[([^\]]+)\]\s+if\s+(.+)$/i.exec(trimmed);
  if (condMatch) {
    const keyword = KEYWORD_BRACKET_TO_TYPE[condMatch[2]!.toLowerCase()];
    if (!keyword) return null;
    const target = parseModifyPowerTarget(condMatch[1]!);
    if (!target) return null;
    const condition = parseConditionText(condMatch[3]!);
    if (!condition) return null;
    return { action: "grantKeyword", target, keyword, duration: "permanent", condition };
  }

  // "<target> gains [Keyword] (duration)?"
  // Use greedy match to capture target (handles internal brackets like [On Play])
  const match =
    /^(.+)\s+gains?\s+\[([^\]]+)\](?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  if (match) {
    const keyword = KEYWORD_BRACKET_TO_TYPE[match[2]!.toLowerCase()];
    if (!keyword) return null;

    const target = parseModifyPowerTarget(match[1]!);
    if (!target) return null;

    const duration = match[3] ? parseFullDuration(match[3]) : "permanent";
    return { action: "grantKeyword", target, keyword, duration };
  }

  // Bare "gains [Keyword] (duration)?" — implicit self target
  const bareMatch =
    /^gains?\s+\[([^\]]+)\](?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(trimmed);
  if (bareMatch) {
    const keyword = KEYWORD_BRACKET_TO_TYPE[bareMatch[1]!.toLowerCase()];
    if (!keyword) return null;

    const duration = bareMatch[2] ? parseFullDuration(bareMatch[2]) : "permanent";
    return {
      action: "grantKeyword",
      target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
      keyword,
      duration,
    };
  }

  return null;
}

// ── Compound keyword + power pre-parser ──

/**
 * Parse "this Character/Leader gains [Keyword] and +/-N power (duration)?" patterns.
 * Must be parsed before clause splitting since "and" would split it apart.
 */
export function parseCompoundKeywordPower(text: string): Action[] | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  const m =
    /^(.+?)\s+gains?\s+\[([^\]]+)\]\s+and\s+([+-]?\d+)\s+power(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  if (!m) return null;

  const keyword = KEYWORD_BRACKET_TO_TYPE[m[2]!.toLowerCase()];
  if (!keyword) return null;

  const target = parseModifyPowerTarget(m[1]!);
  if (!target) return null;

  const duration = m[4] ? parseFullDuration(m[4]) : "permanent";

  return [
    { action: "grantKeyword", target, keyword, duration },
    { action: "modifyPower", target: { ...target }, value: parseInt(m[3]!, 10), duration },
  ];
}
