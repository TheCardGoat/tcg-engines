import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01FreedomGundam065 } from "./065-freedom-gundam.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Freedom Gundam (GD01-065)", () => {
  it("uses Blocker to visibly intercept an attack", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        deck: 2,
        play: [attacker],
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [defender, gd01FreedomGundam065] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [defenderId, freedomId] = p2.getCardsInZone("battleArea");

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId!]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);

    expectSuccess(p1.enterBattle(attackerId, defenderId!));
    expectSuccess(p2.declareBlock(freedomId!));

    expect(p1.getBoardView().pendingCombat?.blockerId).toBe(freedomId);
    expect(p2.isExhausted(freedomId!)).toBe(true);
  });

  it("offers an enemy Unit when a Pilot is paired with Freedom", () => {
    const kira = createMockPilot({ name: "Kira Yamato", level: 1, cost: 1 });
    const enemy = createMockUnit({ ap: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [kira],
        play: [gd01FreedomGundam065],
        resourceArea: activeResources(1),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const freedomId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(kira, freedomId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);
  });

  it("observes a Pilot paired with another friendly white Unit while Freedom is paired", () => {
    const kira = createMockPilot({ name: "Kira Yamato", level: 1, cost: 1 });
    const secondPilot = createMockPilot({ name: "Second Pilot", level: 1, cost: 1 });
    const whiteUnit = createMockUnit({ color: "white", hp: 5 });
    const enemy = createMockUnit({ ap: 4, hp: 5, level: 1, cost: 1 });
    const engine = GundamTestEngine.create(
      {
        hand: [kira, secondPilot],
        play: [gd01FreedomGundam065, whiteUnit],
        resourceArea: activeResources(2),
        deck: 5,
      },
      { hand: [enemy], resourceArea: activeResources(1), deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [freedomId, whiteUnitId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(kira, freedomId!));
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.deployUnit(enemy));
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.assignPilot(secondPilot, whiteUnitId!));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);
  });

  it("does not observe a Pilot paired with another white Unit while Freedom is unpaired", () => {
    const pilot = createMockPilot({ name: "Second Pilot", level: 1, cost: 1 });
    const whiteUnit = createMockUnit({ color: "white", hp: 5 });
    const enemy = createMockUnit({ ap: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd01FreedomGundam065, whiteUnit],
        resourceArea: activeResources(1),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const whiteUnitId = p1.getCardsInZone("battleArea")[1]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, whiteUnitId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(4);
  });

  it("applies its pairing effect only once when a second white Unit is paired in the same turn", () => {
    const kira = createMockPilot({ name: "Kira Yamato", level: 1, cost: 1 });
    const secondPilot = createMockPilot({ name: "Second Pilot", level: 1, cost: 1 });
    const whiteUnit = createMockUnit({ color: "white", hp: 5 });
    const enemy = createMockUnit({ ap: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [kira, secondPilot],
        play: [gd01FreedomGundam065, whiteUnit],
        resourceArea: activeResources(2),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [freedomId, whiteUnitId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(kira, freedomId!));
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);

    expectSuccess(p1.assignPilot(secondPilot, whiteUnitId!));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);
  });
});
