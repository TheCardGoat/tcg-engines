import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { eb01PsychoHaroEx042 } from "./042-psycho-haro-ex.ts";

describe("Psycho Haro (EX) (EB01-042)", () => {
  /** @behavioral-proof complete: rested-state global Blocker and the attack-time Lv.7 ceiling are exercised through public combat. */
  it("grants Blocker to every friendly and enemy Unit only while rested", () => {
    const friendly = createMockUnit({ name: "Friendly Unit" });
    const enemy = createMockUnit({ name: "Enemy Unit" });
    const restedEngine = GundamTestEngine.create(
      { play: [{ card: eb01PsychoHaroEx042, exhausted: true }, friendly] },
      { play: [enemy] },
    );
    const restedP1 = restedEngine.asPlayer(PLAYER_ONE);
    const restedP2 = restedEngine.asPlayer(PLAYER_TWO);
    const [psychoId, friendlyId] = restedP1.getCardsInZone("battleArea");
    const enemyId = restedP2.getCardsInZone("battleArea")[0]!;

    expect(restedP1.getVisibleCard(psychoId!)?.keywords).toContain("Blocker");
    expect(restedP1.getVisibleCard(friendlyId!)?.keywords).toContain("Blocker");
    expect(restedP2.getVisibleCard(enemyId)?.keywords).toContain("Blocker");

    const activeEngine = GundamTestEngine.create(
      { play: [eb01PsychoHaroEx042, friendly] },
      { play: [enemy] },
    );
    const activeP1 = activeEngine.asPlayer(PLAYER_ONE);
    const activeP2 = activeEngine.asPlayer(PLAYER_TWO);
    const activeFriendlyId = activeP1.getCardsInZone("battleArea")[1]!;
    const activeEnemyId = activeP2.getCardsInZone("battleArea")[0]!;

    expect(activeP1.getVisibleCard(activeFriendlyId)?.keywords).not.toContain("Blocker");
    expect(activeP2.getVisibleCard(activeEnemyId)?.keywords).not.toContain("Blocker");
  });

  it("prevents a Lv.7 Unit from using the granted Blocker during its attack", () => {
    const lowLevel = createMockUnit({ name: "Lv.7 Unit", level: 7 });
    const highLevel = createMockUnit({ name: "Lv.8 Unit", level: 8 });
    const engine = GundamTestEngine.create(
      { play: [eb01PsychoHaroEx042] },
      { play: [lowLevel, highLevel] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const psychoId = p1.getCardsInZone("battleArea")[0]!;
    const [lowLevelId, highLevelId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(psychoId, "direct"));
    expect(p2.getVisibleCard(lowLevelId!)?.keywords).toContain("Blocker");
    expect(p2.getVisibleCard(highLevelId!)?.keywords).toContain("Blocker");
    expectFailure(p2.declareBlock(lowLevelId!), "CANNOT_BLOCK");
    expectSuccess(p2.declareBlock(highLevelId!));
  });
});
