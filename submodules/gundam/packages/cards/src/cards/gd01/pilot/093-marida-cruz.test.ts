import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd01MaridaCruz093 } from "./093-marida-cruz.ts";

describe("Marida Cruz (GD01-093)", () => {
  it("【Burst】Add this card to your hand.", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd01MaridaCruz093] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd01MaridaCruz093.cardNumber, asPlayerId(PLAYER_TWO));

    engine.fireShieldBurst(shieldId);

    const zone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(zone).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【During Link】【Attack】Choose 1 enemy Unit whose Lv. is equal to or lower than this Unit. Deal 1 damage to it.", () => {
    // Marida Cruz's Lv. 4 pilot text: "Choose 1 enemy Unit whose Lv. is
    // equal to or lower than this Unit". Pilot-resident "this Unit" refers
    // to the paired unit (rule 3-3-9-1). With the source-stat sentinel
    // landed, the filter's RHS resolves to the paired unit's Lv., so
    // candidates at or below that Lv. qualify.
    //
    // The unit needs `[Marida Cruz]` link condition so the paired pilot
    // forms a link unit, which then gates the trigger's `duringLink` timing.
    const unit = createMockUnit({
      ap: 2,
      hp: 5,
      level: 4,
      cost: 2,
      linkCondition: "[Marida Cruz]",
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const lowEnemy = createMockUnit({ name: "Low", ap: 1, hp: 5, level: 3, cost: 2 });
    const highEnemy = createMockUnit({ name: "High", ap: 1, hp: 5, level: 5, cost: 2 });

    const engine = GundamTestEngine.create(
      {
        hand: [unit, gd01MaridaCruz093],
        resourceArea: activeResources(5),
        deck: 5,
      },
      {
        play: [
          { card: lowEnemy, exhausted: true },
          { card: highEnemy, exhausted: true },
        ],
        deck: 5,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.deployUnit(unit));
    expectSuccess(p1.assignPilot(gd01MaridaCruz093, unit));

    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const [lowId, highId] = p2.getCardsInZone("battleArea");

    // Attack → Marida's pilot-resident 【During Link】【Attack】 enqueues
    // via the observer scan (PR #122 includes paired pilots).
    expectSuccess(p1.enterBattle(unit, lowId!));

    if (engine.getPendingChoice()) {
      // Only the Lv.-≤-4 enemy is eligible — pick it.
      expectSuccess(p1.resolveEffect({ targets: [lowId!] }));
    }

    expect(getDamageCounter(engine, lowId!)).toBe(1);
    expect(getDamageCounter(engine, highId!)).toBe(0);

    // Reference unitId to silence unused-warning when debugging.
    void unitId;
  });

  it("【During Link】【Attack】 does NOT fire when the paired unit is not a Link Unit", () => {
    // Host's link condition names a different pilot, so pairing Marida
    // leaves the unit paired-but-not-linked. The composite
    // `["duringLink", "attack"]` must be filtered by the continuous
    // link-state gate (`fix/pilot-resident-attack-trigger`) so the pilot's
    // own trigger does NOT fire on attackDeclared, and the directive's
    // damage is not applied.
    const hostUnit = createMockUnit({
      ap: 3,
      hp: 5,
      level: 4,
      cost: 2,
      linkCondition: "[Some Other Pilot]",
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const enemy = createMockUnit({ ap: 1, hp: 3, level: 2 });
    const engine = GundamTestEngine.create(
      { hand: [hostUnit, gd01MaridaCruz093], resourceArea: activeResources(6) },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.deployUnit(hostUnit));
    expectSuccess(p1.assignPilot(gd01MaridaCruz093, hostUnit));

    const [attackerId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    if (!attackerId) throw new Error("attacker missing");
    engine.getG().exhausted[attackerId] = false;
    engine.getG().turnMetadata.deployedThisTurn = [];

    // No pilot-resident trigger fires, and the enemy takes no pre-combat
    // damage from the pilot's directive (combat damage is resolved later
    // in the flow and doesn't affect `damage[enemyId]` at this point).
    expectSuccess(p1.enterBattle(hostUnit, enemyId));
    expect(engine.getG().damage[enemyId] ?? 0).toBe(0);
  });
});
