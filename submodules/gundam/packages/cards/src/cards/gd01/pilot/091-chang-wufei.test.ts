import { describe, expect, it } from "vite-plus/test";
import { GundamTestEngine, PLAYER_TWO, asPlayerId, seedShieldsFromDeck } from "@tcg/gundam-engine";
import { gd01ChangWufei091 } from "./091-chang-wufei.ts";

describe("Chang Wufei (GD01-091)", () => {
  it("【Burst】 Add this card to your hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd01ChangWufei091] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd01ChangWufei091.cardNumber, asPlayerId(PLAYER_TWO));

    engine.fireShieldBurst(shieldId);

    const zone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(zone).toBe(`hand:${PLAYER_TWO}`);
  });

  it("declares preventDamage with damageType battle and AP <= 3 unitFilter", () => {
    const constantEffect = gd01ChangWufei091.effects?.find((e) => e.type === "constant");
    expect(constantEffect).toBeDefined();
    // biome-ignore lint/suspicious/noExplicitAny: structural test
    const action = (constantEffect as any).directives?.[0]?.action;
    expect(action?.action).toBe("preventDamage");
    expect(action?.damageType).toBe("battle");
    expect(action?.unitFilter?.attributeFilters?.[0]).toMatchObject({
      attribute: "ap",
      comparison: "lte",
      value: 3,
    });
  });

  it("constant effect conditions require friendly turn and selfHasKeyword Breach", () => {
    const constantEffect = gd01ChangWufei091.effects?.find((e) => e.type === "constant");
    expect(constantEffect).toBeDefined();
    const conditions = constantEffect!.activation.conditions ?? [];
    expect(conditions).toContainEqual({ type: "isTurn", whose: "friendly" });
    expect(conditions).toContainEqual({ type: "selfHasKeyword", keyword: "Breach" });
  });
});
