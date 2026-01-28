import type {
  GundamFilter,
  GundamLocationsId,
  TargetQuery,
} from "@tcg/gundam-types";

export interface TargetParseResult {
  query: TargetQuery | TargetQuery[];
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
        {
          controller: result1.controller,
          cardType: result1.cardType,
          count: count1,
          filters: result1.filters,
          zone: result1.zone,
        },
        {
          controller: result2.controller,
          cardType: result2.cardType,
          count: count2,
          filters: result2.filters,
          zone: result2.zone,
        },
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
    const { controller, cardType, filters, zone } =
      parseTargetDescription(desc);

    return {
      query: {
        controller,
        cardType,
        count,
        filters,
        zone,
      },
      remainingText: text.substring(chooseMatch[0].length).trim(),
    };
  }

  // 2. "All ..." pattern
  if (lower.startsWith("all ")) {
    // Need to find end of target description. usually until "." or end.
    const match = text.match(/^All (.*?)(?:\.|$)/i);
    if (match) {
      const desc = match[1];
      const { controller, cardType, filters, zone } =
        parseTargetDescription(desc);
      return {
        query: {
          controller,
          cardType,
          filters, // No count means all
          zone,
        },
        remainingText: text.substring(match[0].length).trim(),
      };
    }
  }

  // 3. "This Unit"
  if (lower.startsWith("this unit")) {
    return {
      query: {
        controller: "SELF",
        cardType: "UNIT",
        filters: [], // Implicit self
        count: { min: 1, max: 1 },
      },
      remainingText: text.substring("this unit".length).trim(),
    };
  }

  return null;
}

function parseTargetDescription(desc: string): {
  controller: "SELF" | "OPPONENT" | "ANY";
  cardType?: "UNIT" | "PILOT" | "BASE" | "COMMAND";
  filters: GundamFilter[];
  zone?: GundamLocationsId[];
} {
  const lower = desc.toLowerCase();
  let controller: "SELF" | "OPPONENT" | "ANY" = "ANY";
  let cardType: "UNIT" | "PILOT" | "BASE" | "COMMAND" | undefined;
  const filters: GundamFilter[] = [];
  let zone: GundamLocationsId[] | undefined;

  // Controller
  if (lower.includes("enemy") || lower.includes("opponent")) {
    controller = "OPPONENT";
  } else if (lower.includes("your") || lower.includes("friendly")) {
    controller = "SELF";
  }

  // Card Type
  if (lower.includes("unit")) cardType = "UNIT";
  else if (lower.includes("pilot")) cardType = "PILOT";
  else if (lower.includes("base")) cardType = "BASE";
  else if (lower.includes("command")) cardType = "COMMAND";
  else if (lower.includes("card")) {
    /* Generic */
  }

  // Zone (e.g. "in your discard pile", "in hand")
  if (lower.includes("discard") || lower.includes("trash")) {
    zone = ["trashArea"];
  } else if (lower.includes("hand")) {
    zone = ["handArea"];
  }

  // Filters
  // 1. Stats: "with X or less HP"
  const hpMatch = desc.match(/with (\d+) or less HP/i);
  if (hpMatch) {
    filters.push({
      type: "hp",
      comparison: "lte",
      value: Number.parseInt(hpMatch[1], 10),
    });
  }

  const apMatch = desc.match(/with (\d+) or less AP/i);
  if (apMatch) {
    filters.push({
      type: "ap",
      comparison: "lte",
      value: Number.parseInt(apMatch[1], 10),
    });
  }

  const costMatch = desc.match(/with (?:a )?cost (?:of )?(\d+) or less/i);
  if (costMatch) {
    filters.push({
      type: "cost",
      comparison: "lte",
      value: Number.parseInt(costMatch[1], 10),
    });
  }

  // 2. State: "damaged"
  if (lower.includes("damaged")) {
    filters.push({ type: "damaged" });
  }
  if (
    lower.includes("rested") ||
    lower.includes("exerted") ||
    lower.includes("rest mode")
  ) {
    filters.push({ type: "exerted" });
  }
  if (lower.includes("active") || lower.includes("stand mode")) {
    filters.push({ type: "ready" });
  }

  return { controller, cardType, filters, zone };
}
