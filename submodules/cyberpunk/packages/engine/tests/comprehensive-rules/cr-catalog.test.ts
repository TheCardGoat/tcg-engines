import { describe, expect, it } from "vite-plus/test";
import { structuredCards } from "@tcg/cyberpunk-cards";
import type { StructuredCardDefinition } from "@tcg/cyberpunk-types";
import { cover } from "./covered-rules.ts";

const DECK_CONSTRUCTION_EXCEPTION =
  /\b(?:your (?:main )?deck (?:must|may|cannot|can't)|deck requirements|RAM Limits?)\b/i;

function abilityTexts(card: StructuredCardDefinition): string[] {
  return (card.abilities ?? []).flatMap((ability) => {
    const texts: string[] = [];
    if ("text" in ability && typeof ability.text === "string") texts.push(ability.text);
    return texts;
  });
}

function hasGoSolo(card: StructuredCardDefinition): boolean {
  if (card.keywords?.includes("goSolo")) return true;
  if (/\bGO SOLO\b/i.test(card.rulesText ?? "")) return true;
  return (card.abilities ?? []).some(
    (ability) =>
      ("keyword" in ability && ability.keyword === "goSolo") ||
      ("text" in ability && typeof ability.text === "string" && /\bGO SOLO\b/i.test(ability.text)),
  );
}

describe("CR catalog constraints", () => {
  it("catalogues only Rebecca: Having a Moment without a tag", () => {
    const missing = structuredCards
      .filter((card) => card.classifications.length === 0)
      .map((card) => card.displayName);
    expect(missing).toEqual(["Rebecca: Having a Moment"]);
  });

  it("prints GO SOLO on every numeric-cost Legend, so Lag-on-play is always overridden", () => {
    cover("4.5.2");
    const missing = structuredCards
      .filter((card) => card.type === "legend" && typeof card.cost === "number")
      .filter((card) => !hasGoSolo(card))
      .map((card) => `${card.displayName} (cost ${card.cost})`);
    expect(missing).toEqual([]);
  });

  it("has no catalog card that grants a deck-construction exception", () => {
    cover("7.3.5");
    const exceptions = structuredCards
      .filter((card) =>
        [card.rulesText ?? "", ...abilityTexts(card)].some((text) =>
          DECK_CONSTRUCTION_EXCEPTION.test(text),
        ),
      )
      .map((card) => card.displayName);
    expect(exceptions).toEqual([]);
  });
});
