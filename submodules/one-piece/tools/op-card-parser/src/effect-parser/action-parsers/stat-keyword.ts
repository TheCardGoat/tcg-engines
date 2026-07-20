import type { Action, Duration, TargetFilter } from "@tcg/op-types";
import { parseModifyPowerTarget, parseTarget, parseTargetWithoutPlayer } from "../target-parser.ts";
import { parseComparison } from "../helpers.ts";
import { KEYWORD_BRACKET_TO_TYPE } from "../constants.ts";
import { parseDuration, parseFullDuration } from "./helpers.ts";
import { parseConditionText } from "../condition-parser/index.ts";

// ── ModifyPower action parsing ──

type ModifyPowerAction = Extract<Action, { action: "modifyPower" }>;

export function parseEachModifyPowerActions(text: string): ModifyPowerAction[] | null {
  const trimmed = text
    .trim()
    .replace(/\u2212/g, "-")
    .replace(/\.+$/, "");
  const match =
    /^give\s+up\s+to\s+(\d+)\s+each\s+of\s+(your(?:\s+opponent's)?)\s+Leader\s+and\s+Character\s+cards?\s+([+-]?\d+)\s+power(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  if (!match) return null;

  const player = /opponent/i.test(match[2]!) ? "opponent" : "self";
  const amount = parseInt(match[1]!, 10);
  const value = parseInt(match[3]!, 10);
  const duration = match[4] ? parseFullDuration(match[4]) : "permanent";
  return (["leader", "character"] as const).map((zone) => ({
    action: "modifyPower",
    target: {
      player,
      zones: [zone],
      count: { amount, upTo: true },
    },
    value,
    duration,
  }));
}

export function parseModifyPowerAction(text: string): ModifyPowerAction | null {
  const trimmed = text
    .trim()
    .replace(/\u2212/g, "-")
    .replace(/\.+$/, "");

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
      const per = forEveryMatch[3] ? parseInt(forEveryMatch[3]!, 10) : 1;
      const sourceText = forEveryMatch[4]!.trim();
      const duration = forEveryMatch[5] ? parseFullDuration(forEveryMatch[5]) : "permanent";
      const cardZoneMatch =
        /^(?:(Character|Event|Stage)s?|cards?)\s+in\s+your\s+(hand|trash)$/i.exec(sourceText);
      if (cardZoneMatch) {
        const category = cardZoneMatch[1]?.toLowerCase() as
          | "character"
          | "event"
          | "stage"
          | undefined;
        return {
          action: "modifyPower",
          target,
          value,
          valuePerCardGroup: {
            size: per,
            target: {
              player: "self",
              zones: [cardZoneMatch[2]!.toLowerCase() as "hand" | "trash"],
              count: { amount: "all" },
              ...(category && {
                filters: [{ filter: "cardCategory", value: category }],
              }),
            },
          },
          duration,
        };
      }
      if (/^(?:of\s+)?your\s+rested\s+DON!!\s+cards$/i.test(sourceText)) {
        return {
          action: "modifyPower",
          target,
          value,
          restedDonGroupSize: per,
          duration,
        };
      }
    }
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

type SetPowerAction = Extract<Action, { action: "setPower" | "setBasePowerFrom" | "copyPower" }>;

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
    const copiedSource = becomesMatch[1]!.trim();
    const duration: Duration = becomesMatch[2] ? parseFullDuration(becomesMatch[2]) : "permanent";
    if (/^your opponent['’]s attacking Leader or Character$/i.test(copiedSource)) {
      return {
        action: "copyPower",
        target: {
          player: "opponent",
          zones: ["leader", "character"],
          count: { amount: 1 },
        },
        duration,
        triggerEventAttacker: true,
      };
    }
    const sourceMatch = /^(your|your opponent['\u2019]s) Leader(?:['\u2019]s base power)?$/i.exec(
      copiedSource,
    );
    if (!sourceMatch) return null;
    return {
      action: "setBasePowerFrom",
      target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
      source: {
        player: /^your opponent/i.test(sourceMatch[1]!) ? "opponent" : "self",
        zones: ["leader"],
        count: { amount: 1 },
      },
      duration,
    };
  }

  return null;
}

// ── ModifyCost action parsing ──

type CostAction = Extract<Action, { action: "modifyCost" | "setCost" }>;
type ModifyCostAction = Extract<Action, { action: "modifyCost" }>;

/**
 * Parse a "Give <target> +/-N cost during this turn" action clause.
 *
 * Handles:
 * - "Give up to 1 of your opponent's Characters -2 cost during this turn"
 * - "Give up to 1 of your opponent's Characters 1 cost during this turn" (unsigned = positive)
 */
export function parseModifyCostAction(text: string): CostAction | null {
  const trimmed = text
    .trim()
    .replace(/[\u2212\u2013]/g, "-")
    .replace(/\.+$/, "");

  const selfInHandMatch = /^give\s+this\s+card\s+in\s+your\s+hand\s+([+-]?\d+)\s+cost$/i.exec(
    trimmed,
  );
  if (selfInHandMatch) {
    const rawValue = selfInHandMatch[1]!;
    const value = parseInt(rawValue, 10);
    if (/^[+-]/.test(rawValue)) {
      return {
        action: "modifyCost",
        target: {
          player: "self",
          zones: ["hand"],
          count: { amount: 1 },
          self: true,
        },
        value,
        duration: "permanent",
      };
    }
    return {
      action: "setCost",
      target: {
        player: "self",
        zones: ["hand"],
        count: { amount: 1 },
        self: true,
      },
      value,
    };
  }

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
    return { action: "setCost", target, value, duration };
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
      { filter: "trait", value: trait, match: "includes" },
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
type KeywordChoiceAction = Extract<Action, { action: "choice" }>;

/**
 * Parse one target gaining exactly one keyword from an inline `A, B or C`
 * list. Each option retains the same physical target and duration.
 */
export function parseGrantKeywordChoiceAction(text: string): KeywordChoiceAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");
  const match = /^(.+?)\s+gains?\s+(.+?)\s+(during\s+this\s+(?:turn|battle)|until\s+.+)$/i.exec(
    trimmed,
  );
  if (!match || !/\s+or\s+/i.test(match[2]!)) return null;

  const keywordNames = [...match[2]!.matchAll(/\[([^\]]+)\]/g)].map((entry) => entry[1]!);
  const separatorRemainder = match[2]!
    .replace(/\[[^\]]+\]/g, "")
    .replace(/\bor\b/gi, "")
    .replace(/[\s,]/g, "");
  if (keywordNames.length < 2 || separatorRemainder) return null;

  const keywords = keywordNames.map((name) => KEYWORD_BRACKET_TO_TYPE[name.toLowerCase()]);
  const target = parseModifyPowerTarget(match[1]!);
  if (!target || keywords.some((keyword) => !keyword)) return null;

  const duration = parseFullDuration(match[3]!);
  return {
    action: "choice",
    options: keywords.map((keyword) => [
      { action: "grantKeyword", target, keyword: keyword!, duration },
    ]),
  };
}

