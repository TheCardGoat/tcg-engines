import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd02HamanKarn091 } from "./091-haman-karn.ts";

describe("Haman Karn (GD02-091)", () => {
  it("【Burst】Add this card to your hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd02HamanKarn091] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【When Paired】 (source-stat sentinel): deals 1 damage to an eligible enemy Unit", () => {
    // Haman's Lv. 5 pilot text: "choose 1 enemy Unit whose Lv. is equal to
    // or lower than this Unit". Pilot-resident "this Unit" resolves to the
    // paired unit (rule 3-3-9-1); the source-stat sentinel reads the unit's
    // Lv. (here 5). `lowEnemy` at Lv. 3 qualifies; `highEnemy` at Lv. 6
    // does not. The gate also requires the paired unit to be red
    // (`selfIsColor: "red"` on the activation).
    const unit = createMockUnit({
      ap: 2,
      hp: 5,
      level: 5,
      cost: 3,
      color: "red",
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const lowEnemy = createMockUnit({ name: "Low", ap: 2, hp: 3, level: 3, cost: 2 });
    const highEnemy = createMockUnit({ name: "High", ap: 2, hp: 3, level: 6, cost: 2 });

    const engine = GundamTestEngine.create(
      {
        hand: [gd02HamanKarn091],
        play: [unit],
        resourceArea: activeResources(6),
        deck: 5,
      },
      { play: [lowEnemy, highEnemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const [lowId, highId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(gd02HamanKarn091, unitId));

    if (engine.getPendingChoice()) {
      // Only the low-Lv. enemy should be selectable — choose it.
      expectSuccess(p1.resolveEffect({ targets: [lowId!] }));
    }

    expect(getDamageCounter(engine, lowId!)).toBe(1);
    expect(getDamageCounter(engine, highId!)).toBe(0);
  });
});
