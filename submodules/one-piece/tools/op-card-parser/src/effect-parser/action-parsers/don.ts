import type { Action, Target, TargetFilter } from "@tcg/op-types";
import { parseTarget, traitAlternativesFilter } from "../target-parser.ts";
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

  const opponentMatch =
    /^your\s+opponent\s+may\s+ad{1,2}\s+(\d+)\s+DON!!\s+cards?\s+from\s+their\s+DON!!\s+deck\s+and\s+(rest\s+(?:it|them)|set\s+(?:it|them)\s+as\s+active)$/i.exec(
      cleaned,
    );
  if (opponentMatch) {
    return {
      action: "addDon",
      player: "opponent",
      count: { amount: parseInt(opponentMatch[1]!, 10), upTo: true },
      state: opponentMatch[2]!.toLowerCase().startsWith("rest") ? "rested" : "active",
    };
  }

  // "Add [up to] N DON!! card(s) from your DON!! deck and (rest it|set it as active)"
  // A later clause may abbreviate the repeated source as "additional DON!! card".
  const match =
    /^ad{1,2}\s+(up to )?(\d+)\s+(additional\s+)?DON!! cards?(?:\s+from\s+your\s+DON!!\s+deck)?\s+and\s+(rest (?:it|them)|set (?:it|them) as active)$/i.exec(
      cleaned,
    );
  if (!match) return null;
  if (!match[3] && !/from\s+your\s+DON!!\s+deck/i.test(cleaned)) return null;
  const upTo = !!match[1];
  const amount = parseInt(match[2]!, 10);
  const state: "active" | "rested" = match[4]!.toLowerCase().startsWith("rest")
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
export function parseGiveDonAction(text: string): GiveDonAction | GiveDonAction[] | null {
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
        count: { amount: "all", upTo: true },
        filters: [{ filter: "trait", value: eachTraitMatch[2]!, match: "includes" }],
      },
      count: { amount: parseInt(eachTraitMatch[1]!, 10), upTo: true },
      donState: "rested",
      distribution: "each",
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

  // Pattern 3a: "Give your Leader and 1 Character up to M rested DON!! cards each"
  // Keep the recipients separate so the Character choice cannot replace the mandatory Leader.
  const leaderAndOneMatch =
    /^give\s+your\s+Leader\s+and\s+1\s+Character\s+up\s+to\s+(\d+)\s+rested\s+DON!!\s+cards?\s+each$/i.exec(
      cleaned,
    );
  if (leaderAndOneMatch) {
    const count = { amount: parseInt(leaderAndOneMatch[1]!, 10), upTo: true } as const;
    return [
      {
        action: "giveDon",
        target: { player: "self", zones: ["leader"], count: { amount: 1 } },
        count,
        donState: "rested",
      },
      {
        action: "giveDon",
        target: { player: "self", zones: ["character"], count: { amount: 1 } },
        count,
        donState: "rested",
      },
    ];
  }

  // Pattern 3b: "Give your Leader and N Characters up to M rested DON!! cards each"
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

  const leaderAndAllMatch =
    /^give\s+your\s+Leader\s+and\s+all\s+of\s+your\s+Characters\s+up\s+to\s+(\d+)\s+rested\s+DON!!\s+cards?\s+each$/i.exec(
      cleaned,
    );
  if (leaderAndAllMatch) {
    return {
      action: "giveDon",
      target: {
        player: "self",
        zones: ["leader", "character"],
        count: { amount: "all" },
      },
      count: { amount: parseInt(leaderAndAllMatch[1]!, 10), upTo: true },
      donState: "rested",
      distribution: "each",
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
    const traitFilter = traitAlternativesFilter(
      traitParts.map((part) =>
        part
          .replace(/^[[\]{}"\u201c\u201d]/g, "")
          .replace(/[[\]{}"\u201c\u201d]$/g, "")
          .trim(),
      ),
    );
    const filters: TargetFilter[] = traitFilter ? [traitFilter] : [];
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
        target.filters = [{ filter: "trait", value: val, match: "includes" }];
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
    const traits = new Set(
      [leaderOrCharWithTraitMatch[1], leaderOrCharWithTraitMatch[3]].filter(
        (trait): trait is string => Boolean(trait),
      ),
    );
    const filters: TargetFilter[] = Array.from(traits, (trait) => ({
      filter: "trait",
      value: trait,
      match: "includes",
    }));
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
    const traitFilter = traitAlternativesFilter(
      traitParts.map((part) => part.replace(/^[[{]|[\]}]$/g, "").trim()),
      "includes",
    );
    const filters: TargetFilter[] = traitFilter ? [traitFilter] : [];
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

type ReturnDonAction = Extract<Action, { action: "returnDon" }>;

/**
 * Parse "Your opponent returns N DON!! card(s) from their field to their DON!! deck" action clause.
 */
export function parseOpponentReturnDonAction(text: string): ReturnDonAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  const match =
    /^your\s+opponent\s+returns\s+(\d+)\s+DON!!\s+cards?\s+from\s+their\s+field\s+to\s+their\s+DON!!\s+deck$/i.exec(
      trimmed,
    );
  if (match) {
    return {
      action: "returnDon",
      player: "opponent",
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
      action: "returnDon",
      player: "self",
      amount: parseInt(selfMatch[1]!, 10),
    };
  }

  return null;
}

// ── RedistributeDon action parsing ──

type RedistributeDonAction = Extract<Action, { action: "redistributeDon" }>;

export function parseRedistributeDonAction(text: string): RedistributeDonAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "Give up to N [total] of your currently given DON!! cards to <target>"
  const redistMatch =
    /^give\s+up\s+to\s+(\d+)\s+(?:total\s+)?of\s+your\s+currently\s+given\s+DON!!\s+cards?\s+to\s+(.+)$/i.exec(
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
