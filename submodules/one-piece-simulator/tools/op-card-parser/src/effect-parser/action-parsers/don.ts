import type { Action, Target, TargetFilter } from "@tcg/op-types";
import { parseTarget } from "../target-parser.ts";
import { parseZoneList } from "../helpers.ts";

// ── AddDon action parsing ──

type AddDonAction = Extract<Action, { action: "addDon" }>;

/**
 * Parse an "Add up to N DON!! card(s) from your DON!! deck and rest/set it" action clause.
 *
 * Handles:
 * - "Add up to 1 DON!! card from your DON!! deck and rest it"
 * - "Add up to 1 DON!! card from your DON!! deck and set it as active"
 * - "add up to 2 DON!! cards from your DON!! deck and rest them"
 */
export function parseAddDonAction(text: string): AddDonAction | null {
  const cleaned = text.trim().replace(/[.,]+$/, "");

  // "Add [up to] N DON!! card(s) from your DON!! deck and (rest it|set it as active)"
  const match =
    /^ad{1,2}\s+(up to )?(\d+) DON!! cards? from your DON!! deck and (rest (?:it|them)|set (?:it|them) as active)$/i.exec(
      cleaned,
    );
  if (!match) return null;
  const upTo = !!match[1];
  const amount = parseInt(match[2]!, 10);
  const state: "active" | "rested" = match[3]!.toLowerCase().startsWith("rest")
    ? "rested"
    : "active";
  return {
    action: "addDon",
    count: { amount, ...(upTo && { upTo: true }) },
    state,
  };
}

// ── GiveDon action parsing ──

type GiveDonAction = Extract<Action, { action: "giveDon" }>;

/**
 * Parse a "Give up to N rested DON!! card(s) to <target>" action clause.
 *
 * Handles:
 * - "Give up to 1 rested DON!! card to your Leader or 1 of your Characters"
 * - "Give up to 2 rested DON!! cards to 1 of your Characters"
 * - "Give up to 1 rested DON!! card to your Leader"
 * - "give up to 3 rested DON!! cards to your {Land of Wano} type Leader"
 */
