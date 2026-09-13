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
import { expectPilotBurstAddsToHand } from "../../../test-helpers/pilot-behavior-test-helpers.ts";
import { gd05GyuneiGuss095 } from "./095-gyunei-guss.ts";

describe("Gyunei Guss (GD05-095)", () => {
  /** @behavioral-proof complete: Burst retrieval, Neo Zeon host condition, Blocker target replacement/rest cost, and non-Neo Zeon false branch are public. */
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(gd05GyuneiGuss095);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd05GyuneiGuss095],
      play: [unit],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05GyuneiGuss095, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("gives a Neo Zeon host Blocker and redirects a battle", () => {
    const attacker = createMockUnit({ ap: 1, hp: 6 });
    const originalTarget = createMockUnit({ hp: 5 });
    const host = createMockUnit({ traits: ["neo zeon"] });
    const engine = GundamTestEngine.create(
      { play: [attacker], deck: 5 },
      {
        hand: [gd05GyuneiGuss095],
        play: [{ card: originalTarget, exhausted: true }, host],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [targetId, hostId] = p2.getCardsInZone("battleArea");

    expectSuccess(p2.assignPilot(gd05GyuneiGuss095, hostId!));
    expect(p2.getVisibleCard(hostId!)?.keywords).toContain("Blocker");
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.enterBattle(attackerId, targetId!));
    expectSuccess(p2.declareBlock(hostId!));

    expect(p2.isExhausted(hostId!)).toBe(true);
    expect(p1.getBoardView().pendingCombat).toMatchObject({ blockerId: hostId });
  });

  it("does not grant Blocker to a non-Neo Zeon host", () => {
    const attacker = createMockUnit({ ap: 1, hp: 6 });
    const originalTarget = createMockUnit({ hp: 5 });
    const host = createMockUnit({ traits: ["earth federation"] });
    const engine = GundamTestEngine.create(
      { play: [attacker], deck: 5 },
      {
        hand: [gd05GyuneiGuss095],
        play: [{ card: originalTarget, exhausted: true }, host],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [targetId, hostId] = p2.getCardsInZone("battleArea");

    expectSuccess(p2.assignPilot(gd05GyuneiGuss095, hostId!));
    expect(p2.getVisibleCard(hostId!)?.keywords).not.toContain("Blocker");
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.enterBattle(attackerId, targetId!));
    expectFailure(p2.declareBlock(hostId!), "MISSING_BLOCKER_KEYWORD");
  });
});
