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
import { gd02Diva124 } from "./124-diva.ts";

describe("Diva (GD02-124)", () => {
  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const engine = GundamTestEngine.create(
      { hand: [gd02Diva124], resourceArea: activeResources(6), deck: 6 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployBase(gd02Diva124));

    // Top shield enters hand; hand count unchanged (base out, shield in).
    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getHand().length).toBe(handBefore);
    expect(engine.getCardsInZone({ zone: "shieldArea", playerId: PLAYER_ONE })).toEqual([
      shieldIds[1],
    ]);
    expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE }).length).toBe(1);
  });

  it("【Burst】 Deploy this card — flips Diva into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd02Diva124] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd02Diva124);

    engine.fireShieldBurst(shieldId);

    const finalZone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(finalZone).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("card data encodes AP+1 as a constant effect with isTurn + playerLevel gates", () => {
    // Previously encoded as a deploy-triggered permanent statModifier with a
    // unit-level attribute filter. Now correctly split into a separate constant
    // effect with isTurn(friendly) + playerLevel(gte 7) activation conditions.
    const cardDef = gd02Diva124;
    // effects[0] = burst, effects[1] = deploy (addShieldToHand), effects[2] = constant AP+1
    const constantEffect = cardDef.effects![2] as {
      type: string;
      activation: { timing?: string[]; conditions?: Array<{ type: string }> };
      directives: Array<{ action?: Record<string, unknown> }>;
    };
    expect(constantEffect.type).toBe("constant");
    expect(constantEffect.activation.timing).toBeUndefined();
    expect(constantEffect.activation.conditions).toContainEqual({
      type: "isTurn",
      whose: "friendly",
    });
    expect(constantEffect.activation.conditions).toContainEqual({
      type: "playerLevel",
      comparison: "gte",
      value: 7,
    });
    const action = constantEffect.directives[0]!.action!;
    expect(action.action).toBe("statModifier");
    expect(action.stat).toBe("ap");
    expect(action.amount).toBe(1);
    const target = action.target as {
      owner: string;
      cardType: string;
      attributeFilters: Array<{ value: string }>;
    };
    expect(target.owner).toBe("friendly");
    expect(target.cardType).toBe("unit");
    expect(target.attributeFilters![0]!.value).toBe("earth federation");
  });
});
