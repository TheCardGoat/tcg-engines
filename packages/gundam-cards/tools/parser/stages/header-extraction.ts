import type {
  EffectCondition,
  EffectCost,
  EffectRestriction,
} from "@tcg/gundam-types";

export interface Headers {
  restrictions: EffectRestriction[];
  costs: EffectCost[];
  conditions: EffectCondition[];
  cleanText: string;
}

export function extractHeaders(text: string): Headers {
  let processing = text;
  const restrictions: EffectRestriction[] = [];
  const costs: EffectCost[] = [];
  const conditions: EffectCondition[] = [];

  // 1. Extract Restrictions
  const restrictionPatterns = [
    { pattern: "【Once per Turn】", type: "ONCE_PER_TURN" as const },
    { pattern: "【Turn 1】", type: "MAX_PER_TURN" as const, value: 1 }, // Example
  ];

  for (const { pattern, type, value } of restrictionPatterns) {
    if (processing.includes(pattern)) {
      restrictions.push({ type, value });
      processing = processing.replace(pattern, "");
    }
  }

  // 2. Extract Costs
  // 2.1 Energy Cost (Circled numbers ①-⑨)
  // Unicode range: ① (U+2460) to ⑳ (U+2473)
  const energyMatch = processing.match(/^([①-⑳]+)(?:[:：])?\s*/);
  if (energyMatch) {
    const charCode = energyMatch[1].charCodeAt(0);
    // ① is 0x2460. Value is charCode - 0x2460 + 1
    const value = charCode - 0x2460 + 1;
    costs.push({ type: "ENERGY", amount: value });
    processing = processing.substring(energyMatch[0].length);
  }

  // 2.2 Bracket Costs [Text]
  // Sometimes combined with energy: ①[Discard 1 card]:
  // We need to handle sequence.
  // Actually, loop until no more costs found at start.

  let foundCost = true;
  while (foundCost) {
    foundCost = false;

    // Bracket Cost
    const bracketMatch = processing.match(/^\[([^\]]+)\](?:[:：])?\s*/);
    if (bracketMatch) {
      const costText = bracketMatch[1];
      if (costText.toLowerCase().includes("rest")) {
        costs.push({ type: "REST_SELF", amount: 1 });
      } else if (costText.toLowerCase().includes("discard")) {
        // "Discard 1 card from hand"
        const numMatch = costText.match(/\d+/);
        const amount = numMatch ? Number.parseInt(numMatch[0], 10) : 1;
        costs.push({ type: "DISCARD", amount });
      } else if (costText.toLowerCase().includes("return")) {
        costs.push({ type: "RETURN_TO_HAND", amount: 1 });
      }
      processing = processing.substring(bracketMatch[0].length);
      foundCost = true;
    }

    // 2.3 Unbracketed Cost ending with colon
    // e.g. "Rest this Unit："
    // Only verify if we haven't found a bracket cost in this iteration (or maybe sequence?)
    if (!foundCost) {
      // Look for specific patterns followed by colon
      const unbracketedMatch = processing.match(
        /^(Rest this (?:Unit|Base|Pilot)|Discard \d+ (?:card|cards))[:：]\s*/i,
      );
      if (unbracketedMatch) {
        const costText = unbracketedMatch[1];
        if (costText.toLowerCase().includes("rest")) {
          costs.push({ type: "REST_SELF", amount: 1 });
        } else if (costText.toLowerCase().includes("discard")) {
          const numMatch = costText.match(/\d+/);
          const amount = numMatch ? Number.parseInt(numMatch[0], 10) : 1;
          costs.push({ type: "DISCARD", amount });
        }
        processing = processing.substring(unbracketedMatch[0].length);
        foundCost = true;
      }
    }
  }

  // Cleanup colon if left (e.g. after restriction but before text)
  processing = processing.replace(/^[:：]\s*/, "");

  return {
    restrictions,
    costs: costs,
    conditions,
    cleanText: processing.trim(),
  };
}
