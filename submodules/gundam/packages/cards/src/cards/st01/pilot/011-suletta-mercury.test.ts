import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockResource,
  createMockUnit,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st01SulettaMercury011 } from "./011-suletta-mercury.ts";

describe("Suletta Mercury (ST01-011)", () => {
  it("【Burst】 Add this card to your hand — moves shield into hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [st01SulettaMercury011] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【Attack】【Once per Turn】 — set a resource active", () => {
    const restedRes = createMockResource();
    const linkUnit = createMockUnit({
      ap: 3,
      hp: 5,
      level: 1,
      cost: 1,
      linkCondition: "[Suletta Mercury]",
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const defender = createMockUnit({ ap: 1, hp: 5 });

    const engine = GundamTestEngine.create(
      {
        hand: [linkUnit, st01SulettaMercury011],
        resourceArea: [...activeResources(4), { card: restedRes, exhausted: true }],
        deck: 5,
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.deployUnit(linkUnit));
    expectSuccess(p1.assignPilot(st01SulettaMercury011, linkUnit));

    const restedId = p1
      .getCardsInZone("resourceArea")
      .find((id) => engine.getG().exhausted[id] === true);
    if (!restedId) throw new Error("setup: no rested resource");

    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.enterBattle(linkUnit, defenderId));

    // Suletta's 【Attack】 setActive fired → rested resource is now active.
    expect(engine.getG().exhausted[restedId]).toBe(false);
  });
});
