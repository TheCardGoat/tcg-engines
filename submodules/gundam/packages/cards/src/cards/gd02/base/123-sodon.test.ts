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
import { gd02Sodon123 } from "./123-sodon.ts";

describe("Sodon (GD02-123)", () => {
  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const engine = GundamTestEngine.create(
      { hand: [gd02Sodon123], resourceArea: activeResources(6), deck: 6 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployBase(gd02Sodon123));

    // Top shield enters hand; hand count unchanged (base out, shield in).
    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getHand().length).toBe(handBefore);
    expect(engine.getCardsInZone({ zone: "shieldArea", playerId: PLAYER_ONE })).toEqual([
      shieldIds[1],
    ]);
    expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE }).length).toBe(1);
  });

  it("【Burst】 Deploy this card — flips Sodon into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd02Sodon123] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd02Sodon123);

    engine.fireShieldBurst(shieldId);

    const finalZone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(finalZone).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("chooseAttackTarget unit filter restricts to friendly Unit token", () => {
    // The card-data `unit` filter now includes `isToken: true` so only
    // friendly token units are valid targets for the attack-target grant.
    const cardDef = gd02Sodon123;
    const deployEffect = cardDef.effects![1];
    // Second directive is the chooseAttackTarget
    const chooseDirective = (
      deployEffect as { directives: Array<{ action?: Record<string, unknown> }> }
    ).directives[1]!;
    const action = chooseDirective.action!;
    expect(action.action).toBe("chooseAttackTarget");
    const unit = action.unit as { isToken?: boolean };
    expect(unit.isToken).toBe(true);
  });
});
