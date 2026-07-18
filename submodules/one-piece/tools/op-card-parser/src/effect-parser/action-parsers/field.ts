import type { Action, Target, TargetFilter, Zone } from "@tcg/op-types";
import { mapZoneNoun, parseComparison } from "../helpers.ts";
import {
  parseTarget,
  parseTargetWithoutPlayer,
  traitAlternativesFilter,
} from "../target-parser.ts";

type KoAction = Extract<Action, { action: "ko" }>;
type RestAction = Extract<Action, { action: "rest" }>;
type TrashFromFieldAction = Extract<Action, { action: "trashFromField" }>;
type GenericPlayAction = Extract<Action, { action: "play" }>;
type PlayAction = Extract<Action, { action: "play" | "playThisCard" }>;
type SetActiveAction = Extract<Action, { action: "setActive" }>;
type FreezeAction = Extract<Action, { action: "freeze" }>;
type TrashThisCardAction = Extract<Action, { action: "trashThisCard" }>;

export function parseCompoundRestActions(text: string): RestAction[] | null {
  const match = /^rest\s+this\s+(Character|Leader|Stage)\s+and\s+(.+)$/i.exec(
    text.trim().replace(/\.+$/, ""),
  );
  if (!match) return null;

  const opponentTarget = parseTarget(match[2]!);
  if (!opponentTarget) return null;

  const selfZone = match[1]!.toLowerCase() as "character" | "leader" | "stage";
  return [
    {
      action: "rest",
      target: {
        player: "self",
        zones: [selfZone],
        count: { amount: 1 },
        self: true,
      },
    },
    { action: "rest", target: opponentTarget },
  ];
}

export function parseCompoundSetActiveActions(text: string): SetActiveAction[] | null {
  const stripped = text
    .trim()
    .replace(/\.+$/, "")
    .replace(/\s+at\s+the\s+end\s+of\s+this\s+turn$/i, "");
  const match = /^set\s+(.+?)\s+and\s+your\s+Leader\s+as\s+active$/i.exec(stripped);
  if (!match) {
    return null;
  }
  const characterTarget = parseTarget(match[1]!);
  if (!characterTarget) {
    return null;
  }
  return [
    { action: "setActive", target: characterTarget },
    {
      action: "setActive",
      target: { player: "self", zones: ["leader"], count: { amount: 1 } },
    },
  ];
}

/**
 * Parse a "Rest <target>" action clause.
 */
export function parseRestAction(text: string): RestAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");
  const traitOrNamedLeaderMatch =
    /^rest\s+1\s+of\s+your\s+\[([^\]]+)\]\s+or\s+your\s+\[([^\]]+)\]\s+Leader(?:\s+instead)?$/i.exec(
      trimmed,
    );
  if (traitOrNamedLeaderMatch) {
    return {
      action: "rest",
      target: {
        player: "self",
        zones: ["leader"],
        count: { amount: 1 },
        filters: [
          {
            filter: "anyOf",
            filters: [
              {
                filter: "trait",
                value: traitOrNamedLeaderMatch[1]!,
                match: "includes",
              },
              { filter: "name", value: traitOrNamedLeaderMatch[2]! },
            ],
          },
        ],
      },
    };
  }
  const leaderOrNamedStageMatch = /^rest\s+your\s+Leader\s+or\s+1\s+\[([^\]]+)\]$/i.exec(trimmed);
  if (leaderOrNamedStageMatch) {
    return {
      action: "rest",
      target: {
        player: "self",
        zones: ["leader", "stage"],
        count: { amount: 1 },
        filters: [
          {
            filter: "anyOf",
            groups: [
              [{ filter: "cardCategory", value: "leader" }],
              [
                { filter: "cardCategory", value: "stage" },
                { filter: "name", value: leaderOrNamedStageMatch[1]! },
              ],
            ],
          },
        ],
      },
    };
  }

  const match = /^rest\s+(.+)$/i.exec(trimmed);
  if (!match) return null;

  const target = parseTarget(match[1]!);
  if (!target) return null;

  return { action: "rest", target };
}

/**
 * Parse a "K.O. <target>" action clause.
 *
 * Handles:
 * - "K.O. up to 1 of your opponent's Characters with a cost of 5 or less"
 * - "K.O. up to 1 of your opponent's rested Characters with a cost of 4 or less"
 * - "K.O. up to 2 of your opponent's Characters with a base cost of 3 or less"
 * - "K.O. up to 1 of your opponent's Characters" (no filter)
 * - "K.O. up to 1 of your opponent's Stages with a cost of 7"
 */
