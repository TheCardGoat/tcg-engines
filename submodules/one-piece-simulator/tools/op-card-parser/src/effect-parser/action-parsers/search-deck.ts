import type { Action, TargetFilter } from "@tcg/op-types";
import { parseComparison } from "../helpers.ts";

// ── Search action parsing ──

type SearchAction = Extract<Action, { action: "search" }>;

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
function parsePlayDescription(text: string): TargetFilter[] | null {
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
 * Parse a "Look at N cards from the top of your deck; reveal up to M <desc>
 * and add it/them to your hand and place the rest at the bottom/top of your
 * deck in any order" pattern.
 *
 * This parser works on the FULL action text (before clause splitting) because
 * the "and add" / "and place" connectors would otherwise be split apart.
 *
 * Returns the parsed SearchAction plus any remaining text after the match.
 */
export function parseSearchAction(
  text: string,
): { action: SearchAction; remaining: string } | null {
  const trimmed = text.trim();

  // Match the "look at [up to] N cards from the top of your deck" prefix
  // Also handles "look at the top N cards of your deck" and
  // "Reveal N card(s) from the top of your deck"
  const lookPrefix =
    /^(?:look at (?:up to )?(?:(\d+) cards? from the top of your deck|the top (\d+) cards? of your deck)|reveal\s+(\d+)\s+cards?\s+from\s+the\s+top\s+of\s+your\s+deck)[;,]?\s*(?:and\s+)?/i;
  const lookMatch = lookPrefix.exec(trimmed);
  if (!lookMatch) return null;

  const lookCount = parseInt((lookMatch[1] ?? lookMatch[2] ?? lookMatch[3])!, 10);
  const afterLook = trimmed.slice(lookMatch[0].length);

  // Remainder pattern: "place the rest at the (bottom|top) of your deck in any order" or "trash the rest"
  const REMAINDER_RE =
    /(?:\s+and|\.\s*Then,)\s+(?:place\s+the\s+rest\s+at\s+the\s+(bottom|top)\s+of\s+your\s+deck(?:\s+in\s+any\s+order)?|trash\s+the\s+rest)/i;

  // Pattern 1: "reveal up to N / a total of N <desc> and add it/them to your hand [and|. Then,] <remainder>"
  const revealPattern =
    /^reveal\s+(?:up\s+to|a\s+total\s+of)\s+(\d+)\s+(.+?)\s+and\s+add\s+(?:it|them)\s+to\s+your\s+hand/i;
  const revealMatch = revealPattern.exec(afterLook);
  if (revealMatch) {
    const afterReveal = afterLook.slice(revealMatch[0].length);
    const remainderMatch = REMAINDER_RE.exec(afterReveal);
    // Also match if remainder is right after revealMatch (no afterReveal gap)
    const fullRemainderMatch = REMAINDER_RE.exec(afterLook.slice(revealMatch[0].length - 1));
    const remMatch = remainderMatch ?? fullRemainderMatch;
    const remainderPosition: "top" | "bottom" | "trash" = remMatch
      ? remMatch[1]
        ? (remMatch[1].toLowerCase() as "top" | "bottom")
        : "trash"
      : "bottom";

    const totalConsumed = remMatch
      ? revealMatch[0].length +
        (remainderMatch
          ? remainderMatch.index + remainderMatch[0].length
          : fullRemainderMatch!.index + fullRemainderMatch![0].length - 1)
      : revealMatch[0].length;
    let remaining = afterLook.slice(totalConsumed).trim();
    remaining = remaining.replace(/^\.?\s*(?:Then,\s*)?/i, "").trim();
    remaining = remaining.replace(/^(?:and\s+|,\s*and\s+)/i, "").trim();

    const filters = parsePlayDescription(revealMatch[2]!);
    const action: SearchAction = {
      action: "search",
      lookCount,
      source: { player: "self", zone: "deck" },
      revealCount: { amount: parseInt(revealMatch[1]!, 10), upTo: true },
      ...(filters && filters.length > 0 && { revealFilters: filters }),
      revealDestination: "hand",
      remainderPosition,
    };
    return { action, remaining };
  }

  // Pattern 2: "play up to N <desc> [. Then, <remainder>]"
  const playPattern =
    /^play\s+up\s+to\s+(\d+)\s+(.+?)(?=(?:\s+and|\.\s*Then,)\s+(?:place|trash)|\.?\s*$)/i;
  const playMatch = playPattern.exec(afterLook);
  if (playMatch) {
    const afterPlay = afterLook.slice(playMatch[0].length);
    const remainderMatch = REMAINDER_RE.exec(afterPlay);
    const remainderPosition: "top" | "bottom" | "trash" = remainderMatch
      ? remainderMatch[1]
        ? (remainderMatch[1].toLowerCase() as "top" | "bottom")
        : "trash"
      : "bottom";

    const totalConsumed = remainderMatch
      ? playMatch[0].length + remainderMatch.index + remainderMatch[0].length
      : playMatch[0].length;
    let remaining = afterLook.slice(totalConsumed).trim();
    remaining = remaining.replace(/^\.?\s*(?:Then,\s*)?/i, "").trim();
    remaining = remaining.replace(/^(?:and\s+|,\s*and\s+)/i, "").trim();

    const filters = parsePlayDescription(playMatch[2]!);
    const action: SearchAction = {
      action: "search",
      lookCount,
      source: { player: "self", zone: "deck" },
      revealCount: { amount: parseInt(playMatch[1]!, 10), upTo: true },
      ...(filters && filters.length > 0 && { revealFilters: filters }),
      revealDestination: "character",
      remainderPosition,
    };
    return { action, remaining };
  }

  // Pattern 3: "add up to N card(s) to your hand [. Then, <remainder>]"
  const addPattern = /^add\s+up\s+to\s+(\d+)\s+cards?\s+to\s+your\s+hand/i;
  const addMatch = addPattern.exec(afterLook);
  if (addMatch) {
    const afterAdd = afterLook.slice(addMatch[0].length);
    const remainderMatch = REMAINDER_RE.exec(afterAdd);
    const remainderPosition: "top" | "bottom" | "trash" = remainderMatch
      ? remainderMatch[1]
        ? (remainderMatch[1].toLowerCase() as "top" | "bottom")
        : "trash"
      : "bottom";

    const totalConsumed = remainderMatch
      ? addMatch[0].length + remainderMatch.index + remainderMatch[0].length
      : addMatch[0].length;
    let remaining = afterLook.slice(totalConsumed).trim();
    remaining = remaining.replace(/^\.?\s*(?:Then,\s*)?/i, "").trim();
    remaining = remaining.replace(/^(?:and\s+|,\s*and\s+)/i, "").trim();

    const action: SearchAction = {
      action: "search",
      lookCount,
      source: { player: "self", zone: "deck" },
      revealCount: { amount: parseInt(addMatch[1]!, 10), upTo: true },
      revealDestination: "hand",
      remainderPosition,
    };
    return { action, remaining };
  }

  return null;
}

// ── TrashFromDeck action parsing ──

type TrashFromDeckAction = Extract<Action, { action: "trashFromDeck" }>;

/**
 * Parse a "trash N cards from the top of your/opponent's deck" action clause.
 *
 * Handles:
 * - "Trash 2 cards from the top of your deck"
 * - "trash 3 cards from the top of your deck"
 * - "you may trash 2 cards from the top of your deck"
 */
export function parseTrashFromDeckAction(text: string): TrashFromDeckAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  const match =
    /^(?:you\s+may\s+)?trash\s+(\d+)\s+cards?\s+from\s+the\s+top\s+of\s+(your|your\s+opponent's)\s+deck$/i.exec(
      trimmed,
    );
  if (!match) return null;

  return {
    action: "trashFromDeck",
    player: match[2]!.toLowerCase() === "your" ? "self" : "opponent",
    amount: parseInt(match[1]!, 10),
  };
}

