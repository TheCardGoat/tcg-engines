import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd05Murasame016 } from "./016-murasame.ts";

describe("Murasame (GD05-016)", () => {
  /** @behavioral-proof complete: self/other Orb deploys, controller/trait gates, duration, and actual blocking restriction are public. */
  it("gains High-Maneuver when another friendly Orb Unit is deployed and cannot be blocked", () => {
    const orb = createMockUnit({ name: "Orb Reinforcement", traits: ["orb"] });
    const blocker = createMockUnit({ name: "Blocker", hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [orb],
        play: [gd05Murasame016],
        resourceArea: activeResources(1),
      },
      { play: [blocker] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const murasameId = p1.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(orb));
    expect(p1.getVisibleCard(murasameId)?.keywords).toContain("HighManeuver");
    expectSuccess(p1.enterBattle(murasameId, "direct"));
    expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK_HIGH_MANEUVER");
  });

  it("gains High-Maneuver from its own deployment", () => {
    const engine = GundamTestEngine.create({
      hand: [gd05Murasame016],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd05Murasame016));
    const murasameId = p1.getCardsInZone("battleArea")[0]!;

    expect(p1.getVisibleCard(murasameId)?.keywords).toContain("HighManeuver");
  });

  it("does not gain High-Maneuver when a friendly non-Orb Unit is deployed", () => {
    const nonOrb = createMockUnit({ name: "Non-Orb", traits: ["earth federation"] });
    const engine = GundamTestEngine.create({
      hand: [nonOrb],
      play: [gd05Murasame016],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const murasameId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(nonOrb));

    expect(p1.getVisibleCard(murasameId)?.keywords).not.toContain("HighManeuver");
  });

  it("does not gain High-Maneuver when an enemy Orb Unit is deployed", () => {
    const enemyOrb = createMockUnit({ name: "Enemy Orb", traits: ["orb"] });
    const engine = GundamTestEngine.create(
      { play: [gd05Murasame016] },
      {
        hand: [enemyOrb],
        resourceArea: activeResources(1),
      },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const murasameId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.deployUnit(enemyOrb));

    expect(p1.getVisibleCard(murasameId)?.keywords).not.toContain("HighManeuver");
  });

  it("loses the granted High-Maneuver when the turn ends", () => {
    const orb = createMockUnit({ name: "Orb Reinforcement", traits: ["orb"] });
    const engine = GundamTestEngine.create({
      hand: [orb],
      play: [gd05Murasame016],
      resourceArea: activeResources(1),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const murasameId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(orb));
    expect(p1.getVisibleCard(murasameId)?.keywords).toContain("HighManeuver");
    passTurnThroughPublicMoves(engine, PLAYER_ONE);

    expect(p1.getVisibleCard(murasameId)?.keywords).not.toContain("HighManeuver");
  });
});
