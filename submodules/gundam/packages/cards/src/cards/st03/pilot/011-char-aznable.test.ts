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
import { st03CharAznable011 } from "./011-char-aznable.ts";

describe("Char Aznable (ST03-011)", () => {
  it("【Burst】 Add this card to your hand — moves shield into hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [st03CharAznable011] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【Attack】 grants AP+1 to the paired unit when it attacks", () => {
    // Pilot-resident multi-directive 【Attack】 trigger. First directive
    // applies AP+1 via `{ owner: "self", cardType: "unit" }` — "self" on
    // a pilot source resolves to the paired unit (rule 3-3-9-1). Second
    // directive (`grantKeyword` gated on `isLinkUnit: true`) is a no-op
    // here since this mock unit isn't a link unit; we just verify the
    // trigger fires and parks an AP-modifier continuous effect.
    const unit = createMockUnit({
      ap: 2,
      hp: 5,
      level: 3,
      cost: 1,
      linkCondition: "[Char Aznable]",
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const enemy = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [unit, st03CharAznable011], resourceArea: activeResources(6) },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.deployUnit(unit));
    expectSuccess(p1.assignPilot(st03CharAznable011, unit));

    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.enterBattle(unit, enemyId));

    // Pilot's 【Attack】 fired via observer-scan, and its first directive
    // (`owner: "self"` → paired unit) parked a thisTurn AP+1 modifier.
    const effects = engine.getG().continuousEffects;
    const apBuff = effects.find(
      (e: ContinuousEffectEntry) =>
        e.duration === "this-turn" &&
        e.payload.kind === "stat-modifier" &&
        e.payload.stat === "ap" &&
        e.payload.modifier === 1,
    );
    expect(apBuff).toBeDefined();
  });
});