// ── RearrangeDeck action parsing ──

type RearrangeDeckAction = Extract<Action, { action: "rearrangeDeck" }>;

/**
 * Parse a "Look at N cards from the top of your deck and place them at the
 * top or bottom of the deck in any order" action clause.
 */
export function parseRearrangeDeckAction(text: string): RearrangeDeckAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // Pattern 1: "Look at N cards from the top of your deck and place them at the top or bottom of the deck in any order"
  const match =
    /^Look at (\d+) cards? from the top of your deck and place them at the (top or bottom|top|bottom) of the deck in any order$/i.exec(
      trimmed,
    );
  if (match) {
    const posText = match[2]!.toLowerCase();
    let position: "top" | "bottom" | "topOrBottom";
    if (posText === "top or bottom") position = "topOrBottom";
    else position = posText as "top" | "bottom";

    return {
      action: "rearrangeDeck",
      player: "self",
      count: parseInt(match[1]!, 10),
      position,
    };
  }

  // Pattern 2: "Look at N cards from the top of your deck and trash up to M cards. Then, place the rest at the bottom of your deck in any order"
  const lookTrashMatch =
    /^Look at (\d+) cards? from the top of your deck and trash (?:up to )?(\d+) cards?\.?\s*(?:Then,\s*)?place the rest at the (bottom|top) of your deck(?:\s+in\s+any\s+order)?$/i.exec(
      trimmed,
    );
  if (lookTrashMatch) {
    const posText = lookTrashMatch[3]!.toLowerCase();
    return {
      action: "rearrangeDeck",
      player: "self",
      count: parseInt(lookTrashMatch[1]!, 10),
      position: posText as "top" | "bottom",
    };
  }

  // Pattern 2b: "Look at N cards from the top of your deck and place them at the top of your deck in any order"
  const lookPlaceMatch =
    /^Look at (\d+) cards? from the top of your deck and place them at the (top or bottom|top|bottom) of your deck(?:\s+in\s+any\s+order)?$/i.exec(
      trimmed,
    );
  if (lookPlaceMatch) {
    const posText = lookPlaceMatch[2]!.toLowerCase();
    let position: "top" | "bottom" | "topOrBottom";
    if (posText === "top or bottom") position = "topOrBottom";
    else position = posText as "top" | "bottom";

    return {
      action: "rearrangeDeck",
      player: "self",
      count: parseInt(lookPlaceMatch[1]!, 10),
      position,
    };
  }

  // Pattern 3: "Turn all of your Life cards face-down" (rearrange life area)
  if (/^turn\s+all\s+(?:of\s+)?your\s+Life\s+cards?\s+face-down$/i.test(trimmed)) {
    return {
      action: "rearrangeDeck",
      player: "self",
      count: 99,
      position: "top",
    };
  }

  return null;
}