/**
 * Parse a "<target> gains [Keyword] (during this turn/battle)?" action clause.
 */
export function parseGrantKeywordAction(text: string): GrantKeywordAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  const selectedTraitRushCharacterMatch =
    /^up\s+to\s+(\d+)\s+of\s+your\s+(?:\[([^\]]+)\]|\{([^}]+)\}|["\u201c]([^"\u201d]+)["\u201d])\s+or\s+(?:\[([^\]]+)\]|\{([^}]+)\}|["\u201c]([^"\u201d]+)["\u201d])\s+type\s+Characters\s+can\s+attack\s+Characters\s+on\s+the\s+turn\s+in\s+which\s+(?:it|they)\s+(?:is|are)\s+played$/i.exec(
      trimmed,
    );
  if (selectedTraitRushCharacterMatch) {
    const firstTrait =
      selectedTraitRushCharacterMatch[2] ??
      selectedTraitRushCharacterMatch[3] ??
      selectedTraitRushCharacterMatch[4]!;
    const secondTrait =
      selectedTraitRushCharacterMatch[5] ??
      selectedTraitRushCharacterMatch[6] ??
      selectedTraitRushCharacterMatch[7]!;
    return {
      action: "grantKeyword",
      target: {
        player: "self",
        zones: ["character"],
        count: {
          amount: parseInt(selectedTraitRushCharacterMatch[1]!, 10),
          upTo: true,
        },
        filters: [
          {
            filter: "anyOf",
            filters: [
              { filter: "trait", value: firstTrait, match: "includes" },
              { filter: "trait", value: secondTrait, match: "includes" },
            ],
          },
        ],
      },
      keyword: "rushCharacter",
      duration: "permanent",
    };
  }

  const typedRushCharacterMatch =
    /^your\s+(?:\[([^\]]+)\]|\{([^}]+)\}|["\u201c]([^"\u201d]+)["\u201d])\s+type\s+Characters\s+can\s+attack\s+Characters\s+on\s+the\s+turn\s+in\s+which\s+they\s+are\s+played$/i.exec(
      trimmed,
    );
  if (typedRushCharacterMatch) {
    const trait =
      typedRushCharacterMatch[1] ?? typedRushCharacterMatch[2] ?? typedRushCharacterMatch[3]!;
    return {
      action: "grantKeyword",
      target: {
        player: "self",
        zones: ["character"],
        count: { amount: "all" },
        filters: [{ filter: "trait", value: trait, match: "includes" }],
      },
      keyword: "rushCharacter",
      duration: "permanent",
    };
  }

  if (
    /^(?:this\s+Character\s+can\s+attack\s+Characters|this\s+Character\s+cannot\s+attack\s+a\s+Leader)\s+on\s+the\s+turn\s+in\s+which\s+it\s+is\s+played$/i.test(
      trimmed,
    )
  ) {
    return {
      action: "grantKeyword",
      target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
      keyword: "rushCharacter",
      duration: "permanent",
    };
  }

  // Some official card text omits keyword brackets in an inline grant:
  // "this Character gains Rush during this turn".
  const unbracketedMatch =
    /^(.+?)\s+gains?\s+(Rush|Blocker|Double Attack|Banish|Unblockable)(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  if (unbracketedMatch) {
    const keyword = KEYWORD_BRACKET_TO_TYPE[unbracketedMatch[2]!.toLowerCase()];
    const target = parseModifyPowerTarget(unbracketedMatch[1]!);
    if (keyword && target) {
      const duration = unbracketedMatch[3] ? parseFullDuration(unbracketedMatch[3]) : "permanent";
      return { action: "grantKeyword", target, keyword, duration };
    }
  }

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
 * Parse a shared power modifier whose printed subject names one card and then
 * broadens to a trait family:
 *
 * "your [Edward.Newgate] and all your Characters with a type including
 *  "Whitebeard Pirates" gain +2000 power"
 *
 * The named Character is excluded from the trait action so a card satisfying
 * both subjects receives the shared modifier only once.
 */
export function parseCompoundNamedTraitPower(text: string): Action[] | null {
  const trimmed = text.trim().replace(/\.+$/, "");
  const establishedMatch =
    /^your\s+\[([^\]]+)\]\s+and\s+all\s+(?:of\s+)?your\s+Characters\s+with\s+a\s+type\s+including\s+["\u201c]([^"\u201d]+)["\u201d]\s+gain\s+([+-]?\d+)\s+power(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  const allCharactersMatch =
    /^all\s+of\s+your\s+\[([^\]]+)\]\s+and\s+["\u201c]([^"\u201d]+)["\u201d]\s+type\s+Characters\s+gain\s+([+-]?\d+)\s+power(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  const match = establishedMatch ?? allCharactersMatch;
  if (!match) return null;

  const name = match[1]!;
  const trait = match[2]!;
  const value = parseInt(match[3]!, 10);
  const duration = match[4] ? parseFullDuration(match[4]) : "permanent";

  return [
    {
      action: "modifyPower",
      target: {
        player: "self",
        zones: allCharactersMatch ? ["character"] : ["leader", "character"],
        count: { amount: "all" },
        filters: [{ filter: "name", value: name }],
      },
      value,
      duration,
    },
    {
      action: "modifyPower",
      target: {
        player: "self",
        zones: ["character"],
        count: { amount: "all" },
        filters: [
          { filter: "trait", value: trait, match: "includes" },
          { filter: "excludeName", value: name },
        ],
      },
      value,
      duration,
    },
  ];
}

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

