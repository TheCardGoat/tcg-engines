import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  asPlayerId,
  createMockUnit,
  expectCardInTrash,
  expectSuccess,
  getContinuousEffects,
  hasGrantAttackTargetOption,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03BridgeCrew105 } from "./105-bridge-crew.ts";

describe("Bridge Crew (GD03-105)", () => {
  it("【Burst】 adds this card to hand", () => {
    const engine = GundamTestEngine.create({ deck: [gd03BridgeCrew105] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd03BridgeCrew105.cardNumber, asPlayerId(PLAYER_ONE));
    const p1 = engine.asPlayer(PLAYER_ONE);

    engine.fireShieldBurst(shieldId);

    expect(p1.getHand()).toContain(shieldId);
  });

  it("【Main】 grants a friendly Unit an active enemy Unit attack option", () => {
    const unit = createMockUnit();
    const enemy = createMockUnit();
    const engine = GundamTestEngine.create(
      { hand: [gd03BridgeCrew105], play: [unit], resourceArea: activeResources(4) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const cmdId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(gd03BridgeCrew105));

    expect(hasGrantAttackTargetOption(engine, unitId)).toBe(true);
    expectCardInTrash(engine, cmdId, p1.playerId);
  });

  it("stores the attack option as active enemy Units with no paired Pilot", () => {
    const unit = createMockUnit();
    const enemy = createMockUnit();
    const engine = GundamTestEngine.create(
      { hand: [gd03BridgeCrew105], play: [unit], resourceArea: activeResources(4) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd03BridgeCrew105));

    const grant = getContinuousEffects(engine).find(
      (effect) =>
        effect.targetId === unitId && effect.payload.kind === "grant-attack-target-option",
    );
    expect(grant?.payload).toMatchObject({
      kind: "grant-attack-target-option",
      attackTarget: {
        owner: "opponent",
        cardType: "unit",
        state: "active",
        attributeFilters: [{ attribute: "paired", comparison: "eq", value: false }],
      },
    });
  });
});
