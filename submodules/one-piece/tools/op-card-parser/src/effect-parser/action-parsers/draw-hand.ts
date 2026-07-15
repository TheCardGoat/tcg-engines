import type { Action, TargetFilter } from "@tcg/op-types";
import { DRAW_RE } from "../constants.ts";
import { parseComparison } from "../helpers.ts";
import { parseConditionText } from "../condition-parser/index.ts";

type DrawAction = Extract<Action, { action: "draw" }>;

export function parseDrawAction(text: string): DrawAction | null {
  const trimmed = text.trim();

  // "Draw a card" = draw 1
  if (/^draw a card\.?$/i.test(trimmed)) {
    return { action: "draw", player: "self", amount: 1 };
  }

  // "your opponent draws N card(s)"
  const oppMatch = /^your\s+opponent\s+draws?\s+(\d+)\s+cards?\.?$/i.exec(trimmed);
  if (oppMatch) {
    return { action: "draw", player: "opponent", amount: parseInt(oppMatch[1]!, 10) };
  }

  const match = DRAW_RE.exec(trimmed);
  if (!match) return null;
  const result: DrawAction = { action: "draw", player: "self", amount: parseInt(match[1]!, 10) };
  // Trailing condition: "if you have N or less/more cards in your hand" or "DON!! cards on your field"
  if (match[2] && match[3]) {
    const condText = trimmed.slice(match[0].indexOf("if")).trim();
    if (/DON!!\s+cards/i.test(condText)) {
      result.condition = {
        condition: "donFieldCount",
        player: "self",
        comparison: parseComparison(match[3]),
        value: parseInt(match[2], 10),
      };
    } else {
      result.condition = {
        condition: "handCount",
        player: "self",
        comparison: parseComparison(match[3]),
        value: parseInt(match[2], 10),
      };
    }
  }
  return result;
}

type TrashFromHandAction = Extract<Action, { action: "trashFromHand" }>;

/**
 * Parse a "Trash N card(s) from your/opponent's hand" action clause.
 *
 * Also handles: "Trash 1 card from your opponent's hand"
 */
export function parseTrashFromHandAction(text: string): TrashFromHandAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "trash N card(s) from your/your opponent's hand"
  const match = /^trash\s+(\d+)\s+cards?\s+from\s+(your|your opponent's)\s+hand$/i.exec(trimmed);
  if (match) {
    return {
      action: "trashFromHand",
      player: match[2]!.toLowerCase() === "your" ? "self" : "opponent",
      amount: parseInt(match[1]!, 10),
    };
  }

  // "trash N <type> (card(s))? from your hand" (with card type filter)
  // e.g., "trash 1 Event or Stage card from your hand" or "trash 1 Event from your hand"
  const typeMatch =
    /^trash\s+(\d+)\s+(.+?)\s+(?:cards?\s+)?from\s+(your|your opponent's)\s+hand$/i.exec(trimmed);
  if (typeMatch) {
    const amount = parseInt(typeMatch[1]!, 10);
    const player = typeMatch[3]!.toLowerCase() === "your" ? "self" : "opponent";
    const typeText = typeMatch[2]!;
    const cardTypeMap: Record<string, string> = {
      event: "event",
      stage: "stage",
      character: "character",
    };
    const typeParts = typeText.split(/\s+or\s+/i);
    const filters: TargetFilter[] = [];
    for (const part of typeParts) {
      const key = part.trim().toLowerCase();
      if (cardTypeMap[key]) {
        filters.push({ filter: "cardCategory", value: cardTypeMap[key] as any });
      }
    }
    if (filters.length > 0) {
      return { action: "trashFromHand", player, amount, filters };
    }
  }

  // "your opponent trashes N card(s) from their hand"
  const opponentMatch = /^your\s+opponent\s+trashes\s+(\d+)\s+cards?\s+from\s+their\s+hand$/i.exec(
    trimmed,
  );
  if (opponentMatch) {
    return {
      action: "trashFromHand",
      player: "opponent",
      amount: parseInt(opponentMatch[1]!, 10),
    };
  }

  // "trash N card(s) with a type including "X" from your hand"
  const trashWithTypeMatch =
    /^trash\s+(\d+)\s+cards?\s+with\s+a\s+type\s+including\s+[""\u201c]([^""\u201d]+)[""\u201d]\s+from\s+your\s+hand$/i.exec(
      trimmed,
    );
  if (trashWithTypeMatch) {
    return {
      action: "trashFromHand",
      player: "self",
      amount: parseInt(trashWithTypeMatch[1]!, 10),
      filters: [{ filter: "trait", value: trashWithTypeMatch[2]! }],
    };
  }

  // "Trash cards from your hand until you have N cards in your hand"
  const trashUntilMatch =
    /^trash\s+cards?\s+from\s+your\s+hand\s+until\s+you\s+have\s+(\d+)\s+cards?\s+in\s+your\s+hand$/i.exec(
      trimmed,
    );
  if (trashUntilMatch) {
    return {
      action: "trashFromHand",
      player: "self",
      amount: parseInt(trashUntilMatch[1]!, 10),
    };
  }

  return null;
}

export function parseOpponentChosenTrashAction(text: string): TrashFromHandAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "Your opponent chooses 1 card from your hand; trash that card"
  if (
    /^Your\s+opponent\s+chooses?\s+(\d+)\s+cards?\s+from\s+your\s+hand;\s*trash\s+that\s+card$/i.test(
      trimmed,
    )
  ) {
    return { action: "trashFromHand", player: "self", amount: 1 };
  }

  return null;
}

export function parseChooseRevealAction(text: string): TrashFromHandAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "Choose N card(s) from your opponent's hand; your opponent reveals that/those card(s)"
  const m =
    /^choose\s+(\d+)\s+cards?\s+from\s+your\s+opponent[''\u2019]s\s+hand;\s*your\s+opponent\s+reveals?\s+(?:that|those)\s+cards?$/i.exec(
      trimmed,
    );
  if (!m) return null;

  // Model as a reveal action — closest to trashFromHand with amount 0 (just reveal, no discard)
  // Actually, this is just information reveal, model as draw 0 from opponent for tracking
  return {
    action: "trashFromHand",
    player: "opponent",
    amount: 0, // 0 = reveal only, no actual trash
  };
}

// ── "Draw card(s) so that you have N cards" ──

export function parseDrawToAction(text: string): DrawAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "Draw card(s) so that you have N cards in your hand"
  const m =
    /^draw\s+card(?:\(s\)|s)?\s+so\s+that\s+you\s+have\s+(\d+)\s+cards?\s+in\s+your\s+hand$/i.exec(
      trimmed,
    );
  if (!m) return null;

  return { action: "draw", player: "self", amount: parseInt(m[1]!, 10) };
}

// ── "Draw N card(s) if condition" ──

export function parseDrawWithConditionAction(text: string): DrawAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "Draw N card(s) if <condition>"
  const m = /^draw\s+(\d+)\s+cards?\s+if\s+(.+)$/i.exec(trimmed);
  if (!m) return null;

  const condText = m[2]!;
  const condition = parseConditionText(condText);
  if (!condition) return null;

  return { action: "draw", player: "self", amount: parseInt(m[1]!, 10), condition };
}
