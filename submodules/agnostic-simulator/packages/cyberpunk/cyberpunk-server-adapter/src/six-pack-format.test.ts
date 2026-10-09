import { getMergedCyberpunkCards } from "@tcg/cyberpunk-cards";
import { describe, expect, it } from "vite-plus/test";
import { cyberpunkServerAdapter } from "./adapter";

describe("cyberpunk six-pack format", () => {
  it("accepts duplicate Legend copies from the registered pool", () => {
    const cards = getMergedCyberpunkCards();
    const legend = cards.find((card) => card.type === "legend")!;
    const unit = cards.find((card) => card.type === "unit" && card.color === "red")!;
    const result = cyberpunkServerAdapter.validateDeckForFormat(
      "six-pack",
      [
        { cardId: legend.canonicalId, quantity: 2, sectionId: "legend" },
        { cardId: unit.canonicalId, quantity: 30, sectionId: "main" },
      ],
      {
        documentFormatId: "six-pack",
        declarations: { colors: ["red"] },
        cardPool: { [legend.canonicalId]: 2, [unit.canonicalId]: 30 },
      },
    );
    expect(result.rules.filter((rule) => !rule.passed)).toEqual([]);
    expect(result.valid).toBe(true);
  });

  it("rejects a 6-Pack document in constructed and an Alpha document in 6-Pack", () => {
    const constructed = cyberpunkServerAdapter.validateDeckForFormat("constructed", [], {
      documentFormatId: "six-pack",
    });
    expect(constructed.valid).toBe(false);
    expect(constructed.rules.some((rule) => rule.kind === "format" && !rule.passed)).toBe(true);

    const sixPack = cyberpunkServerAdapter.validateDeckForFormat("six-pack", [], {
      documentFormatId: "alpha",
      declarations: { colors: ["red"] },
      cardPool: {},
    });
    expect(sixPack.valid).toBe(false);
    expect(sixPack.rules.some((rule) => rule.kind === "format" && !rule.passed)).toBe(true);
  });
});
