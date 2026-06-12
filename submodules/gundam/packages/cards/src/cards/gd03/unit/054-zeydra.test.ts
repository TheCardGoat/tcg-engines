import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd03Zeydra054 } from "./054-zeydra.ts";

describe("Zeydra (GD03-054)", () => {
  it("has High-Maneuver", () => {
    const engine = GundamTestEngine.create({ play: [gd03Zeydra054] });
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    expect(getEffectiveStats(unitId, engine.getG(), framework.cards, framework).keywords).toContain(
      "HighManeuver",
    );
  });

  it("【When Paired･(X-Rounder) Pilot】 may exile 4 Vagan cards from trash to destroy an enemy Lv.4 or lower Unit", () => {
    const pilot = createMockPilot({ name: "Zeheart Galette", traits: ["x-rounder"] });
    const trashCards = Array.from({ length: 4 }, () => createMockUnit({ traits: ["vagan"] }));
    const enemy = createMockUnit({ level: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd03Zeydra054],
        trash: trashCards,
        resourceArea: activeResources(6),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const trashIds = p1.getCardsInZone("trash");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));
    expectSuccess(
      p1.resolveEffect({
        targets: [...trashIds, enemyId],
        optionalAnswers: { 0: true },
      }),
    );

    expect(engine.getCardsInZone({ zone: "removalArea" })).toHaveLength(4);
    expect(engine.getState().ctx.zones.private.cardIndex[enemyId]?.zoneKey).toBe(
      `trash:${PLAYER_TWO}`,
    );
  });

  it("skips the destroy when the optional exile is declined", () => {
    const pilot = createMockPilot({ name: "Zeheart Galette", traits: ["x-rounder"] });
    const trashCards = Array.from({ length: 4 }, () => createMockUnit({ traits: ["vagan"] }));
    const enemy = createMockUnit({ level: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd03Zeydra054],
        trash: trashCards,
        resourceArea: activeResources(6),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

    expect(engine.getCardsInZone({ zone: "removalArea" })).toHaveLength(0);
    expect(engine.getState().ctx.zones.private.cardIndex[enemyId]?.zoneKey).toBe(
      `battleArea:${PLAYER_TWO}`,
    );
  });

  it("does not destroy an enemy Unit above Lv.4", () => {
    const pilot = createMockPilot({ name: "Zeheart Galette", traits: ["x-rounder"] });
    const trashCards = Array.from({ length: 4 }, () => createMockUnit({ traits: ["vagan"] }));
    const enemy = createMockUnit({ level: 5, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd03Zeydra054],
        trash: trashCards,
        resourceArea: activeResources(6),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const trashIds = p1.getCardsInZone("trash");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));
    expectSuccess(
      p1.resolveEffect({
        targets: [...trashIds, enemyId],
        optionalAnswers: { 0: true },
      }),
    );

    expect(engine.getCardsInZone({ zone: "removalArea" })).toHaveLength(4);
    expect(engine.getState().ctx.zones.private.cardIndex[enemyId]?.zoneKey).toBe(
      `battleArea:${PLAYER_TWO}`,
    );
  });
});
