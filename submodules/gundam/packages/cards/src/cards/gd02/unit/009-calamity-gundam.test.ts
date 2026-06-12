import { describe, it, expect } from "vite-plus/test";
import { gd02CalamityGundam009 } from "./009-calamity-gundam.ts";

describe("Calamity Gundam (GD02-009)", () => {
  it("data: timing is onApReducedByEnemy with oncePerTurn restriction", () => {
    const effect = gd02CalamityGundam009.effects?.[0];
    expect(effect?.type).toBe("triggered");
    expect(effect?.activation.timing).toEqual(["onApReducedByEnemy"]);
    expect(effect?.activation.restrictions).toEqual([{ type: "oncePerTurn" }]);
  });

  it("directive targets a rested enemy unit and deals 2 damage", () => {
    const effect = gd02CalamityGundam009.effects?.[0];
    const directive = effect?.directives?.[0] as { action?: unknown } | undefined;
    expect(directive?.action).toEqual({
      action: "dealDamage",
      amount: 2,
      target: {
        owner: "opponent",
        cardType: "unit",
        state: "rested",
        count: 1,
      },
    });
  });
});