export function parseKoAction(text: string): KoAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");
  const match = /^k\.o\.\s+(.+)$/i.exec(trimmed);
  if (!match) return null;

  const targetText = match[1]!;

  // "K.O. it" / "K.O. them" — refers to previously selected target
  if (/^(?:it|them)$/i.test(targetText.trim())) {
    return {
      action: "ko",
      target: { player: "opponent", zones: ["character"], count: { amount: 1 } },
    };
  }

  const parsedTarget = parseTarget(targetText) ?? parseTargetWithoutPlayer(targetText);
  if (!parsedTarget) return null;
  const target = /^all\s+rested\s+Characters\b/i.test(targetText)
    ? { ...parsedTarget, player: "both" as const }
    : parsedTarget;

  return { action: "ko", target };
}

/**
 * Parse a "Trash up to N of your opponent's Characters with ..." action clause.
 * Uses parseTarget() for the target expression.
 */
export function parseTrashFromFieldAction(text: string): TrashFromFieldAction | null {
  const match = /^trash\s+(.+)$/i.exec(text.trim());
  if (!match) return null;

  // Avoid matching "trash N cards from hand/deck" — those aren't field trashes
  if (/cards?\s+from\s+(your|their|your opponent's)\s+(hand|deck)/i.test(match[1]!)) return null;
  if (/from the top of/i.test(match[1]!)) return null;

  const target = parseTarget(match[1]!);
  if (!target) return null;

  return { action: "trashFromField", target };
}

/**
 * Parse a "Play ... from your hand/trash/deck" action clause.
 *
 * Handles:
 * - "Play this card"
 * - "Play up to 1 Character card with a cost of 3 or less from your hand"
 * - "Play up to 1 [Name] with a cost of 4 or less from your hand rested"
 * - "Play up to 1 [Trait] type Character card with a cost of N from your trash"
 * - "Play up to 1 red Character card with 3000 power or less from your hand"
 * - "Play up to 1 Character card other than [Name] from your hand"
 */
export function parsePlayAction(text: string): PlayAction | null {
  const match = /^(?:(your\s+opponent)\s+plays?|play)\s+(.+)$/i.exec(
    text.trim().replace(/\.+$/, ""),
  );
  if (!match) return null;

  const sourcePlayer = match[1] ? "opponent" : "self";
  let rest = match[2]!;
  const differentColorFromPreviousCharacter =
    /\s+that\s+is\s+a\s+different\s+color\s+than\s+the\s+returned\s+Character$/i.test(rest);
  if (differentColorFromPreviousCharacter) {
    rest = rest.replace(
      /\s+that\s+is\s+a\s+different\s+color\s+than\s+the\s+returned\s+Character$/i,
      "",
    );
  }

  // A card resolving its Life Trigger is in no ordinary area. Bare
  // "Play this card" therefore moves the resolving physical card itself.
  if (sourcePlayer === "self" && /^this\s+card$/i.test(rest.trim())) {
    return { action: "playThisCard" };
  }

  // "Play this card" / "Play this Character card (from your trash)? (rested)?"
  const thisCardMatch =
    /^this\s+(?:Character\s+)?card(?:\s+from\s+your\s+(hand|trash|deck))?(?:\s+(rested))?$/i.exec(
      rest.trim(),
    );
  if (thisCardMatch) {
    return {
      action: "play",
      source: { player: "self", zone: (thisCardMatch[1]?.toLowerCase() as any) ?? "hand" },
      count: { amount: 1 },
      self: true,
      ...(thisCardMatch[2] && { playState: "rested" as const }),
    };
  }

  // Extract play state: "rested" at the end
  let playState: GenericPlayAction["playState"];
  if (/\s+rested$/i.test(rest)) {
    playState = "rested";
    rest = rest.replace(/\s+rested$/i, "");
  }

  // Extract source: "from your hand/trash/deck" or "from your hand or trash"
  // Source may appear before "with a cost..." so also try mid-string
  let zone: Zone | Zone[];
  const multiSourceMatch = /\s+from\s+(?:your|their)\s+(hand)\s+or\s+(trash|deck)$/i.exec(rest);
  if (multiSourceMatch) {
    zone = [multiSourceMatch[1]!.toLowerCase() as Zone, multiSourceMatch[2]!.toLowerCase() as Zone];
    rest = rest.slice(0, multiSourceMatch.index).trim();
  } else {
    const sourceMatch = /\s+from\s+(?:your|their)\s+(hand|trash|deck)(?=\s+with\s+|\s*$)/i.exec(
      rest,
    );
    if (!sourceMatch) return null;
    zone = sourceMatch[1]!.toLowerCase() as Zone;
    rest = rest.slice(0, sourceMatch.index) + rest.slice(sourceMatch.index + sourceMatch[0].length);
    rest = rest.trim();
  }

  // Extract count: "up to N" or just "N"
  let upTo = false;
  let amount = 1;
  if (/^up to\s+/i.test(rest)) {
    upTo = true;
    rest = rest.replace(/^up to\s+/i, "");
  }
  const numMatch = /^(\d+)\s+/i.exec(rest);
  if (numMatch) {
    amount = parseInt(numMatch[1]!, 10);
    rest = rest.slice(numMatch[0].length);
  }

  const sameNameAsPreviousCard =
    /\s+and\s+the\s+same\s+card\s+name\s+as\s+the\s+trashed\s+card$/i.test(rest);
  if (sameNameAsPreviousCard) {
    rest = rest.replace(/\s+and\s+the\s+same\s+card\s+name\s+as\s+the\s+trashed\s+card$/i, "");
  }

  const differentNames = /\s+with\s+different\s+card\s+names\s+and\s+/i.test(rest);
  if (differentNames) {
    rest = rest.replace(/\s+with\s+different\s+card\s+names\s+and\s+/i, " with ");
  }

  // Parse the card description into filters
  const filters = parsePlayDescription(rest);
  if (!filters) return null;

  return {
    action: "play",
    source: { player: sourcePlayer, zone },
    count: { amount, ...(upTo && { upTo: true }) },
    ...(differentNames && { differentNames: true }),
    ...(filters.length > 0 && { filters }),
    ...(sameNameAsPreviousCard && { sameNameAsPreviousCard: true }),
    ...(differentColorFromPreviousCharacter && { differentColorFromPreviousCharacter: true }),
    ...(playState && { playState }),
  };
}

/**
 * Parse a play action's card description into TargetFilter[].
 *
 * Input examples:
 * - "Character card with a cost of 3 or less"
 * - "[Baroque Works] type Character card with a cost of 3 or less"
 * - "[Kin'emon] with a cost of 6"
 * - "red Character card with 3000 power or less"
 * - "Character card other than [Name] with a cost of 3 or less"
 * - "[FILM] or [Straw Hat Crew] type Character card with a cost of 2 or less"
 */
export function parsePlayDescription(text: string): TargetFilter[] | null {
  const filters: TargetFilter[] = [];
  let rest = text
    .trim()
    .replace(/^of\s+your\s+/i, "")
    .trim();

  // Extract "other than [Name]"
  const excludeMatch = /\s+other than\s+\[([^\]]+)\]/i.exec(rest);
  if (excludeMatch) {
    filters.push({ filter: "excludeName", value: excludeMatch[1]! });
    rest =
      rest.slice(0, excludeMatch.index) + rest.slice(excludeMatch.index + excludeMatch[0].length);
    rest = rest.trim();
  }

  // Extract "and no base effect" (before cost/power so it doesn't block their $ anchors)
  if (/\s+and no base effect$/i.test(rest)) {
    filters.push({ filter: "noBaseEffect" });
    rest = rest.replace(/\s+and no base effect$/i, "").trim();
  }

  // Extract "and a [Trigger]"
  if (/\s+and a \[Trigger\]$/i.test(rest)) {
    filters.push({ filter: "hasTrigger", value: true });
    rest = rest.replace(/\s+and a \[Trigger\]$/i, "").trim();
  }

  // Extract a bounded dynamic DON!!-field cost. Keep both the printed minimum
  // and the live upper bound.
  const dynamicDonCostMatch =
    /\s+with\s+a\s+cost\s+of\s+(\d+)\s+or\s+more\s+that\s+is\s+equal\s+to\s+or\s+(less|more)\s+than\s+the\s+number\s+of\s+DON!!\s+cards?\s+on\s+(your|your\s+opponent[''\u2019]s)\s+field$/i.exec(
      rest,
    );
  if (dynamicDonCostMatch) {
    filters.push(
      {
        filter: "cost",
        comparison: "gte",
        value: parseInt(dynamicDonCostMatch[1]!, 10),
      },
      {
        filter: "dynamicCost",
        comparison: parseComparison(dynamicDonCostMatch[2]),
        source: /opponent/i.test(dynamicDonCostMatch[3]!) ? "opponentDonCount" : "selfDonCount",
      },
    );
    rest = rest.slice(0, dynamicDonCostMatch.index).trim();
  }

  const boundedDynamicDonCostMatch =
    /\s+with\s+a\s+cost\s+equal\s+to\s+or\s+(less|more)\s+than\s+the\s+number\s+of\s+DON!!\s+cards?\s+on\s+(your|your\s+opponent[''\u2019]s)\s+field$/i.exec(
      rest,
    );
  if (boundedDynamicDonCostMatch) {
    filters.push({
      filter: "dynamicCost",
      comparison: parseComparison(boundedDynamicDonCostMatch[1]),
      source: /opponent/i.test(boundedDynamicDonCostMatch[2]!)
        ? "opponentDonCount"
        : "selfDonCount",
    });
    rest = rest.slice(0, boundedDynamicDonCostMatch.index).trim();
  }

  // Extract "with a cost of N (or less|more)?" or "with N power (or less|more)?"
  const costMatch = /\s+(?:with|and) a cost of (\d+)(?:\s+or\s+(less|more))?$/i.exec(rest);
  if (costMatch) {
    filters.push({
      filter: "cost",
      comparison: parseComparison(costMatch[2]),
      value: parseInt(costMatch[1]!, 10),
    });
    rest = rest.slice(0, costMatch.index).trim();
  }

  const powerRangeMatch = /\s+with (\d+)\s+to\s+(\d+) power$/i.exec(rest);
  if (!costMatch && powerRangeMatch) {
    filters.push(
      {
        filter: "power",
        comparison: "gte",
        value: parseInt(powerRangeMatch[1]!, 10),
      },
      {
        filter: "power",
        comparison: "lte",
        value: parseInt(powerRangeMatch[2]!, 10),
      },
    );
    rest = rest.slice(0, powerRangeMatch.index).trim();
  }

  const powerMatch = /\s+with (\d+) power(?:\s+or\s+(less|more))?$/i.exec(rest);
  if (!costMatch && !powerRangeMatch && powerMatch) {
    filters.push({
      filter: "power",
      comparison: parseComparison(powerMatch[2]),
      value: parseInt(powerMatch[1]!, 10),
    });
    rest = rest.slice(0, powerMatch.index).trim();
  }

  const qualifiedTraitOrNameMatch =
    /^(?:of\s+your\s+)?(?:(red|green|blue|purple|black|yellow)\s+)?["“]([^"”]+)["”]\s+type\s+(Character|Event|Stage)\s+cards?\s+or\s+\[([^\]]+)\]$/i.exec(
      rest,
    );
  if (qualifiedTraitOrNameMatch) {
    const category = qualifiedTraitOrNameMatch[3]!.toLowerCase() as "character" | "event" | "stage";
    filters.push(
      { filter: "cardCategory", value: category },
      {
        filter: "anyOf",
        groups: [
          [
            ...(qualifiedTraitOrNameMatch[1]
              ? [
                  {
                    filter: "color" as const,
                    value: qualifiedTraitOrNameMatch[1].toLowerCase() as
                      | "red"
                      | "green"
                      | "blue"
                      | "purple"
                      | "black"
                      | "yellow",
                  },
                ]
              : []),
            {
              filter: "trait",
              value: qualifiedTraitOrNameMatch[2]!,
              match: "includes",
            },
          ],
          [{ filter: "name", value: qualifiedTraitOrNameMatch[4]! }],
        ],
      },
    );
    return filters;
  }

  // A prefix `type card` and a suffix `card with a type including` are
  // alternatives, not two conjunctive trait filters. Cost/exclusion filters
  // extracted above remain shared by both branches.
  const typeIncludingAlternativeMatch =
    /^(.+?\btype\s+(?:(?:Character|Event|Stage)\s+)?card)\s+or\s+((?:(?:Character|Event|Stage)\s+)?card\s+with\s+a\s+type\s+including\s+(?:[[{"\u201c])[^\]}"\u201d]+(?:[\]}"\u201d]))$/i.exec(
      rest,
    );
  if (typeIncludingAlternativeMatch) {
    const left = parsePlayDescription(typeIncludingAlternativeMatch[1]!);
    const right = parsePlayDescription(typeIncludingAlternativeMatch[2]!);
    if (left && left.length > 0 && right && right.length > 0) {
      const branch = (nested: TargetFilter[]): TargetFilter =>
        nested.length === 1 ? nested[0]! : { filter: "allOf", filters: nested };
      return [...filters, { filter: "anyOf", filters: [branch(left), branch(right)] }];
    }
  }

  // Extract suffix trait wording: `Character card with a type including
  // "Baroque Works"`. This is equivalent to the prefix `{Trait} type`
  // wording, but appears after the card category.
  const includesTraitMatch =
    /\s+with\s+a\s+type\s+including\s+(?:[[{"\u201c])([^\]}"\u201d]+)(?:[\]}"\u201d])$/i.exec(rest);
  if (includesTraitMatch) {
    filters.push({ filter: "trait", value: includesTraitMatch[1]!, match: "includes" });
    rest = rest.slice(0, includesTraitMatch.index).trim();
  }

  // Extract attribute prefix: "(Special) attribute Character card" → AttributeFilter
  const attrMatch = /^\(([^)]+)\)\s+attribute\s+/i.exec(rest);
  if (attrMatch) {
    filters.push({ filter: "attribute", value: attrMatch[1]!.toLowerCase() as any });
    rest = rest.slice(attrMatch[0].length);
  }

  // Extract color prefix: "red Character card" → ColorFilter
  const colorMatch = /^(red|green|blue|purple|black|yellow)\s+/i.exec(rest);
  if (colorMatch) {
    filters.push({
      filter: "color",
      value: colorMatch[1]!.toLowerCase() as
        | "red"
        | "green"
        | "blue"
        | "purple"
        | "black"
        | "yellow",
    });
    rest = rest.slice(colorMatch[0].length);
  }

  // Extract trait prefix: "[Trait] type", "{Trait} type", "\"Trait\" type",
  // "[A] or [B] type", "[A], [B], or [C] type"
  // Bracket group: [X], {X}, "X", \u201cX\u201d
  const bracketGroup = '(?:[\\[{][^\\]}]+[\\]}]|["\u201c][^"\u201d]+["\u201d])';
  const traitRegex = new RegExp(
    `^(${bracketGroup}(?:(?:,\\s*(?:or\\s+)?|\\s+or\\s+)${bracketGroup})*)\\s+type\\s+`,
    "i",
  );
  const traitMatch = traitRegex.exec(rest);
  if (traitMatch) {
    const traitParts = traitMatch[1]!.split(/,\s*(?:or\s+)?|\s+or\s+/i);
    const traits = traitParts.map((part) =>
      part
        .replace(/^[[\]{}"\u201c\u201d]/g, "")
        .replace(/[[\]{}"\u201c\u201d]$/g, "")
        .trim(),
    );
    const traitFilter = traitAlternativesFilter(traits, "includes");
    if (traitFilter) filters.push(traitFilter);
    rest = rest.slice(traitMatch[0].length);
  }

  // If no trait, check for name: "[Name]" (not followed by "type")
  if (!traitMatch) {
    const nameListMatch = /^(\[[^\]]+\](?:(?:,\s*(?:or\s+)?|\s+or\s+)\[[^\]]+\])+)$/.exec(rest);
    if (nameListMatch) {
      const names = [...nameListMatch[1]!.matchAll(/\[([^\]]+)\]/g)].map((match) => match[1]!);
      filters.push({
        filter: "anyOf",
        filters: names.map((value) => ({ filter: "name", value })),
      });
      return filters;
    }
    const nameMatch = /^\[([^\]]+)\]$/i.exec(rest);
    if (nameMatch) {
      filters.push({ filter: "name", value: nameMatch[1]! });
      return filters;
    }
    // Name followed by more text (e.g., "[Name] with a cost of ..." already stripped)
    const nameStartMatch = /^\[([^\]]+)\]\s*/i.exec(rest);
    if (nameStartMatch && rest.length === nameStartMatch[0].length) {
      filters.push({ filter: "name", value: nameStartMatch[1]! });
      return filters;
    }
    if (nameStartMatch) {
      filters.push({ filter: "name", value: nameStartMatch[1]! });
      rest = rest.slice(nameStartMatch[0].length);
    }
  }

  // Extract card category: "Character card", "Character", "Stage", "Event card"
  // Also handles "card or <color> <type>" compound (strips the "or" part for best-effort)
  let catRest = rest
    .trim()
    .replace(
      /\s+or\s+(?:red|green|blue|purple|black|yellow)\s+(?:Character|Event|Stage)\s*(?:cards?)?$/i,
      "",
    )
    .trim();
  const categoryMatch = /^(Character|Stage|Event|card)\s*(cards?)?$/i.exec(catRest);
  if (categoryMatch) {
    const cat = categoryMatch[1]!.toLowerCase();
    if (cat === "character" || cat === "event" || cat === "stage") {
      filters.push({ filter: "cardCategory", value: cat });
    }
    // "card" alone = any card type, no filter needed
  }

  return filters;
}

/**
 * Parse a "set <target> as active" action clause.
 */
export function parseSetActiveAction(text: string): SetActiveAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // The action orchestrator preserves this suffix in a delayed-action wrapper.
  // Strip it here so this parser can focus on the underlying target and action.
  const stripped = trimmed.replace(/\s+at\s+the\s+end\s+of\s+this\s+turn$/i, "");

  // "Set all of your DON!! cards as active"
  if (/^set\s+all\s+(?:of\s+)?your\s+DON!!\s+cards?\s+as\s+active$/i.test(stripped)) {
    return {
      action: "setActive",
      target: { player: "self", zones: ["costArea"], count: { amount: "all" } },
    };
  }

  const match = /^set\s+(.+?)\s+as\s+active$/i.exec(stripped);
  if (!match) return null;

  const targetText = match[1]!;

  // "this Character or up to N of your DON!! cards" — compound choice
  const compoundOrMatch = /^this\s+(Character|Leader)\s+or\s+(.+)$/i.exec(targetText);
  if (compoundOrMatch) {
    const secondTarget = parseTarget(compoundOrMatch[2]!);
    if (secondTarget) {
      return {
        action: "setActive",
        target: secondTarget, // Use the DON!! target; self is implicit
      };
    }
  }

  // "this Character/Leader/Stage"
  const selfMatch = /^this\s+(Character|Leader|Stage)$/i.exec(targetText);
  if (selfMatch) {
    const zone = mapZoneNoun(selfMatch[1]!);
    if (!zone) return null;
    return {
      action: "setActive",
      target: { player: "self", zones: [zone], count: { amount: 1 }, self: true },
    };
  }

  // "your Leader" or "your {Trait} type Leader"
  const leaderMatch = /^your\s+(?:(.+?)\s+)?Leader$/i.exec(targetText);
  if (leaderMatch) {
    const target: Target = { player: "self", zones: ["leader"], count: { amount: 1 } };
    if (leaderMatch[1]) {
      const traitMatch = /^[{[["\u201c]([^}\]"\u201d]+)[}\]"\u201d]\s+type$/i.exec(leaderMatch[1]);
      if (traitMatch) {
        target.filters = [{ filter: "trait", value: traitMatch[1]!, match: "includes" }];
      }
    }
    return { action: "setActive", target };
  }

  const explicitTarget = parseTarget(targetText);
  const target = explicitTarget ?? parseTargetWithoutPlayer(targetText);
  if (!target) return null;
  const ownedTarget = explicitTarget ? target : { ...target, player: "self" as const };

  // A named generic "card" can refer to a Leader or Character with that name,
  // but not to a Stage or DON!! card. OP03-036's official Q&A confirms this
  // scope for "your [Kuro] cards".
  if (
    /^up\s+to\s+\d+\s+of\s+your\s+\[[^\]]+\]\s+cards?$/i.test(targetText) &&
    target.filters?.some((filter) => filter.filter === "name")
  ) {
    return { action: "setActive", target: { ...ownedTarget, zones: ["leader", "character"] } };
  }

  return { action: "setActive", target: ownedTarget };
}

/**
 * Parse "Up to N of your opponent's rested Characters ... will not become active
 * in your opponent's next Refresh Phase" action clause.
 *
 * Also handles self-freeze: "this Character will not become active in your next Refresh Phase".
 */
export function parseFreezeAction(text: string): FreezeAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  const bothPlayersRefreshMatch =
    /^all\s+Characters\s+with\s+a\s+cost\s+of\s+(\d+)\s+or\s+(less|more)\s+do\s+not\s+become\s+active\s+in\s+your\s+and\s+your\s+opponent's\s+Refresh\s+Phases$/i.exec(
      trimmed,
    );
  if (bothPlayersRefreshMatch) {
    return {
      action: "freeze",
      target: {
        player: "both",
        zones: ["character"],
        count: { amount: "all" },
        filters: [
          {
            filter: "cost",
            comparison: parseComparison(bothPlayersRefreshMatch[2]),
            value: parseInt(bothPlayersRefreshMatch[1]!, 10),
          },
        ],
      },
    };
  }

  const nextRefreshMatch =
    /^Up\s+to\s+(\d+)\s+of\s+your\s+opponent's\s+Characters\s+with\s+a\s+cost\s+of\s+(\d+)(?:\s+or\s+(less|more))?\s+will\s+not\s+become\s+active\s+in\s+the\s+next\s+Refresh\s+Phase$/i.exec(
      trimmed,
    );
  if (nextRefreshMatch) {
    return {
      action: "freeze",
      target: {
        player: "opponent",
        zones: ["character"],
        count: { amount: parseInt(nextRefreshMatch[1]!, 10), upTo: true },
        filters: [
          {
            filter: "cost",
            comparison: nextRefreshMatch[3] ? parseComparison(nextRefreshMatch[3]) : "eq",
            value: parseInt(nextRefreshMatch[2]!, 10),
          },
        ],
      },
    };
  }

  // Self-freeze: "this Character/the selected Character will not become active in your next Refresh Phase"
  const selfFreezeMatch =
    /^(this|the selected)\s+Character\s+will\s+not\s+become\s+active\s+in\s+your\s+next\s+Refresh\s+Phase$/i.exec(
      trimmed,
    );
  if (selfFreezeMatch) {
    return {
      action: "freeze",
      target: {
        player: "self",
        zones: ["character"],
        count: { amount: 1 },
        ...(selfFreezeMatch[1]!.toLowerCase() === "this" && { self: true }),
      },
      ...(selfFreezeMatch[1]!.toLowerCase() === "the selected" && {
        previousActionTargets: true,
      }),
    };
  }

  // "All of your opponent's rested Characters (with ...) will not become active in your opponent's next Refresh Phase"
  const allOpponentMatch =
    /^All\s+(?:of\s+)?your\s+opponent's\s+rested\s+Characters?\s*(?:with\s+(.+?)\s+)?will\s+not\s+become\s+active\s+in\s+your\s+opponent's\s+next\s+Refresh\s+Phase$/i.exec(
      trimmed,
    );
  if (allOpponentMatch) {
    const filters: TargetFilter[] = [{ filter: "state", value: "rested" }];
    if (allOpponentMatch[1]) {
      const costFilter = /a\s+cost\s+of\s+(\d+)\s+or\s+(less|more)/i.exec(allOpponentMatch[1]);
      if (costFilter) {
        filters.push({
          filter: "cost",
          comparison: parseComparison(costFilter[2]),
          value: parseInt(costFilter[1]!, 10),
        });
      }
    }
    return {
      action: "freeze",
      target: { player: "opponent", zones: ["character"], count: { amount: "all" }, filters },
    };
  }

  // Opponent freeze: "Up to [a total of] N of your opponent's rested [Leader and] Character(s)/Stages/cards/DON!! cards will not become active in your opponent's next Refresh Phase"
  const opponentMatch =
    /^Up\s+to\s+(?:a\s+total\s+of\s+)?(\d+)\s+of\s+your\s+opponent's\s+rested\s+(Leader\s+and\s+Character|Characters?\s+or\s+Stages?|Characters?(?:\s+or\s+DON!!\s+cards?)?|Character\s+or\s+DON!!\s+cards?|DON!!\s+cards?)\s*(?:cards?)?\s*(?:with\s+(.+?)\s+)?will\s+not\s+become\s+active\s+in\s+your\s+opponent's\s+next\s+Refresh\s+Phase$/i.exec(
      trimmed,
    );
  if (opponentMatch) {
    const amount = parseInt(opponentMatch[1]!, 10);
    const zonesText = opponentMatch[2]!.toLowerCase();
    const zones: Zone[] = zonesText.includes("leader")
      ? ["leader", "character"]
      : zonesText.includes("stage")
        ? ["character", "stage"]
        : zonesText.includes("character") && zonesText.includes("don")
          ? ["character", "costArea"]
          : zonesText.includes("don")
            ? ["costArea"]
            : ["character"];
    const filters: TargetFilter[] = [{ filter: "state", value: "rested" }];

    // Parse optional filter like "a cost of N or less"
    if (opponentMatch[3]) {
      const costFilter = /a\s+cost\s+of\s+(\d+)\s+or\s+(less|more)/i.exec(opponentMatch[3]);
      if (costFilter) {
        filters.push({
          filter: "cost",
          comparison: parseComparison(costFilter[2]),
          value: parseInt(costFilter[1]!, 10),
        });
      }
    }

    return {
      action: "freeze",
      target: {
        player: "opponent",
        zones,
        count: { amount, upTo: true },
        filters,
      },
    };
  }

  return null;
}

