import { DSL_VERSION } from "@tcg/cyberpunk-types";
import { alphaCards } from "./alpha/index.ts";
import { promoCards } from "./promo/index.ts";
import { spoilerCards } from "./spoiler/index.ts";

const runtimeCards = [...alphaCards, ...spoilerCards, ...promoCards];

export interface CyberpunkCardsRuntimeFingerprint {
  packageName: "@tcg/cyberpunk-cards";
  dslVersion: number;
  cardCount: number;
  hash: string;
}

export const CYBERPUNK_CARDS_RUNTIME: CyberpunkCardsRuntimeFingerprint = {
  packageName: "@tcg/cyberpunk-cards",
  dslVersion: DSL_VERSION,
  cardCount: runtimeCards.length,
  // Hash the complete structured card definitions so diagnostics catch changes
  // to gameplay-relevant fields such as RAM, classifications, legality, Sell
  // tags, abilities, and surface stats.
  hash: runtimeHash(runtimeCards),
};

function runtimeHash(value: unknown): string {
  const input = stableStringify(value);
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function stableStringify(value: unknown): string {
  if (typeof value === "function") {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, nested]) => `${JSON.stringify(key)}:${stableStringify(nested)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "undefined";
}
