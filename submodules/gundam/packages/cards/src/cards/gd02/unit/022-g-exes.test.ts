import { describe, it, expect } from "vite-plus/test";
import { gd02GExes022 } from "./022-g-exes.ts";

describe("G-Exes (GD02-022)", () => {
  it("data: timing is onExResourcePlaced with oncePerTurn restriction", () => {
    const effect = gd02GExes022.effects?.[0];
    expect(effect?.type).toBe("triggered");
    expect(effect?.activation.timing).toEqual(["onExResourcePlaced"]);
    expect(effect?.activation.restrictions).toEqual([{ type: "oncePerTurn" }]);
  });

  it("directive grants Breach 2 to a friendly AGE System unit for this turn", () => {
    const effect = gd02GExes022.effects?.[0];
    const directive = effect?.directives?.[0] as { action?: unknown } | undefined;
    expect(directive?.action).toEqual({
      action: "grantKeyword",
      keyword: "Breach",
      keywordValue: 2,
      duration: "thisTurn",
      target: {
        owner: "friendly",
        cardType: "unit",
        count: 1,
        attributeFilters: [{ attribute: "trait", comparison: "includes", value: "AGE System" }],
      },
    });
  });
});
