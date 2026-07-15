import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  activeResources,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd02Argama129 } from "./129-argama.ts";

describe("Argama (GD02-129)", () => {
  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const engine = GundamTestEngine.create(
      { hand: [gd02Argama129], resourceArea: activeResources(3), deck: 6 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployBase(gd02Argama129));

    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getHand().length).toBe(handBefore); // base out, shield in
    expect(engine.getCardsInZone({ zone: "shieldArea", playerId: PLAYER_ONE })).toEqual([
      shieldIds[1],
    ]);
    expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE }).length).toBe(1);
  });

  it("【Burst】 Deploy this card — flips Argama into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd02Argama129] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd02Argama129);

    engine.fireShieldBurst(shieldId);

    const finalZone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(finalZone).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("declares a constant preventDamage with damageType effect (self-targeting)", () => {
    const constant = gd02Argama129.effects?.find(
      (e) => e.type === "constant" && e.sourceText.includes("effect damage"),
    );
    expect(constant).toBeDefined();
    // biome-ignore lint/suspicious/noExplicitAny: structural test
    const action = (constant as any).directives?.[0]?.action;
    expect(action?.action).toBe("preventDamage");
    expect(action?.damageType).toBe("effect");
    expect(action?.target?.owner).toBe("self");
    // No unitFilter — blocks ALL enemy effect damage.
    expect(action?.unitFilter).toBeUndefined();
    expect(action?.sourceCardType).toBeUndefined();
  });
});