// ── Shuffle deck (standalone) ──

export function parseShuffleDeckAction(text: string): RearrangeDeckAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");
  if (/^shuffle\s+your\s+deck$/i.test(trimmed)) {
    return { action: "rearrangeDeck", player: "self", count: 0, position: "top" };
  }
  return null;
}

// ── Reveal from deck (standalone — for "Reveal 1 card from the top of your deck. If the revealed card...") ──

export function parseRevealFromDeckAction(text: string): RearrangeDeckAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "Reveal N card(s) from the top of your deck"
  const m = /^reveal\s+(\d+)\s+cards?\s+from\s+the\s+top\s+of\s+your\s+deck$/i.exec(trimmed);
  if (!m) return null;

  return {
    action: "rearrangeDeck",
    player: "self",
    count: parseInt(m[1]!, 10),
    position: "top",
  };
}

// ── Reveal from deck and add to hand ──

export function parseRevealFromDeckToHandAction(text: string): SearchAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "Reveal up to N [Name/desc] from your deck and add it/them to your hand"
  const m =
    /^reveal\s+(?:up\s+to\s+)?(\d+)\s+(.+?)\s+from\s+your\s+deck\s+and\s+add\s+(?:it|them)\s+to\s+your\s+hand$/i.exec(
      trimmed,
    );
  if (!m) return null;

  const amount = parseInt(m[1]!, 10);
  const upTo = /^reveal\s+up\s+to/i.test(trimmed);
  const desc = m[2]!;

  const filters = parsePlayDescription(desc);
  if (!filters) return null;

  return {
    action: "search",
    lookCount: 0, // 0 = search entire deck
    source: { player: "self", zone: "deck" },
    revealCount: { amount, ...(upTo && { upTo: true }) },
    ...(filters.length > 0 && { revealFilters: filters }),
    revealDestination: "hand",
    remainderPosition: "bottom", // deck is shuffled after
  };
}
