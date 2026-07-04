import type { Action, Target, TargetFilter, Zone } from "@tcg/op-types";
import { mapZoneNoun, parseComparison } from "../helpers.ts";
import { parseTarget, parseTargetWithoutPlayer } from "../target-parser.ts";

type KoAction = Extract<Action, { action: "ko" }>;
type RestAction = Extract<Action, { action: "rest" }>;
type TrashFromFieldAction = Extract<Action, { action: "trashFromField" }>;
type PlayAction = Extract<Action, { action: "play" }>;
type SetActiveAction = Extract<Action, { action: "setActive" }>;
type FreezeAction = Extract<Action, { action: "freeze" }>;
type TrashThisCardAction = Extract<Action, { action: "trashThisCard" }>;

/**
 * Parse a "Rest <target>" action clause.
 */
export function parseRestAction(text: string): RestAction | null {
  const match = /^rest\s+(.+)$/i.exec(text.trim());
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

  const target = parseTarget(targetText) ?? parseTargetWithoutPlayer(targetText);
  if (!target) return null;

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
  const match = /^play\s+(.+)$/i.exec(text.trim().replace(/\.+$/, ""));
  if (!match) return null;

  let rest = match[1]!;

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
      ...(thisCardMatch[2] && { playState: "rested" as const }),
    };
  }

  // Extract play state: "rested" at the end
  let playState: PlayAction["playState"];
  if (/\s+rested$/i.test(rest)) {
    playState = "rested";
    rest = rest.replace(/\s+rested$/i, "");
  }

  // Extract source: "from your hand/trash/deck" or "from your hand or trash"
  // Source may appear before "with a cost..." so also try mid-string
  let zone: Zone | Zone[];
  const multiSourceMatch = /\s+from\s+your\s+(hand)\s+or\s+(trash|deck)$/i.exec(rest);
  if (multiSourceMatch) {
    zone = [multiSourceMatch[1]!.toLowerCase() as Zone, multiSourceMatch[2]!.toLowerCase() as Zone];
    rest = rest.slice(0, multiSourceMatch.index).trim();
  } else {
    const sourceMatch = /\s+from\s+your\s+(hand|trash|deck)(?=\s+with\s+|\s*$)/i.exec(rest);
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

  // Parse the card description into filters
  const filters = parsePlayDescription(rest);
  if (!filters) return null;

  return {
    action: "play",
    source: { player: "self", zone },
    count: { amount, ...(upTo && { upTo: true }) },
    ...(filters.length > 0 && { filters }),
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
  let rest = text.trim();

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
    filters.push({ filter: "hasEffectType", value: "onPlay", negate: true });
    rest = rest.replace(/\s+and no base effect$/i, "").trim();
  }

  // Extract "and a [Trigger]"
  if (/\s+and a \[Trigger\]$/i.test(rest)) {
    filters.push({ filter: "hasTrigger", value: true });
    rest = rest.replace(/\s+and a \[Trigger\]$/i, "").trim();
  }

  // Extract "with a cost of N (or less|more)?" or "with N power (or less|more)?"
  const costMatch = /\s+with a cost of (\d+)(?:\s+or\s+(less|more))?$/i.exec(rest);
  if (costMatch) {
    filters.push({
      filter: "cost",
      comparison: parseComparison(costMatch[2]),
      value: parseInt(costMatch[1]!, 10),
    });
    rest = rest.slice(0, costMatch.index).trim();
  }

  const powerMatch = /\s+with (\d+) power(?:\s+or\s+(less|more))?$/i.exec(rest);
  if (!costMatch && powerMatch) {
    filters.push({
      filter: "power",
      comparison: parseComparison(powerMatch[2]),
      value: parseInt(powerMatch[1]!, 10),
    });
    rest = rest.slice(0, powerMatch.index).trim();
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
    for (const part of traitParts) {
      const trait = part
        .replace(/^[[\]{}"\u201c\u201d]/g, "")
        .replace(/[[\]{}"\u201c\u201d]$/g, "")
        .trim();
      if (trait) filters.push({ filter: "trait", value: trait });
    }
    rest = rest.slice(traitMatch[0].length);
  }

  // If no trait, check for name: "[Name]" (not followed by "type")
  if (!traitMatch) {
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

  // Strip optional trailing "at the end of this turn" timing
  const stripped = trimmed.replace(/\s+at\s+the\s+end\s+of\s+this\s+turn$/i, "");

  // "set X and your Leader as active" — compound target
  const compoundSetActive = /^set\s+(.+?)\s+and\s+(your\s+Leader)\s+as\s+active$/i.exec(stripped);
  if (compoundSetActive) {
    const target1 = parseTarget(compoundSetActive[1]!);
    if (target1) {
      target1.zones = [...target1.zones, "leader"];
      return { action: "setActive", target: target1 };
    }
  }

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
        target.filters = [{ filter: "trait", value: traitMatch[1]! }];
      }
    }
    return { action: "setActive", target };
  }

  const target = parseTarget(targetText) ?? parseTargetWithoutPlayer(targetText);
  if (!target) return null;

  return { action: "setActive", target };
}

/**
 * Parse "Up to N of your opponent's rested Characters ... will not become active
 * in your opponent's next Refresh Phase" action clause.
 *
 * Also handles self-freeze: "this Character will not become active in your next Refresh Phase".
 */
export function parseFreezeAction(text: string): FreezeAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // Self-freeze: "this Character/the selected Character will not become active in your next Refresh Phase"
  if (
    /^(?:this|the selected)\s+Character\s+will\s+not\s+become\s+active\s+in\s+your\s+next\s+Refresh\s+Phase$/i.test(
      trimmed,
    )
  ) {
    return {
      action: "freeze",
      target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
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

  // Opponent freeze: "Up to [a total of] N of your opponent's rested [Leader and] Character(s)/cards/DON!! cards will not become active in your opponent's next Refresh Phase"
  const opponentMatch =
    /^Up\s+to\s+(?:a\s+total\s+of\s+)?(\d+)\s+of\s+your\s+opponent's\s+rested\s+(Leader\s+and\s+Character|Characters?(?:\s+or\s+DON!!\s+cards?)?|Character\s+or\s+DON!!\s+cards?|DON!!\s+cards?)\s*(?:cards?)?\s*(?:with\s+(.+?)\s+)?will\s+not\s+become\s+active\s+in\s+your\s+opponent's\s+next\s+Refresh\s+Phase$/i.exec(
      trimmed,
    );
  if (opponentMatch) {
    const amount = parseInt(opponentMatch[1]!, 10);
    const zonesText = opponentMatch[2]!.toLowerCase();
    const zones: Zone[] = zonesText.includes("leader")
      ? ["leader", "character"]
      : zonesText.includes("don")
        ? ["character", "costArea"]
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
