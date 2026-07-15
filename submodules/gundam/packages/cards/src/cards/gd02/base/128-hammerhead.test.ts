import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  activeResources,
  createMockPilot,
  seedBaseAsShield,
  seedShieldsFromDeck,
  createMockUnit,
} from "@tcg/gundam-engine";
import { gd02Hammerhead128 } from "./128-hammerhead.ts";

describe("Hammerhead (GD02-128)", () => {
  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const engine = GundamTestEngine.create(
      { hand: [gd02Hammerhead128], resourceArea: activeResources(6), deck: 6 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployBase(gd02Hammerhead128));

    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getHand().length).toBe(handBefore);
    expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE }).length).toBe(1);
  });

  it("【Deploy】 destroys an enemy Unit with AP ≤ 2 when friendly (Teiwaz) Link Unit is in play during your turn", () => {
    const teiwazUnit = createMockUnit({
      ap: 3,
      hp: 3,
      traits: ["teiwaz"],
      linkCondition: "[Teiwaz Pilot]",
    });
    const teiwazPilot = createMockPilot({ name: "Teiwaz Pilot", level: 1, cost: 1 });
    const enemyWeak = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02Hammerhead128, teiwazPilot],
        play: [teiwazUnit],
        shieldArea: [createMockUnit({ name: "Returned Shield" })],
        resourceArea: activeResources(6),
      },
      { play: [enemyWeak] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [teiwazId] = p1.getCardsInZone("battleArea");
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(teiwazPilot, teiwazId!));
    expectSuccess(p1.deployBase(gd02Hammerhead128));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([enemyId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId!] }));

    expect(p2.getCardZone(enemyId!)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("【Burst】 Deploy this card — flips Hammerhead into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd02Hammerhead128] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd02Hammerhead128);

    engine.fireShieldBurst(shieldId);

    const finalZone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(finalZone).toBe(`baseSection:${PLAYER_TWO}`);
  });
});
