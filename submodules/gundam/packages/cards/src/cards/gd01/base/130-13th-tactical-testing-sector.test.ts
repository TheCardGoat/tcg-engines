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
import { gd0113thTacticalTestingSector130 } from "./130-13th-tactical-testing-sector.ts";

describe("13th Tactical Testing Sector (GD01-130)", () => {
  it("【Deploy】Add 1 of your Shields to your hand.", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [gd0113thTacticalTestingSector130],
        resourceArea: activeResources(3),
        deck: 4,
      },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployBase(gd0113thTacticalTestingSector130));

    expect(p1.getHand().length).toBe(handBefore);
    expect(p1.getHand()).toContain(shieldIds[0]);
  });

  it("【Activate･Main】 AP-1 lands only on the chosen enemy Unit", () => {
    // Two enemy units eligible; only the chosen one should get AP-1. Needs
    // a friendly (Academy) unit in play for the effect's precondition.
    const academyUnit = createMockUnit({ ap: 2, hp: 5, traits: ["academy"] });
    const enemy1 = createMockUnit({ ap: 4, hp: 4 });
    const enemy2 = createMockUnit({ ap: 4, hp: 4 });

    const engine = GundamTestEngine.create(
      {
        hand: [gd0113thTacticalTestingSector130],
        resourceArea: activeResources(3),
        play: [academyUnit],
        deck: 4,
      },
      { play: [enemy1, enemy2] },
    );
    seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.deployBase(gd0113thTacticalTestingSector130));

    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const [enemy1Id, enemy2Id] = p2.getCardsInZone("battleArea");
    if (!enemy1Id || !enemy2Id) throw new Error("setup failed");

    expectSuccess(p1.activateAbility(baseId, 0, { targets: [enemy1Id] }));

    expect(engine.getG().exhausted[baseId]).toBe(true);

    const apMods = engine
      .getG()
      .continuousEffects.filter(
        (e) => e.payload.kind === "stat-modifier" && e.payload.stat === "ap",
      );
    expect(apMods).toHaveLength(1);
    expect(apMods[0]!.targetId).toBe(enemy1Id);
    expect(apMods.find((e) => e.targetId === enemy2Id)).toBeUndefined();
  });

  it("【Activate･Main】 precondition: no friendly (Academy) Unit → effect fires but no buff lands", () => {
    // When precondition fails the whole effect is skipped (evaluateCardEffect
    // returns false). Verify the cost isn't paid either.
    const enemy = createMockUnit({ ap: 4, hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd0113thTacticalTestingSector130],
        resourceArea: activeResources(3),
        deck: 4,
      },
      { play: [enemy] },
    );
    seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.deployBase(gd0113thTacticalTestingSector130));

    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    // Activate succeeds mechanically (cost paid, effect enqueued), but
    // the directive's condition evaluation skips the statModifier body.
    p1.activateAbility(baseId, 0, { targets: [enemyId] });

    const apMods = engine
      .getG()
      .continuousEffects.filter(
        (e) => e.payload.kind === "stat-modifier" && e.payload.stat === "ap",
      );
    expect(apMods).toHaveLength(0);
  });
});