export function parseGiveDonAction(text: string): GiveDonAction | null {
  const cleaned = text.trim().replace(/\.+$/, "");

  // Pattern 4 (first to avoid greedy match in Pattern 1): "Give up to N rested DON!! card(s) to each of your [Trait] type Characters"
  const eachTraitMatch =
    /^give\s+up\s+to\s+(\d+)\s+rested\s+DON!!\s+cards?\s+to\s+each\s+of\s+your\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+Characters?$/i.exec(
      cleaned,
    );
  if (eachTraitMatch) {
    return {
      action: "giveDon",
      target: {
        player: "self",
        zones: ["character"],
        count: { amount: "all" },
        filters: [{ filter: "trait", value: eachTraitMatch[2]! }],
      },
      count: { amount: parseInt(eachTraitMatch[1]!, 10), upTo: true },
      donState: "rested",
    };
  }

  // Pattern 1: "give up to N [rested] DON!! card(s) to <target>"
  const toMatch = /^give up to (\d+) (?:rested )?DON!! cards? to (.+)$/i.exec(cleaned);
  if (toMatch) {
    const target = parseGiveDonTarget(toMatch[2]!.trim());
    if (!target) return null;
    return {
      action: "giveDon",
      target,
      count: { amount: parseInt(toMatch[1]!, 10), upTo: true },
      donState: "rested",
    };
  }

  // Pattern 2: "give <target> up to N rested DON!! card(s)" (reversed order)
  const revMatch = /^give\s+(.+?)\s+up\s+to\s+(\d+)\s+rested\s+DON!!\s+cards?$/i.exec(cleaned);
  if (revMatch) {
    const targetText = revMatch[1]!.trim();
    // "this Character" self-target
    let target: Target | null = null;
    if (/^this\s+Character$/i.test(targetText)) {
      target = { player: "self", zones: ["character"], count: { amount: 1 }, self: true };
    } else {
      target = parseGiveDonTarget(targetText);
    }
    if (!target) return null;
    return {
      action: "giveDon",
      target,
      count: { amount: parseInt(revMatch[2]!, 10), upTo: true },
      donState: "rested",
    };
  }

  // Pattern 3: "Give your Leader and N Character up to M rested DON!! card each"
  const eachMatch =
    /^give\s+your\s+Leader\s+and\s+(\d+)\s+Characters?\s+up\s+to\s+(\d+)\s+rested\s+DON!!\s+cards?\s+each$/i.exec(
      cleaned,
    );
  if (eachMatch) {
    return {
      action: "giveDon",
      target: {
        player: "self",
        zones: ["leader", "character"],
        count: { amount: parseInt(eachMatch[1]!, 10) },
      },
      count: { amount: parseInt(eachMatch[2]!, 10), upTo: true },
      donState: "rested",
    };
  }

  // Pattern 5: "Give up to N of your [Trait] (or [Trait]) type Characters up to M rested DON!! card each"
  const traitEachMatch =
    /^give\s+up\s+to\s+(\d+)\s+of\s+your\s+(.+?)\s+type\s+Characters?\s+up\s+to\s+(\d+)\s+rested\s+DON!!\s+cards?\s+each$/i.exec(
      cleaned,
    );
  if (traitEachMatch) {
    const traitText = traitEachMatch[2]!;
    const traitParts = traitText.split(/\s+or\s+/i);
    const filters: TargetFilter[] = traitParts.map((p) => ({
      filter: "trait" as const,
      value: p
        .replace(/^[[\]{}"\u201c\u201d]/g, "")
        .replace(/[[\]{}"\u201c\u201d]$/g, "")
        .trim(),
    }));
    return {
      action: "giveDon",
      target: {
        player: "self",
        zones: ["character"],
        count: { amount: parseInt(traitEachMatch[1]!, 10), upTo: true },
        filters,
      },
      count: { amount: parseInt(traitEachMatch[3]!, 10), upTo: true },
      donState: "rested",
    };
  }

  return null;
}

/**
 * Parse the target of a GiveDon action.
 * Handles "your Leader or 1 of your Characters", "1 of your Characters",
 * "your Leader", "your {Trait} type Leader".
 */
export function parseGiveDonTarget(text: string): Target | null {
  // "your Leader or 1 of your Characters"
  const leaderOrCharMatch = /^your Leader or (\d+) of your Characters$/i.exec(text);
  if (leaderOrCharMatch) {
    return {
      player: "self",
      zones: ["leader", "character"],
      count: { amount: parseInt(leaderOrCharMatch[1]!, 10) },
    };
  }

  // "your ([Name]/[Trait] type)? Leader" or "your attribute Leader"
  if (/^your\s+attribute\s+Leader$/i.test(text)) {
    return { player: "self", zones: ["leader"], count: { amount: 1 } };
  }
  const leaderMatch = /^your\s+(?:([[{][^\]}]+[\]}])\s+(?:type\s+)?)?Leader$/i.exec(text);
  if (leaderMatch) {
    const target: Target = {
      player: "self",
      zones: ["leader"],
      count: { amount: 1 },
    };
    if (leaderMatch[1]) {
      const val = leaderMatch[1].replace(/^[[{]|[\]}]$/g, "").trim();
      // If the original text had "type" before "Leader", it's a trait filter;
      // otherwise it's a name filter
      if (/type\s+Leader$/i.test(text)) {
        target.filters = [{ filter: "trait", value: val }];
      } else {
        target.filters = [{ filter: "name", value: val }];
      }
    }
    return target;
  }

  // "your Leader or 1 of your Characters" with name/trait on leader
  const leaderOrCharWithTraitMatch =
    /^your\s+(?:Leader\s+)?(?:with\s+a\s+type\s+including\s+"([^"]+)"\s+)?or\s+(\d+)\s+(?:Character|Characters)\s+(?:with\s+a\s+type\s+including\s+"([^"]+)")?$/i.exec(
      text,
    );
  if (leaderOrCharWithTraitMatch) {
    const filters: TargetFilter[] = [];
    if (leaderOrCharWithTraitMatch[1])
      filters.push({ filter: "trait", value: leaderOrCharWithTraitMatch[1] });
    if (leaderOrCharWithTraitMatch[3])
      filters.push({ filter: "trait", value: leaderOrCharWithTraitMatch[3] });
    return {
      player: "self",
      zones: ["leader", "character"],
      count: { amount: parseInt(leaderOrCharWithTraitMatch[2]!, 10) },
      ...(filters.length > 0 && { filters }),
    };
  }

  // "your Leader or 1 of your Characters" with trait
  // "1 of your {Trait} type Leader or Character cards"
  const traitZoneMatch =
    /^(\d+) of your ([[{][^\]}]+[\]}](?:\s+or\s+[[{][^\]}]+[\]}])*)\s+type\s+(Leader or Character cards?|Characters?|Leader)$/i.exec(
      text,
    );
  if (traitZoneMatch) {
    const amount = parseInt(traitZoneMatch[1]!, 10);
    const traitParts = traitZoneMatch[2]!.split(/\s+or\s+/i);
    const filters: TargetFilter[] = [];
    for (const part of traitParts) {
      const trait = part.replace(/^[[{]|[\]}]$/g, "").trim();
      if (trait) filters.push({ filter: "trait", value: trait });
    }
    const zonesText = traitZoneMatch[3]!;
    const zones = parseZoneList(zonesText);
    if (!zones) return null;
    return {
      player: "self",
      zones,
      count: { amount },
      filters,
    };
  }

  // Fall back to parseTarget for "N of your Characters" etc.
  return parseTarget(text);
}

