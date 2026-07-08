import type { Card } from "@tcg/gundam-types";
import * as GundamCards from "./cards/index.ts";

const runtimeCards = Object.values(GundamCards)
  .filter(isCard)
  .sort((a, b) => a.cardNumber.localeCompare(b.cardNumber));

export interface GundamCardsRuntimeFingerprint {
  packageName: "@tcg/gundam-cards";
  cardCount: number;
  hash: string;
}

export const GUNDAM_CARDS_RUNTIME: GundamCardsRuntimeFingerprint = {
  packageName: "@tcg/gundam-cards",
  cardCount: runtimeCards.length,
  hash: runtimeHash(runtimeCards),
};

function isCard(value: unknown): value is Card {
  return (
    typeof value === "object" &&
    value !== null &&
    "cardNumber" in value &&
    typeof (value as { cardNumber: unknown }).cardNumber === "string"
  );
}

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