/**
 * Parse "trash this Character/Leader/Stage" as a standalone action
 * (distinct from the cost pattern; handles cases like "trash this Character at the end of this turn").
 */
export function parseTrashThisCardAction(text: string): TrashThisCardAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");
  if (
    /^trash\s+this\s+(?:Character|Leader|Stage)(?:\s+at\s+the\s+end\s+of\s+this\s+turn)?$/i.test(
      trimmed,
    )
  ) {
    return { action: "trashThisCard" };
  }
  return null;
}

/**
 * Parse "K.O. <target1> or <target2>" as a choice action (compound K.O. or targets).
 * e.g., "K.O. up to 1 of your opponent's Characters with a cost of 0 or your opponent's Stages with a cost of 3 or less"
 */
export function parseCompoundKoAction(text: string): Action | null {
  const trimmed = text.trim().replace(/\.+$/, "");
  const m = /^K\.O\.\s+(.+)$/i.exec(trimmed);
  if (!m) return null;

  // Try splitting on " or your opponent's " — the common pattern for compound K.O. targets
  const parts = m[1]!.split(/\s+or\s+(?=your\s+opponent's\s+)/i);
  if (parts.length !== 2) return null;

  const target1 = parseTarget(parts[0]!) ?? parseTargetWithoutPlayer(parts[0]!);
  const target2Text = parts[1]!;
  // Target2 might not have "up to N of" prefix — try adding "up to 1 of" for parsing
  const target2 =
    parseTarget(target2Text) ??
    parseTargetWithoutPlayer(target2Text) ??
    parseTarget("up to 1 of " + target2Text);
  if (!target1 || !target2) return null;

  return {
    action: "choice",
    options: [[{ action: "ko", target: target1 }], [{ action: "ko", target: target2 }]],
  };
}

/**
 * Parse compound play: "play up to 1 X and up to 1 Y from your hand" or
 * "play up to 1 X and play up to 1 Y" spanning "and" connectors.
 */
export function parseCompoundPlayAction(text: string): Action[] | null {
  const trimmed = text.trim().replace(/\.+$/, "");
  // "play up to 1 {Trait} type Character card with a cost of N or less and [play] up to 1 {Trait} type Character card with a cost of M or less [from your hand/trash]"
  const m = /^play\s+(up to \d+\s+.+?)\s+and\s+(?:play\s+)?(up to \d+\s+.+?)$/i.exec(trimmed);
  if (!m) return null;

  // Try parsing second part first (it likely has the source)
  let play2 = parsePlayAction("play " + m[2]!);
  let play1 = parsePlayAction("play " + m[1]!);

  // If first part has no source, inherit from second part
  if (!play1 && play2) {
    const sourceMatch =
      /\s+from\s+your\s+(hand(?:\s+or\s+trash)?|trash(?:\s+or\s+hand)?|deck)$/i.exec(m[2]!);
    if (sourceMatch) {
      play1 = parsePlayAction("play " + m[1]! + " from your " + sourceMatch[1]!);
    }
  }

  if (!play1 || !play2) return null;
  return [play1, play2];
}
