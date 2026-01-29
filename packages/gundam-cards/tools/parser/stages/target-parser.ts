import type {
  CardTarget,
  TargetZone,
  UnitFilter,
  UnitTarget,
  UnitTargetQuery,
} from "@tcg/gundam-types";

export interface TargetParseResult {
  query: CardTarget | CardTarget[];
  remainingText: string;
}

function parseCount(countStr: string): { min: number; max: number } {
  const lower = countStr.toLowerCase();
  if (lower.includes("up to")) {
    return {
      min: 0,
      max: Number.parseInt(lower.replace(/\D/g, ""), 10),
    };
  }
  const val = Number.parseInt(lower, 10);
  return { min: val, max: val };
}

export function parseTarget(text: string): TargetParseResult | null {
  // Normalize case for checking but keep original for value extraction
  const lower = text.toLowerCase();

  // 0. "Choose X ... and Y ..." pattern (Multiple groups)
  const multiChooseMatch = text.match(
    /^Choose (\d+|up to \d+)(?: of)? (.*?) and (\d+|up to \d+)(?: of)? (.*?)(?:\.|$)/i,
  );

  if (multiChooseMatch) {
    const count1 = parseCount(multiChooseMatch[1]);
    const desc1 = multiChooseMatch[2];
    const result1 = parseTargetDescription(desc1);

    const count2 = parseCount(multiChooseMatch[3]);
    const desc2 = multiChooseMatch[4];
    const result2 = parseTargetDescription(desc2);

    return {
      query: [
        createUnitTarget(count1, result1),
        createUnitTarget(count2, result2),
      ],
      remainingText: text.substring(multiChooseMatch[0].length).trim(),
    };
  }

  // 1. "Choose X ..." pattern
  const chooseMatch = text.match(
    /^Choose (\d+|up to \d+)(?: of)? (.*?)(?:\.|$)/i,
  );

  if (chooseMatch) {
    const count = parseCount(chooseMatch[1]);
    const desc = chooseMatch[2];
    const result = parseTargetDescription(desc);

    return {
      query: createUnitTarget(count, result),
      remainingText: text.substring(chooseMatch[0].length).trim(),
    };
  }

  // 2. "All ..." pattern
  if (lower.startsWith("all ")) {
    // Need to find end of target description. usually until "." or end.
    const match = text.match(/^All (.*?)(?:\.|$)/i);
    if (match) {
      const desc = match[1];
      const result = parseTargetDescription(desc);
      return {
        query: {
          selector: "all",
          count: "all",
          owner: result.owner,
          filters: result.filters,
          zone: result.zone,
        } as unknown as UnitTargetQuery, // cast to ensure type safety if generic constraints differ
        remainingText: text.substring(match[0].length).trim(),
      };
    }
  }

  // 3. "This Unit"
  if (lower.startsWith("this unit")) {
    return {
      query: {
        ref: "self",
      },
      remainingText: text.substring("this unit".length).trim(),
    };
  }

  return null;
}

function createUnitTarget(
  count: { min: number; max: number },
  desc: { owner: any; filters: any[]; zone?: any },
): UnitTarget {
  const base = {
    selector: "chosen",
    owner: desc.owner,
    filters: desc.filters,
    zone: desc.zone,
  };

  if (count.min === count.max) {
    return {
      ...base,
      count: count.min,
    } as unknown as UnitTargetQuery;
  }
  if (count.min === 0) {
    return {
      ...base,
      count: { upTo: count.max },
    } as unknown as UnitTargetQuery;
  }

  return {
    ...base,
    count: count.max,
  } as unknown as UnitTargetQuery;
}

function parseTargetDescription(desc: string): {
  owner: "you" | "opponent" | "any";
  filters: UnitFilter[];
  zone?: TargetZone[];
} {
  const lower = desc.toLowerCase();
  let owner: "you" | "opponent" | "any" = "any";
  const filters: UnitFilter[] = [];
  let zone: TargetZone[] | undefined;

  // Controller -> Owner
  if (lower.includes("enemy") || lower.includes("opponent")) {
    owner = "opponent";
  } else if (lower.includes("your") || lower.includes("friendly")) {
    owner = "you";
  }

  // Zone
  if (lower.includes("discard") || lower.includes("trash")) {
    zone = ["trashArea"];
  } else if (lower.includes("hand")) {
    zone = ["hand"];
  }

  // Filters
  // 1. Stats
  const hpMatch = desc.match(/with (\d+) or less HP/i);
  if (hpMatch) {
    filters.push({
      type: "hp-comparison",
      comparison: "less-or-equal",
      value: Number.parseInt(hpMatch[1], 10),
    });
  }

  const apMatch = desc.match(/with (\d+) or less AP/i);
  if (apMatch) {
    filters.push({
      type: "ap-comparison",
      comparison: "less-or-equal",
      value: Number.parseInt(apMatch[1], 10),
    });
  }

  const costMatch = desc.match(/with (?:a )?cost (?:of )?(\d+) or less/i);
  if (costMatch) {
    filters.push({
      type: "cost-comparison",
      comparison: "less-or-equal",
      value: Number.parseInt(costMatch[1], 10),
    });
  }

  // 2. State
  if (lower.includes("damaged")) {
    filters.push({ type: "damaged" });
  }
  if (
    lower.includes("rested") ||
    lower.includes("exerted") ||
    lower.includes("rest mode")
  ) {
    filters.push({ type: "rested" });
  }
  if (lower.includes("active") || lower.includes("stand mode")) {
    filters.push({ type: "active" });
  }

  return { owner, filters, zone };
}