/**
 * Parse "this Character/Leader gains [Keyword] and +/-N cost (duration)?" patterns.
 * Must be parsed before clause splitting since the cost clause has an implicit target.
 */
export function parseCompoundKeywordCost(text: string): Action[] | null {
  const trimmed = text.trim().replace(/\.+$/, "");
  const match =
    /^(.+?)\s+gains?\s+\[([^\]]+)\]\s+and\s+([+-]?\d+)\s+cost(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  if (!match) return null;

  const keyword = KEYWORD_BRACKET_TO_TYPE[match[2]!.toLowerCase()];
  const target = parseModifyPowerTarget(match[1]!);
  if (!keyword || !target) return null;

  const duration = match[4] ? parseFullDuration(match[4]) : "permanent";
  return [
    { action: "grantKeyword", target, keyword, duration },
    {
      action: "modifyCost",
      target: { ...target },
      value: parseInt(match[3]!, 10),
      duration,
    },
  ];
}

/**
 * Parse "this Character/Leader gains +/-N power and +/-M cost" patterns.
 * The second clause inherits the first clause's target.
 */
export function parseCompoundPowerCost(text: string): Action[] | null {
  const trimmed = text.trim().replace(/\.+$/, "");
  const match =
    /^(.+?)\s+gains?\s+([+-]?\d+)\s+power\s+and\s+([+-]?\d+)\s+cost(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  if (!match) return null;

  const target = parseModifyPowerTarget(match[1]!);
  if (!target) return null;

  const duration = match[4] ? parseFullDuration(match[4]) : "permanent";
  return [
    {
      action: "modifyPower",
      target,
      value: parseInt(match[2]!, 10),
      duration,
    },
    {
      action: "modifyCost",
      target: { ...target },
      value: parseInt(match[3]!, 10),
      duration,
    },
  ];
}
