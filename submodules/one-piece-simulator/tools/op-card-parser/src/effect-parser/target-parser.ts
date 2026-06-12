import type { EffectTrigger, Target, TargetFilter, TotalConstraint, Zone } from "@tcg/op-types";
import { mapZoneNoun, parseZoneList, parseComparison } from "./helpers.ts";

export function extractTargetFilters(text: string): {
  zonesText: string;
  filters: TargetFilter[];
  totalConstraint?: TotalConstraint;
} {
  const filters: TargetFilter[] = [];

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
  const costMatch = /\s+(?:and\s+)?with a cost of (\d+)(?:\s+or\s+(less|more))?\.?$/i.exec(text);
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

  // Strip "other" qualifier (e.g., "1 of your other Characters")
  if (/^other\s+/i.test(rest)) {
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
    for (const part of parts) {
      const trait = part
        .replace(/^[[\]{}"\u201c\u201d]/g, "")
        .replace(/[[\]{}"\u201c\u201d]$/g, "")
        .trim();
      if (trait) traitFilters.push({ filter: "trait", value: trait });
    }
    rest = rest.slice(traitPrefixMatch[0].length);
  }

  // Attribute prefix: "(Special) attribute Characters" / "(Slash) attribute Characters"
  let attributeFilter: TargetFilter | null = null;
  if (!traitPrefixMatch) {
    const attrPrefixMatch = /^\(([^)]+)\)\s+attribute\s+/i.exec(rest);
    if (attrPrefixMatch) {
      attributeFilter = { filter: "attribute", value: attrPrefixMatch[1]!.toLowerCase() as any };
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

    return {
      player: "opponent",
      zones,
      count: { amount: "all" },
      filters: [...stateFilters, ...filters],
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

  const { zonesText, filters } = extractTargetFilters(rest);

  // Strip trait prefix: "[Egghead] type Character" → "Character" (and add trait filter)
  const traitPrefix = /^(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+(.+)$/i.exec(
    zonesText,
  );
  const finalZonesText = traitPrefix ? traitPrefix[2]! : zonesText;
  const traitFilters: TargetFilter[] = traitPrefix
    ? [{ filter: "trait", value: traitPrefix[1]! }]
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

  const allFilters = [...traitFilters, ...filters];
  return {
    player: "opponent",
    zones,
    count: { amount, ...(upTo && { upTo: true }) },
    ...(allFilters.length > 0 && { filters: allFilters }),
  };
}

export function parseModifyPowerTarget(text: string): Target | null {
  const trimmed = text.trim();

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

  // "Your Leader and all of your Characters" → multi-zone target
  if (/^Your Leader and all (?:of your )?Characters$/i.test(trimmed)) {
    return { player: "self", zones: ["leader", "character"], count: { amount: "all" } };
  }

  // "all of your Characters" → all characters
  if (/^all (?:of your )?Characters$/i.test(trimmed)) {
    return { player: "self", zones: ["character"], count: { amount: "all" } };
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
    const rest = allTraitMatch[4] || "";
    const filters: TargetFilter[] = [{ filter: "trait", value: trait }];
    if (trait2) {
      // Two traits with "or" — currently model as first trait only (union not yet supported)
      filters[0] = { filter: "trait", value: trait };
      filters.push({ filter: "trait", value: trait2 });
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

  return parseTarget(trimmed);
}
