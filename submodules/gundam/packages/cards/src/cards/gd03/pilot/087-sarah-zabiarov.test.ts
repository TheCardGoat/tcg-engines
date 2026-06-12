import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03SarahZabiarov087 } from "./087-sarah-zabiarov.ts";

describe("Sarah Zabiarov (GD03-087)", () => {
  it("【Burst】 adds this card to hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03SarahZabiarov087] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【When Linked】 rests an enemy Unit that is Lv.3 or lower", () => {
    const host = createMockUnit({ linkCondition: "[Sarah Zabiarov]" });
    const enemy = createMockUnit({ level: 3 });
    const engine = GundamTestEngine.create(
      { hand: [host, gd03SarahZabiarov087], resourceArea: activeResources(3) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(host));
    expectSuccess(p1.assignPilot(gd03SarahZabiarov087, host));

    expect(engine.getG().exhausted[enemyId]).toBe(true);
  });
});
