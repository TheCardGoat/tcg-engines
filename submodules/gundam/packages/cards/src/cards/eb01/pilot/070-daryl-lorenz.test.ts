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
import { eb01DarylLorenz070 } from "./070-daryl-lorenz.ts";

describe("Daryl Lorenz (EB01-070)", () => {
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(eb01DarylLorenz070);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [eb01DarylLorenz070],
      play: [unit],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01DarylLorenz070, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("activates during an opponent's battle when linked, then grants AP+1 to the chosen Unit", () => {
    const host = createMockUnit({ ap: 2, hp: 5, linkCondition: "[Daryl Lorenz]" });
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [eb01DarylLorenz070],
        play: [{ card: host, exhausted: true }],
        resourceArea: activeResources(4),
        deck: 3,
      },
      { play: [attacker], deck: 3 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01DarylLorenz070, hostId));
    const pilotId = p1.getPilotId(hostId);
    if (!pilotId) throw new Error("Expected Daryl to be paired to the linked Unit");
    passTurnThroughPublicMoves(engine, PLAYER_ONE);

    expectSuccess(p2.enterBattle(attackerId, hostId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.activateAbility(pilotId, 0));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([hostId, attackerId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [hostId] }));

    expect(p1.getVisibleCard(hostId)?.effectiveAp).toBe(5);
  });

  it("rejects the Action when Daryl is paired without satisfying its Link Condition", () => {
    const host = createMockUnit({ ap: 2, hp: 5 });
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [eb01DarylLorenz070],
        play: [{ card: host, exhausted: true }],
        resourceArea: activeResources(4),
        deck: 3,
      },
      { play: [attacker], deck: 3 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01DarylLorenz070, hostId));
    const pilotId = p1.getPilotId(hostId);
    if (!pilotId) throw new Error("Expected Daryl to be paired");
    passTurnThroughPublicMoves(engine, PLAYER_ONE);

    expectSuccess(p2.enterBattle(attackerId, hostId));
    expectSuccess(p1.passBlock());
    expectFailure(p1.activateAbility(pilotId, 0), "CONDITIONS_NOT_MET");
  });
});
