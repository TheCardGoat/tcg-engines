import type { EffectTrigger, Target, TargetFilter, TotalConstraint, Zone } from "@tcg/op-types";

export function traitAlternativesFilter(
  traits: string[],
  match?: "exact" | "includes",
): TargetFilter | null {
  const unique = [...new Set(traits.map((trait) => trait.trim()).filter(Boolean))];
  if (unique.length === 0) return null;
  if (unique.length === 1) {
    return { filter: "trait", value: unique[0]!, ...(match && { match }) };
  }
  return {
    filter: "anyOf",
    filters: unique.map((value) => ({ filter: "trait", value, ...(match && { match }) })),
  };
}
import { mapZoneNoun, parseZoneList, parseComparison } from "./helpers.ts";

export function extractTargetFilters(text: string): {
  zonesText: string;
  filters: TargetFilter[];
  totalConstraint?: TotalConstraint;
} {
  const filters: TargetFilter[] = [];

  // Suffix trait wording: `Characters with a type including "Baroque
  // Works"`. Strip it and recurse so cost/state filters can compose with it.
  const includesTraitMatch =
    /(?:^|\s+)with\s+a\s+type\s+including\s+(?:[[{"\u201c])([^\]}"\u201d]+)(?:[\]}"\u201d])\.?$/i.exec(
      text,
    );
  if (includesTraitMatch) {
    const before = text.slice(0, includesTraitMatch.index).trim();
    const sub = extractTargetFilters(before);
    return {
      zonesText: sub.zonesText,
      filters: [
        ...sub.filters,
        { filter: "trait", value: includesTraitMatch[1]!, match: "includes" },
      ],
      totalConstraint: sub.totalConstraint,
    };
  }

  // Dynamic cost: "with a cost equal to or less than the number of your opponent's Life cards"
  // Also "with a cost equal to or less than your number of Life cards"
  const dynCostMatch =
    /\s+with a cost equal to or (less|more) than (?:the (?:number of (your opponent's|your)|total of your and your opponent's)|(your(?:\s+opponent's)?)\s+number\s+of) Life [Cc]ards?\.?$/i.exec(
      text,
    );
  if (dynCostMatch) {
    const comparison = parseComparison(dynCostMatch[1]);
    let source: "opponentLifeCount" | "selfLifeCount" | "totalLifeCount";
    const playerRef = dynCostMatch[2] ?? dynCostMatch[3];
    if (playerRef) {
      source = playerRef.toLowerCase().includes("opponent") ? "opponentLifeCount" : "selfLifeCount";
    } else {
      source = "totalLifeCount";
    }
    filters.push({ filter: "dynamicCost", comparison, source });
    return { zonesText: text.slice(0, dynCostMatch.index).trim(), filters };
  }

  // Dynamic cost: "with a cost equal to or less/more than the number of DON!! cards on your/opponent's field"
  const dynDonCostMatch =
    /\s+with a cost (?:of \d+ or more )?(?:that is )?equal to or (less|more) than the number of DON!! cards on (your|your opponent[''\u2019]s) field\.?$/i.exec(
      text,
    );
  if (dynDonCostMatch) {
    const comparison = parseComparison(dynDonCostMatch[1]);
    const source: "opponentDonCount" | "selfDonCount" = dynDonCostMatch[2]!
      .toLowerCase()
      .includes("opponent")
      ? "opponentDonCount"
      : "selfDonCount";
    filters.push({ filter: "dynamicCost", comparison, source } as unknown as TargetFilter);
    const before = text.slice(0, dynDonCostMatch.index).trim();
    const sub = extractTargetFilters(before);
    return {
      zonesText: sub.zonesText,
      filters: [...sub.filters, ...filters],
      totalConstraint: sub.totalConstraint,
    };
  }

  // "with a cost of N (or less|or more)?" — also handle "and with"
  const costRangeMatch = /\s+(?:(?:and\s+)?with|and) a cost of (\d+)\s+to\s+(\d+)\.?$/i.exec(text);
  if (costRangeMatch) {
    const minimum = parseInt(costRangeMatch[1]!, 10);
    const maximum = parseInt(costRangeMatch[2]!, 10);
    const before = text.slice(0, costRangeMatch.index).trim();
    const sub = extractTargetFilters(before);
    return {
      zonesText: sub.zonesText,
      filters: [
        ...sub.filters,
        { filter: "cost", comparison: "gte", value: minimum },
        { filter: "cost", comparison: "lte", value: maximum },
      ],
      totalConstraint: sub.totalConstraint,
    };
  }

  const costMatch = /\s+(?:(?:and\s+)?with|and) a cost of (\d+)(?:\s+or\s+(less|more))?\.?$/i.exec(
    text,
  );
  if (costMatch) {
    filters.push({
      filter: "cost",
      comparison: parseComparison(costMatch[2]),
      value: parseInt(costMatch[1]!, 10),
    });
    const before = text.slice(0, costMatch.index).trim();
    const sub = extractTargetFilters(before);
    return {
      zonesText: sub.zonesText,
      filters: [...sub.filters, ...filters],
      totalConstraint: sub.totalConstraint,
    };
  }

  // "with a base cost of N (or less|or more)?"
  const baseCostMatch = /\s+with a base cost of (\d+)(?:\s+or\s+(less|more))?\.?$/i.exec(text);
  if (baseCostMatch) {
    filters.push({
      filter: "baseCost",
      comparison: parseComparison(baseCostMatch[2]),
      value: parseInt(baseCostMatch[1]!, 10),
    });
    return { zonesText: text.slice(0, baseCostMatch.index).trim(), filters };
  }

  // "with N base power (or less|or more)?" OR "with a base power of N (or less|or more)?"
  const basePowerMatch =
    /\s+with (?:(\d+) base power|a base power of (\d+))(?:\s+or\s+(less|more))?\.?$/i.exec(text);
  if (basePowerMatch) {
    const value = parseInt((basePowerMatch[1] ?? basePowerMatch[2])!, 10);
    filters.push({
      filter: "basePower",
      comparison: parseComparison(basePowerMatch[3]),
      value,
    });
    return { zonesText: text.slice(0, basePowerMatch.index).trim(), filters };
  }

  // "with N power (or less|or more)?"
  const powerMatch = /\s+with (\d+) power(?:\s+or\s+(less|more))?\.?$/i.exec(text);
  if (powerMatch) {
    filters.push({
      filter: "power",
      comparison: parseComparison(powerMatch[2]),
      value: parseInt(powerMatch[1]!, 10),
    });
    return { zonesText: text.slice(0, powerMatch.index).trim(), filters };
  }

  // "with a total (power|cost) of N (or less|or more)?"
  const totalMatch = /\s+with a total (power|cost) of (\d+)(?:\s+or\s+(less|more))?\.?$/i.exec(
    text,
  );
  if (totalMatch) {
    return {
      zonesText: text.slice(0, totalMatch.index).trim(),
      filters,
      totalConstraint: {
        property: totalMatch[1]!.toLowerCase() as "cost" | "power",
        comparison: parseComparison(totalMatch[3]),
        value: parseInt(totalMatch[2]!, 10),
      },
    };
  }

  // "with no base effect"
  const noBaseEffectMatch = /\s+with no base effect\.?$/i.exec(text);
  if (noBaseEffectMatch) {
    filters.push({ filter: "noBaseEffect" });
    return { zonesText: text.slice(0, noBaseEffectMatch.index).trim(), filters };
  }

  // "without an [On Play] / [On K.O.] effect" — negate filter, then recursively extract more
  const withoutEffectMatch = /\s+without\s+an?\s+\[([^\]]+)\]\s+effect/i.exec(text);
  if (withoutEffectMatch) {
    const effectName = withoutEffectMatch[1]!.toLowerCase();
    const triggerMap: Record<string, EffectTrigger> = {
      "on play": "onPlay",
      "on k.o.": "onKo",
      main: "main",
      "when attacking": "whenAttacking",
      counter: "counter",
      "on block": "onBlock",
    };
    const effectType = triggerMap[effectName];
    if (effectType) {
      filters.push({ filter: "hasEffectType", value: effectType, negate: true });
      const stripped =
        text.slice(0, withoutEffectMatch.index) +
        text.slice(withoutEffectMatch.index! + withoutEffectMatch[0].length);
      const sub = extractTargetFilters(stripped.trim());
      return {
        zonesText: sub.zonesText,
        filters: [...sub.filters, ...filters],
        totalConstraint: sub.totalConstraint,
      };
    }
  }

  // "with a [Trigger]" or "and a [Trigger]" — strip and reparse remaining
  const hasTriggerMatch = /\s+(?:with|and) a \[Trigger\]\.?$/i.exec(text);
  if (hasTriggerMatch) {
    filters.push({ filter: "hasTrigger", value: true });
    const before = text.slice(0, hasTriggerMatch.index).trim();
    // Recursively extract more filters from the remaining text
    const sub = extractTargetFilters(before);
    return {
      zonesText: sub.zonesText,
      filters: [...sub.filters, ...filters],
      totalConstraint: sub.totalConstraint,
    };
  }

  // "N cost Characters" — shorthand for "Characters with a cost of N"
  const shortCostMatch = /^(\d+)\s+cost\s+/i.exec(text);
  if (shortCostMatch) {
    filters.push({
      filter: "cost",
      comparison: "eq" as const,
      value: parseInt(shortCostMatch[1]!, 10),
    });
    return { zonesText: text.slice(shortCostMatch[0].length).trim(), filters };
  }

  // "(Attribute) attribute Characters" — attribute filter prefix in zone text
  // E.g., "your opponent's (Special) attribute Characters"
  // This is a pass-through; actual attribute extraction happens in parseTarget/parseModifyPowerTarget

  return { zonesText: text.trim(), filters };
}

export function parseTarget(text: string): Target | null {
  const trimmed = text.trim().replace(/\.+$/, "");
  if (!trimmed) return null;

  // Self-reference: "this Character/Leader/Stage"
  const selfMatch = /^this\s+(Character|Leader|Stage)$/i.exec(trimmed);
  if (selfMatch) {
    const zone = mapZoneNoun(selfMatch[1]!);
    if (!zone) return null;
    return {
      player: "self",
      zones: [zone],
      count: { amount: 1 },
      self: true,
    };
  }

  // Standard pattern: (up to )?(a total of )?N of (your opponent's|your) (rested|active)? <zones+filters>
  let rest = trimmed;

  const upTo = /^up to /i.test(rest);
  if (upTo) rest = rest.slice(6);

  // "a total of" — just clarifies count spans multiple zones, strip it
  if (/^a total of /i.test(rest)) rest = rest.slice(11);

  // "all (of) ..." — amount = "all"
  const allPrefix = /^all\s+(?:of\s+)?/i.exec(rest);
  let amount: number | "all";
  if (allPrefix) {
    amount = "all";
    rest = rest.slice(allPrefix[0].length);
  } else {
    const numMatch = /^(\d+) of /i.exec(rest);
    if (!numMatch) return null;
    amount = parseInt(numMatch[1]!, 10);
    rest = rest.slice(numMatch[0].length);
  }

  const playerMatch = /^(your opponent's|your) /i.exec(rest);
  if (!playerMatch) return null;
  const player = playerMatch[1]!.toLowerCase() === "your" ? "self" : "opponent";
  rest = rest.slice(playerMatch[0].length);

  // Strip and preserve the "other" qualifier (e.g., "1 of your other Characters").
  let excludesSelf = /^other\s+/i.test(rest);
  if (excludesSelf) {
    rest = rest.slice(6);
  }

  // State filter: "rested Characters" / "active Characters"
  const stateMatch = /^(rested|active)\s+/i.exec(rest);
  let stateFilter: TargetFilter | null = null;
  if (stateMatch) {
    stateFilter = { filter: "state", value: stateMatch[1]!.toLowerCase() as "rested" | "active" };
    rest = rest.slice(stateMatch[0].length);
  }

  // Color prefix: "red Characters with a cost of 1"
  const colorPrefixMatch = /^(red|green|blue|purple|black|yellow)\s+/i.exec(rest);
  let colorFilter: TargetFilter | null = null;
  if (colorPrefixMatch) {
    colorFilter = {
      filter: "color",
      value: colorPrefixMatch[1]!.toLowerCase() as
        | "red"
        | "green"
        | "blue"
        | "purple"
        | "black"
        | "yellow",
    };
    rest = rest.slice(colorPrefixMatch[0].length);
  }

  // Trait prefix: "[Trait] type" / "{Trait} type" / "\"Trait\" type" / "[A], [B], or [C] type"
  const bracketGroup = '(?:[\\[{][^\\]}]+[\\]}]|["\u201c][^"\u201d]+["\u201d])';
  const traitPrefixRegex = new RegExp(
    `^(${bracketGroup}(?:(?:,\\s*(?:or\\s+)?|\\s+or\\s+)${bracketGroup})*)\\s+type\\s+`,
    "i",
  );
  const traitPrefixMatch = traitPrefixRegex.exec(rest);
  const traitFilters: TargetFilter[] = [];
  if (traitPrefixMatch) {
    const parts = traitPrefixMatch[1]!.split(/,\s*(?:or\s+)?|\s+or\s+/i);
    const traits = parts.map((part) =>
      part
        .replace(/^[[\]{}"\u201c\u201d]/g, "")
        .replace(/[[\]{}"\u201c\u201d]$/g, "")
        .trim(),
    );
    const alternatives = traitAlternativesFilter(traits, "includes");
    if (alternatives) traitFilters.push(alternatives);
    rest = rest.slice(traitPrefixMatch[0].length);
  }

  // Attribute prefix: "(Special) attribute Characters" / "\"Slash\" attribute Characters"
  let attributeFilter: TargetFilter | null = null;
  if (!traitPrefixMatch) {
    const attrPrefixMatch = /^(?:\(([^)]+)\)|["\u201c]([^"\u201d]+)["\u201d])\s+attribute\s+/i.exec(
      rest,
    );
    if (attrPrefixMatch) {
      attributeFilter = {
        filter: "attribute",
        value: (attrPrefixMatch[1] ?? attrPrefixMatch[2])!.toLowerCase() as any,
      };
      rest = rest.slice(attrPrefixMatch[0].length);
    }
  }

  // Name prefix (no "type" after bracket): "[Spandam] Characters"
  let nameFilter: TargetFilter | null = null;
  if (!traitPrefixMatch && !attributeFilter) {
    const namePrefixMatch = /^[[{]([^\]}]+)[\]}]\s+/i.exec(rest);
    if (namePrefixMatch) {
      nameFilter = { filter: "name", value: namePrefixMatch[1]! };
      rest = rest.slice(namePrefixMatch[0].length);
    }
  }

  // Strip "other than [Name]" before extracting filters (it can come before or after "with a cost")
  let excludeNameFilter: TargetFilter | null = null;
  const otherThanInRest = /\s+other\s+than\s+\[([^\]]+)\]/i.exec(rest);
  if (otherThanInRest) {
    excludeNameFilter = { filter: "excludeName", value: otherThanInRest[1]! };
    rest =
      rest.slice(0, otherThanInRest.index) +
      rest.slice(otherThanInRest.index + otherThanInRest[0].length);
    rest = rest.trim();
  }
  const otherThanSelfInRest = /\s+other\s+than\s+this\s+Character/i.exec(rest);
  if (otherThanSelfInRest) {
    excludesSelf = true;
    rest =
      rest.slice(0, otherThanSelfInRest.index) +
      rest.slice(otherThanSelfInRest.index + otherThanSelfInRest[0].length);
    rest = rest.trim();
  }

  // rest is now "Characters with a cost of 5 or less" or "DON!! cards or Characters" etc.
  const { zonesText, filters, totalConstraint } = extractTargetFilters(rest);

  const zones = parseZoneList(zonesText);
  if (!zones) return null;

  const allFilters = [
    ...(stateFilter ? [stateFilter] : []),
    ...(colorFilter ? [colorFilter] : []),
    ...(attributeFilter ? [attributeFilter] : []),
    ...traitFilters,
    ...(nameFilter ? [nameFilter] : []),
    ...(excludeNameFilter ? [excludeNameFilter] : []),
    ...(excludesSelf ? [{ filter: "excludeSelf" } as const] : []),
    ...filters,
  ];

  const target: Target = {
    player,
    zones,
    count: { amount, ...(upTo && { upTo: true }) },
  };
  if (allFilters.length > 0) target.filters = allFilters;
  if (totalConstraint) target.totalConstraint = totalConstraint;

  return target;
}

export function parseTargetWithoutPlayer(text: string): Target | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  let rest = trimmed;
  const excludeSelf = /\s+other\s+than\s+this\s+Character$/i.test(rest);
  if (excludeSelf) {
    rest = rest.replace(/\s+other\s+than\s+this\s+Character$/i, "");
  }

  // Handle "all" prefix: "all rested Characters with a cost of 5 or less"
  const allMatch = /^all\s+/i.test(rest);
  if (allMatch) {
    rest = rest.slice(4);
    // Extract state filter: "rested" / "active"
    const stateFilters: TargetFilter[] = [];
    const stateMatch = /^(rested|active)\s+/i.exec(rest);
    if (stateMatch) {
      stateFilters.push({
        filter: "state",
        value: stateMatch[1]!.toLowerCase() as "rested" | "active",
      });
      rest = rest.slice(stateMatch[0].length);
    }

    // If "of your/opponent's" is present, parseTarget should have handled it
    if (/^of\s+(?:your|your\s+opponent)/i.test(rest)) return null;

    const { zonesText, filters } = extractTargetFilters(rest);
    const zones = parseZoneList(zonesText);
    if (!zones) return null;

    const allFilters = [
      ...stateFilters,
      ...filters,
      ...(excludeSelf ? ([{ filter: "excludeSelf" }] as TargetFilter[]) : []),
    ];
    return {
      player: "any",
      zones,
      count: { amount: "all" },
      ...(allFilters.length > 0 && { filters: allFilters }),
    };
  }

  const upTo = /^up to /i.test(rest);
  if (upTo) rest = rest.slice(6);

  const numMatch = /^(\d+) /i.exec(rest);
  if (!numMatch) return null;
  const amount = parseInt(numMatch[1]!, 10);
  rest = rest.slice(numMatch[0].length);

  // If "of your/opponent's" is present, parseTarget should have handled it
  if (/^of\s+(?:your|your\s+opponent)/i.test(rest)) return null;

  const stateFilters: TargetFilter[] = [];
  const stateMatch = /^(rested|active)\s+/i.exec(rest);
  if (stateMatch) {
    stateFilters.push({
      filter: "state",
      value: stateMatch[1]!.toLowerCase() as "rested" | "active",
    });
    rest = rest.slice(stateMatch[0].length);
  }

  const { zonesText, filters } = extractTargetFilters(rest);

  // Strip trait prefix: "[Egghead] type Character" → "Character" (and add trait filter)
  const traitPrefix = /^(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+(.+)$/i.exec(
    zonesText,
  );
  const finalZonesText = traitPrefix ? traitPrefix[2]! : zonesText;
  const traitFilters: TargetFilter[] = traitPrefix
    ? [{ filter: "trait", value: traitPrefix[1]!, match: "includes" }]
    : [];

  // Strip "other than [Name]" from zone text
  let cleanedZonesText = finalZonesText;
  const otherThanMatch = /^(.+?)\s+other\s+than\s+\[([^\]]+)\]$/i.exec(cleanedZonesText);
  if (otherThanMatch) {
    cleanedZonesText = otherThanMatch[1]!;
    traitFilters.push({ filter: "excludeName", value: otherThanMatch[2]! });
  }

  const zones = parseZoneList(cleanedZonesText);
  if (!zones) return null;

  const allFilters = [
    ...stateFilters,
    ...traitFilters,
    ...filters,
    ...(excludeSelf ? ([{ filter: "excludeSelf" }] as TargetFilter[]) : []),
  ];
  return {
    player: "any",
    zones,
    count: { amount, ...(upTo && { upTo: true }) },
    ...(allFilters.length > 0 && { filters: allFilters }),
  };
}

export function parseModifyPowerTarget(text: string): Target | null {
  const trimmed = text.trim();

  const ownedTraitLeaderOrCharacterMatch =
    /^up\s+to\s+(\d+)\s+(?:[[{"\u201c])([^\]}"\u201d]+)(?:[\]}"\u201d])\s+type\s+Leader\s+or\s+Character\s+cards?\s+on\s+your\s+field$/i.exec(
      trimmed,
    );
  if (ownedTraitLeaderOrCharacterMatch) {
    return {
      player: "self",
      zones: ["leader", "character"],
      count: { amount: parseInt(ownedTraitLeaderOrCharacterMatch[1]!, 10), upTo: true },
      filters: [
        {
          filter: "trait",
          value: ownedTraitLeaderOrCharacterMatch[2]!,
          match: "includes",
        },
      ],
    };
  }

  // "this card" / "that Character" → self-target (character zone)
  if (/^this card$/i.test(trimmed)) {
    return { player: "self", zones: ["character"], count: { amount: 1 }, self: true };
  }
  if (/^that Character$/i.test(trimmed)) {
    return { player: "self", zones: ["character"], count: { amount: 1 } };
  }

  // "Your Leader" → direct leader reference
  if (/^your Leader$/i.test(trimmed)) {
    return { player: "self", zones: ["leader"], count: { amount: 1 } };
  }

  // `Your "Trait" type Leader` → the controller's Leader with a trait constraint.
  const traitLeaderMatch =
    /^your\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+Leader$/i.exec(trimmed);
  if (traitLeaderMatch) {
    return {
      player: "self",
      zones: ["leader"],
      count: { amount: 1 },
      filters: [{ filter: "trait", value: traitLeaderMatch[1]!, match: "includes" }],
    };
  }

  // "Your Leader and all of your Characters" → multi-zone target
  if (/^Your Leader and all (?:of your )?Characters$/i.test(trimmed)) {
    return { player: "self", zones: ["leader", "character"], count: { amount: "all" } };
  }

  // "all of your Characters" → all characters
  if (/^all (?:of your )?Characters$/i.test(trimmed)) {
    return { player: "self", zones: ["character"], count: { amount: "all" } };
  }

  const allNamedCharactersMatch = /^your\s+\[([^\]]+)\]$/i.exec(trimmed);
  if (allNamedCharactersMatch) {
    return {
      player: "self",
      zones: ["character"],
      count: { amount: "all" },
      filters: [{ filter: "name", value: allNamedCharactersMatch[1]! }],
    };
  }

  // "all of your opponent's Characters" → all opponent characters
  if (/^all (?:of )?your opponent's Characters$/i.test(trimmed)) {
    return { player: "opponent", zones: ["character"], count: { amount: "all" } };
  }

  // "all of your {Trait} (or {Trait2}) type (Leader and )Characters (with filters)"
  const allTraitMatch =
    /^all (?:of )?your\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])(?:\s+or\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"]))?\s+type\s+(Leader\s+and\s+Character|Characters?)\s*(.*)$/i.exec(
      trimmed,
    );
  if (allTraitMatch) {
    const trait = allTraitMatch[1]!;
    const trait2 = allTraitMatch[2];
    const zoneText = allTraitMatch[3]!.toLowerCase();
    const zones: Zone[] = zoneText.includes("leader") ? ["leader", "character"] : ["character"];
    let rest = allTraitMatch[4] || "";
    const traitFilter = traitAlternativesFilter([trait, ...(trait2 ? [trait2] : [])], "includes");
    const filters: TargetFilter[] = traitFilter ? [traitFilter] : [];
    if (/\bother\s+than\s+this\s+Character\b/i.test(rest)) {
      filters.push({ filter: "excludeSelf" });
      rest = rest.replace(/\bother\s+than\s+this\s+Character\b/i, "").trim();
    }
    if (rest.trim()) {
      const { filters: subFilters } = extractTargetFilters(" " + rest);
      filters.push(...subFilters);
    }
    return { player: "self", zones, count: { amount: "all" }, filters };
  }

  // Try parseTarget with "other than this Character" handling
  const otherThanMatch = /^(.+?)\s+other\s+than\s+this\s+Character$/i.exec(trimmed);
  if (otherThanMatch) {
    const target = parseTarget(otherThanMatch[1]!);
    if (target) {
      target.filters = [
        ...(target.filters ?? []),
        { filter: "excludeSelf" } as unknown as TargetFilter,
      ];
      return target;
    }
  }

  const target = parseTarget(trimmed);
  // A named generic "card" used as a power/keyword target can only be a
  // Leader or Character. Do not broaden it to Stage and DON!! field zones.
  if (
    target &&
    /^up\s+to\s+\d+\s+of\s+your\s+\[[^\]]+\]\s+cards?$/i.test(trimmed) &&
    target.filters?.some((filter) => filter.filter === "name")
  ) {
    return { ...target, zones: ["leader", "character"] };
  }
  return target;
}
