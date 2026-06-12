import { describe, it, expect } from "vite-plus/test";
import { gd02RaiderGundam010 } from "./010-raider-gundam.ts";

describe("Raider Gundam (GD02-010)", () => {
  it("data: timing is onEnemyEffectDamage with oncePerTurn restriction", () => {
    const effect = gd02RaiderGundam010.effects?.[0];
    expect(effect?.type).toBe("triggered");
    expect(effect?.activation.timing).toEqual(["onEnemyEffectDamage"]);
    expect(effect?.activation.restrictions).toEqual([{ type: "oncePerTurn" }]);
  });

  it("directive draws 1 card", () => {
    const effect = gd02RaiderGundam010.effects?.[0];
    const directive = effect?.directives?.[0] as { action?: unknown } | undefined;
    expect(directive?.action).toEqual({ action: "draw", count: 1 });
  });
});
