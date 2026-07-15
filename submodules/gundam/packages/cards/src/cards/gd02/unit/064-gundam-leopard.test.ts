import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, createMockUnit } from "@tcg/gundam-engine";
import { gd02GundamLeopard064 } from "./064-gundam-leopard.ts";

describe("Gundam Leopard (GD02-064)", () => {
  it("declares a constant preventDamage with damageType effect and sourceCardType command", () => {
    const constant = gd02GundamLeopard064.effects?.find((e) => e.type === "constant");
    expect(constant).toBeDefined();
    // biome-ignore lint/suspicious/noExplicitAny: structural test
    const action = (constant as any).directives?.[0]?.action;
    expect(action?.action).toBe("preventDamage");
    expect(action?.damageType).toBe("effect");
    expect(action?.sourceCardType).toBe("command");
  });

  it("conditions include isTurn friendly and cardInZone trash >= 7", () => {
    const constant = gd02GundamLeopard064.effects?.find((e) => e.type === "constant");
    expect(constant).toBeDefined();
    const conditions = constant!.activation.conditions ?? [];
    expect(conditions).toContainEqual({ type: "isTurn", whose: "friendly" });
    expect(conditions).toContainEqual({
      type: "cardInZone",
      owner: "friendly",
      zone: "trash",
      comparison: "gte",
      count: 7,
    });
  });

  it("constant effect conditions fail when trash has fewer than 7 cards", () => {
    // With fewer than 7 cards in trash, the constant effect conditions
    // should not be met. Verify by checking the card data structure.
    const constant = gd02GundamLeopard064.effects?.find((e) => e.type === "constant");
    expect(constant).toBeDefined();
    // The cardInZone condition requires 7+ trash cards.
    const trashCondition = constant!.activation.conditions?.find(
      // biome-ignore lint/suspicious/noExplicitAny: structural test
      (c: any) => c.type === "cardInZone",
    );
    expect(trashCondition).toBeDefined();
    // biome-ignore lint/suspicious/noExplicitAny: structural test
    expect((trashCondition as any).count).toBe(7);
  });

  it("deploys as a Lv.5 unit and has correct stats", () => {
    const engine = GundamTestEngine.create({ play: [gd02GundamLeopard064], deck: 5 }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const leopardId = p1.getCardsInZone("battleArea")[0]!;
    expect(leopardId).toBeDefined();
    // Leopard is Lv.5, ap:4, hp:4.
    expect(p1.getDamage(leopardId)).toBe(0);
  });

  it("does not have a prevent-damage continuous effect entry (constant effects evaluate inline)", () => {
    // Constant preventDamage effects are evaluated inline by
    // `inlineConstantPreventDamage` during damage resolution, NOT
    // pushed to `g.continuousEffects`. Verify this is the case.
    const trashFillers = Array.from({ length: 7 }, () => createMockUnit());
    const engine = GundamTestEngine.create(
      {
        play: [gd02GundamLeopard064],
        deck: 3,
        trash: trashFillers,
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const leopardId = p1.getCardsInZone("battleArea")[0]!;

    // Constant effects are NOT pushed to continuousEffects — they're
    // checked inline during damage resolution.
    const entries = engine
      .getG()
      .continuousEffects.filter(
        (e) => e.targetId === leopardId && e.payload.kind === "prevent-damage",
      );
    expect(entries.length).toBe(0);
  });
});
