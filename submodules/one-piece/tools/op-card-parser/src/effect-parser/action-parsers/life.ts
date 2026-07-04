import type { Action, TargetFilter, Zone } from "@tcg/op-types";
import { parseZoneList } from "../helpers.ts";
import { extractTargetFilters } from "../target-parser.ts";

// ── AddToLife action parsing ──

type AddToLifeAction = Extract<Action, { action: "addToLife" }>;

/**
 * Parse an "add up to N card(s) from the top of your deck to the top of your Life cards" action.
 */
export function parseAddToLifeAction(text: string): AddToLifeAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // Pattern 1: "add up to N card(s) from the top of your deck to the (top|bottom) of your Life cards"
  const deckMatch =
    /^add\s+up\s+to\s+(\d+)\s+cards?\s+from\s+the\s+top\s+of\s+your\s+deck\s+to\s+the\s+(top|bottom)\s+of\s+your\s+Life\s+cards?$/i.exec(
      trimmed,
    );
  if (deckMatch) {
    return {
      action: "addToLife",
      target: {
        player: "self",
        zones: ["deck"],
        count: { amount: parseInt(deckMatch[1]!, 10), upTo: true },
      },
      position: deckMatch[2]!.toLowerCase() as "top" | "bottom",
    };
  }

  // Pattern 2: "add up to N [filters] card(s) [with X] from your hand to the (top|bottom) of your Life cards [face-up]"
  const handMatch =
    /^add\s+up\s+to\s+(\d+)\s+(.+?)\s+cards?\s+(?:with\s+a\s+\[Trigger\]\s+)?from\s+your\s+hand\s+to\s+the\s+(top|bottom)\s+of\s+your\s+Life\s+cards?(?:\s+face-up)?$/i.exec(
      trimmed,
    );
  if (handMatch) {
    const faceUp = /face-up$/i.test(trimmed);
    const hasTrigger = /with\s+a\s+\[Trigger\]/i.test(trimmed);
    const filters: TargetFilter[] = [];
    const filterText = handMatch[2]!;

    // Parse trait/name filters from the middle portion
    const traitMatch =
      /(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type(?:\s+Character)?/i.exec(filterText);
    if (traitMatch) {
      filters.push({ filter: "trait", value: traitMatch[1]! });
    }
    const catMatch = /\bCharacter\b/i.exec(filterText);
    if (catMatch) {
      filters.push({ filter: "cardCategory", value: "character" });
    }
    if (hasTrigger) {
      filters.push({ filter: "hasTrigger", value: true });
    }

    return {
      action: "addToLife",
      target: {
        player: "self",
        zones: ["hand"],
        count: { amount: parseInt(handMatch[1]!, 10), upTo: true },
        ...(filters.length > 0 && { filters }),
      },
      position: handMatch[3]!.toLowerCase() as "top" | "bottom",
      ...(faceUp && { faceUp: true }),
    };
  }

  // Pattern 3: "add up to N card(s) from your hand to the (top|bottom) of your Life cards"
  const handSimpleMatch =
    /^add\s+up\s+to\s+(\d+)\s+cards?\s+from\s+your\s+hand\s+to\s+the\s+(top|bottom)\s+of\s+your\s+Life\s+cards?$/i.exec(
      trimmed,
    );
  if (handSimpleMatch) {
    return {
      action: "addToLife",
      target: {
        player: "self",
        zones: ["hand"],
        count: { amount: parseInt(handSimpleMatch[1]!, 10), upTo: true },
      },
      position: handSimpleMatch[2]!.toLowerCase() as "top" | "bottom",
    };
  }

  // Pattern 4: "add N card(s) from the top of your deck to the (top|bottom) of your Life cards (at the end of this turn)?" (without "up to")
  const deckNoUpTo =
    /^add\s+(\d+)\s+cards?\s+from\s+the\s+top\s+of\s+your\s+deck\s+to\s+the\s+(top|bottom)\s+of\s+your\s+Life\s+cards?(?:\s+at\s+the\s+end\s+of\s+this\s+turn)?$/i.exec(
      trimmed,
    );
  if (deckNoUpTo) {
    return {
      action: "addToLife",
      target: {
        player: "self",
        zones: ["deck"],
        count: { amount: parseInt(deckNoUpTo[1]!, 10) },
      },
      position: deckNoUpTo[2]!.toLowerCase() as "top" | "bottom",
    };
  }

  // Pattern 5: "Add up to 1 of your [opponent's] Characters [with filters] to the (top|bottom) [or (top|bottom)] of [the owner's/your opponent's] Life cards [face-up]"
  const charToLifeMatch =
    /^add\s+(?:up\s+to\s+)?(\d+)\s+(?:of\s+)?(your(?:\s+opponent's)?)\s+(.+?)\s+to\s+the\s+(top|bottom|top or bottom)\s+of\s+(?:the\s+owner's|your\s+opponent's|your)\s+Life\s+cards?\s*(?:face-up)?$/i.exec(
      trimmed,
    );
  if (charToLifeMatch) {
    const amount = parseInt(charToLifeMatch[1]!, 10);
    const upTo = /up\s+to/i.test(trimmed);
    const player = /opponent/i.test(charToLifeMatch[2]!) ? "opponent" : "self";
    const faceUp = /face-up$/i.test(trimmed);
    const filterText = charToLifeMatch[3]!;
    const posText = charToLifeMatch[4]!.toLowerCase();
    const position = (posText === "top or bottom" ? "top" : posText) as "top" | "bottom";

    const { zonesText, filters } = extractTargetFilters(filterText);

    // Strip trait prefix from zones text: "[Animal] or [SMILE] type Characters" → "Characters"
    let finalZonesText = zonesText;
    const traitZoneMatch =
      /^(?:(?:[[{"\u201c][^\]}\u201d"]+[\]}\u201d"](?:\s+or\s+)?)+)\s+type\s+(.+)$/i.exec(
        finalZonesText,
      );
    if (traitZoneMatch) {
      const bracketRegex = /[[{"\u201c]([^\]}\u201d"]+)[\]}\u201d"]/g;
      let tMatch;
      while ((tMatch = bracketRegex.exec(zonesText)) !== null) {
        if (tMatch.index < zonesText.indexOf(" type ")) {
          filters.push({ filter: "trait", value: tMatch[1]! });
        }
      }
      finalZonesText = traitZoneMatch[1]!;
    }

    const zones = parseZoneList(finalZonesText);
    if (!zones) return null;

    return {
      action: "addToLife",
      target: {
        player: player as "self" | "opponent",
        zones,
        count: { amount, ...(upTo && { upTo: true }) },
        ...(filters.length > 0 && { filters }),
      },
      position,
      ...(faceUp && { faceUp: true }),
    };
  }

  // Pattern 6: "Add up to 1 Character with [filters] to the (top|bottom) of the owner's Life cards [face-up|face-down]"
  const charNoPlayerMatch =
    /^add\s+(?:up\s+to\s+)?(\d+)\s+(.+?)\s+to\s+the\s+(top|bottom|top or bottom)\s+of\s+the\s+owner[''\u2019]s\s+Life\s+cards?\s*(?:(face-up|face-down))?$/i.exec(
      trimmed,
    );
  if (charNoPlayerMatch) {
    const amount = parseInt(charNoPlayerMatch[1]!, 10);
    const upTo = /up\s+to/i.test(trimmed);
    const filterText = charNoPlayerMatch[2]!;
    const posText = charNoPlayerMatch[3]!.toLowerCase();
    const position = (posText === "top or bottom" ? "top" : posText) as "top" | "bottom";
    const face = charNoPlayerMatch[4]?.toLowerCase();

    const { zonesText, filters } = extractTargetFilters(filterText);
    const zones = parseZoneList(zonesText);
    // Default to character zone if zone parsing fails (common for "1 Character with ...")
    const finalZones = zones || ["character"];

    return {
      action: "addToLife",
      target: {
        player: "self",
        zones: finalZones as Zone[],
        count: { amount, ...(upTo && { upTo: true }) },
        ...(filters.length > 0 && { filters }),
      },
      position,
      ...(face === "face-up" && { faceUp: true }),
    };
  }

  return null;
}

// ── RemoveFromLife action parsing ──

type RemoveFromLifeAction = Extract<Action, { action: "removeFromLife" }>;

/**
 * Parse a "remove from life" action clause.
 *
 * Handles:
 * - "add 1 card from the top of your Life cards to your hand"
 * - "trash up to 1 card from the top of your opponent's Life cards"
 * - "Trash up to 1 card from the top of your opponent's Life cards"
 */
export function parseRemoveFromLifeAction(text: string): RemoveFromLifeAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "add N card(s) from the top [or bottom] of your Life cards to [your/the owner's] hand"
  const addMatch =
    /^add\s+(\d+)\s+cards?\s+from\s+the\s+(?:top(?:\s+or\s+bottom)?)\s+of\s+(your|your\s+opponent's)\s+Life\s+cards?\s+to\s+(?:your|the\s+owner[''\u2019]s)\s+hand$/i.exec(
      trimmed,
    );
  if (addMatch) {
    return {
      action: "removeFromLife",
      player: /opponent/i.test(addMatch[2]!) ? "opponent" : "self",
      count: { amount: parseInt(addMatch[1]!, 10) },
      destination: "hand",
    };
  }

  // "your opponent adds N card(s) from the top of their Life cards to their hand"
  const oppAddMatch =
    /^your\s+opponent\s+adds\s+(\d+)\s+cards?\s+from\s+the\s+top\s+of\s+their\s+Life\s+cards?\s+to\s+their\s+hand$/i.exec(
      trimmed,
    );
  if (oppAddMatch) {
    return {
      action: "removeFromLife",
      player: "opponent",
      count: { amount: parseInt(oppAddMatch[1]!, 10) },
      destination: "hand",
    };
  }

  // "add up to N card(s) from the top of your opponent's Life cards to the owner's hand"
  const addUpToOppMatch =
    /^add\s+up\s+to\s+(\d+)\s+cards?\s+from\s+the\s+top\s+of\s+your\s+opponent's\s+Life\s+cards?\s+to\s+the\s+owner[''\u2019]s\s+hand$/i.exec(
      trimmed,
    );
  if (addUpToOppMatch) {
    return {
      action: "removeFromLife",
      player: "opponent",
      count: { amount: parseInt(addUpToOppMatch[1]!, 10), upTo: true },
      destination: "hand",
    };
  }

  // "trash up to N card(s) from the top of your/your opponent's Life cards"
  const trashMatch =
    /^trash\s+(?:up\s+to\s+)?(\d+)\s+cards?\s+from\s+the\s+top\s+of\s+(your\s+opponent[''\u2019]s|your)\s+Life\s+cards?$/i.exec(
      trimmed,
    );
  if (trashMatch) {
    const upTo = /up\s+to/i.test(trimmed);
    return {
      action: "removeFromLife",
      player: /opponent/i.test(trashMatch[2]!) ? "opponent" : "self",
      count: { amount: parseInt(trashMatch[1]!, 10), ...(upTo && { upTo: true }) },
      destination: "trash",
    };
  }

  // "trash N card(s) from the top of each of your and your opponent's Life cards"
  const trashEachMatch =
    /^trash\s+(?:up\s+to\s+)?(\d+)\s+cards?\s+from\s+the\s+top\s+of\s+each\s+of\s+your\s+and\s+your\s+opponent[''\u2019]s\s+Life\s+cards?$/i.exec(
      trimmed,
    );
  if (trashEachMatch) {
    return {
      action: "removeFromLife",
      player: "self", // affects both players; model as self for simplicity
      count: { amount: parseInt(trashEachMatch[1]!, 10) },
      destination: "trash",
    };
  }

  return null;
}

// ── Life card look/place ──

type RearrangeDeckAction = Extract<Action, { action: "rearrangeDeck" }>;

export function parseLifeCardLookAction(text: string): RearrangeDeckAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "Look at up to N card(s) from the top of your or your opponent's Life cards and place it/them at the top or bottom of the Life cards"
  // Also: "Look at up to N card(s) from the top of your or your opponent's Life cards, and place it at the top or bottom of the Life cards"
  const m =
    /^look\s+at\s+(?:up\s+to\s+)?(\d+)\s+cards?\s+from\s+the\s+top\s+of\s+(?:your(?:\s+or\s+your\s+opponent[''\u2019]s)?|your\s+opponent[''\u2019]s)\s+Life\s+cards?,?\s*(?:and\s+)?place\s+(?:it|them)\s+at\s+the\s+(top\s+or\s+bottom|top|bottom)\s+of\s+(?:the\s+)?Life\s+cards?$/i.exec(
      trimmed,
    );
  if (m) {
    const posText = m[2]!.toLowerCase();
    const position: "top" | "bottom" | "topOrBottom" =
      posText === "top or bottom" ? "topOrBottom" : (posText as "top" | "bottom");

    return {
      action: "rearrangeDeck",
      player: "self", // affects life area, not deck, but closest match
      count: parseInt(m[1]!, 10),
      position,
    };
  }

  // "Look at all of your (opponent's)? Life cards and place them back in (their|your) Life area in any order"
  const allLifeMatch =
    /^look\s+at\s+all\s+(?:of\s+)?(your(?:\s+opponent[''\u2019]s)?)\s+Life\s+cards?\s+and\s+place\s+them\s+back\s+in\s+(?:their|the|your)\s+Life\s+area\s+in\s+any\s+order$/i.exec(
      trimmed,
    );
  if (allLifeMatch) {
    const player = /opponent/i.test(allLifeMatch[1]!) ? "opponent" : "self";
    return {
      action: "rearrangeDeck",
      player,
      count: 99, // "all" — rearrange entire life area
      position: "topOrBottom",
    };
  }

  return null;
}

