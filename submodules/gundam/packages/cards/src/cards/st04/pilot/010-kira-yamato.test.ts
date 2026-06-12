import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  type ContinuousEffectEntry,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st04KiraYamato010 } from "./010-kira-yamato.ts";

describe("Kira Yamato (ST04-010)", () => {
  it("【Burst】 Add this card to your hand — moves shield into hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [st04KiraYamato010] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【Attack】 applies AP-2 to the sole enemy unit when the paired unit attacks", () => {
    // Mirrors beta/pilot/010-kira-yamato's Attack-trigger test: the paired
    // pilot's own 【Attack】 trigger fires via the observer scan at
    // enterBattle and auto-targets the lone enemy, landing a "this-battle"
    // continuous entry.
    const unit = createMockUnit({
      ap: 2,
      hp: 5,
      level: 4,
      cost: 1,
      // Dummy linkCondition so the pair counts as a Link Unit and the
      // unit can attack the deploy turn (rule 3-2-6-3).
      linkCondition: "[Kira Yamato]",
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const enemy = createMockUnit({ ap: 5, hp: 3 });
    const engine = GundamTestEngine.create(
      { hand: [unit, st04KiraYamato010], resourceArea: activeResources(6) },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.deployUnit(unit));
    expectSuccess(p1.assignPilot(st04KiraYamato010, unit));

    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.enterBattle(unit, enemyId));

    // thisBattle AP-2 applied via the pilot's own 【Attack】 trigger.
    expect(
      engine
        .getG()
        .continuousEffects.some((e: ContinuousEffectEntry) => e.duration === "this-battle"),
    ).toBe(true);
  });
});