// ── OpponentReturnDon action parsing ──

type OpponentReturnDonAction = Extract<Action, { action: "opponentReturnDon" }>;

/**
 * Parse "Your opponent returns N DON!! card(s) from their field to their DON!! deck" action clause.
 */
export function parseOpponentReturnDonAction(text: string): OpponentReturnDonAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  const match =
    /^your\s+opponent\s+returns\s+(\d+)\s+DON!!\s+cards?\s+from\s+their\s+field\s+to\s+their\s+DON!!\s+deck$/i.exec(
      trimmed,
    );
  if (match) {
    return {
      action: "opponentReturnDon",
      amount: parseInt(match[1]!, 10),
    };
  }

  // "return N DON!! card(s) from your field to your DON!! deck" (self DON!! return)
  const selfMatch =
    /^return\s+(\d+)\s+DON!!\s+cards?\s+from\s+your\s+field\s+to\s+your\s+DON!!\s+deck$/i.exec(
      trimmed,
    );
  if (selfMatch) {
    return {
      action: "opponentReturnDon",
      amount: parseInt(selfMatch[1]!, 10),
    };
  }

  return null;
}

// ── RedistributeDon action parsing ──

type RedistributeDonAction = Extract<Action, { action: "redistributeDon" }>;

export function parseRedistributeDonAction(text: string): RedistributeDonAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "Give up to N total of your currently given DON!! cards to <target>"
  const redistMatch =
    /^give\s+up\s+to\s+(\d+)\s+total\s+of\s+your\s+currently\s+given\s+DON!!\s+cards?\s+to\s+(.+)$/i.exec(
      trimmed,
    );
  if (redistMatch) {
    const count = parseInt(redistMatch[1]!, 10);
    const target = parseGiveDonTarget(redistMatch[2]!.trim());
    if (!target) return null;
    return {
      action: "redistributeDon",
      count: { amount: count, upTo: true },
      target,
    };
  }

  return null;
}