// ── "Place opponent's Character to Life" ──

export function parsePlaceCharacterToLifeAction(text: string): AddToLifeAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "Place up to N of your opponent's Characters with ... at the top or bottom of your opponent's Life cards face-up"
  const m =
    /^place\s+(?:up\s+to\s+)?(\d+)\s+(?:of\s+)?(your(?:\s+opponent[''\u2019]s)?)\s+(.+?)\s+at\s+the\s+(top\s+or\s+bottom|top|bottom)\s+of\s+(?:your\s+opponent[''\u2019]s|the\s+owner[''\u2019]s|your)\s+Life\s+cards?\s*(?:(face-up|face-down))?$/i.exec(
      trimmed,
    );
  if (!m) return null;

  const amount = parseInt(m[1]!, 10);
  const upTo = /^place\s+up\s+to/i.test(trimmed);
  const player = /opponent/i.test(m[2]!) ? "opponent" : "self";
  const filterText = m[3]!;
  const posText = m[4]!.toLowerCase();
  const position = (posText === "top or bottom" ? "top" : posText) as "top" | "bottom";
  const faceUp = m[5]?.toLowerCase() === "face-up";

  const { zonesText, filters } = extractTargetFilters(filterText);
  const zones = parseZoneList(zonesText) || ["character"];

  return {
    action: "addToLife",
    target: {
      player: player as "self" | "opponent",
      zones: zones as Zone[],
      count: { amount, ...(upTo && { upTo: true }) },
      ...(filters.length > 0 && { filters }),
    },
    position,
    ...(faceUp && { faceUp: true }),
  };
}
