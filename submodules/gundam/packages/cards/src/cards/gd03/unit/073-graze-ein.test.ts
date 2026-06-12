import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  findStatModifier,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd03GrazeEin073 } from "./073-graze-ein.ts";

describe("Graze Ein (GD03-073)", () => {
  it("has Blocker", () => {
    const engine = GundamTestEngine.create({ play: [gd03GrazeEin073] });
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    expect(getEffectiveStats(unitId, engine.getG(), framework.cards, framework).keywords).toContain(
      "Blocker",
    );
  });

  it("【During Link】【Activate･Action】with 6+ Gjallarhorn cards in trash gives an enemy Unit battling this Unit AP-3 this battle", () => {
    const ein = createMockPilot({ name: "Ein Dalton" });
    const enemy = createMockUnit({ ap: 5, hp: 5 });
    const trash = Array.from({ length: 6 }, () => createMockUnit({ traits: ["gjallarhorn"] }));
    const engine = GundamTestEngine.create(
      {
        hand: [ein],
        play: [gd03GrazeEin073],
        trash,
        resourceArea: activeResources(7),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(ein, unitId));
    engine.getG().turnMetadata.pendingCombat = {
      stage: "action-step",
      attackerId: enemyId,
      attackerPlayerId: PLAYER_TWO,
      target: unitId,
    };
    engine.setPhase("end-phase");
    engine.setStep("action-step");

    expectSuccess(p1.activateAbility(unitId, 0, { targets: [enemyId] }));

    expect(findStatModifier(engine, enemyId, "ap")?.modifier).toBe(-3);
  });
});
