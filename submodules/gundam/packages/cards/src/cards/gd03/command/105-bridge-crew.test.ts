import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03BridgeCrew105 } from "./105-bridge-crew.ts";

describe("Bridge Crew (GD03-105)", () => {
  it("【Burst】 adds this revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03BridgeCrew105] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03BridgeCrew105)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("lets the chosen Unit attack an active unpaired enemy, but not an active paired enemy", () => {
    const attacker = createMockUnit({ name: "Chosen Attacker", ap: 3, hp: 5 });
    const activeUnpaired = createMockUnit({ name: "Active Unpaired", hp: 5 });
    const pairedHost = createMockUnit({ name: "Active Paired", hp: 5 });
    const enemyPilot = createMockPilot({ name: "Enemy Pilot", cost: 1 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03BridgeCrew105],
        play: [attacker],
        resourceArea: activeResources(4),
        deck: 5,
      },
      {
        hand: [enemyPilot],
        play: [activeUnpaired, pairedHost],
        resourceArea: activeResources(2),
        deck: 5,
      },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [activeUnpairedId, pairedHostId] = p2.getCardsInZone("battleArea");

    expectSuccess(p2.assignPilot(enemyPilot, pairedHostId!));
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());
    const commandId = p1.getHand()[0]!;
    expectSuccess(p1.playCommand(commandId, { targets: [attackerId] }));

    expect(p1.getLegalAttackTargets(attackerId)).toContain(activeUnpairedId);
    expect(p1.getLegalAttackTargets(attackerId)).not.toContain(pairedHostId);
    expectSuccess(p1.enterBattle(attackerId, activeUnpairedId!));
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("removes the active-Unit attack option after the turn ends", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const activeEnemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03BridgeCrew105],
        play: [attacker],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [activeEnemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd03BridgeCrew105, { targets: [attackerId] }));
    expect(p1.getLegalAttackTargets(attackerId)).toContain(enemyId);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());

    expect(p1.getLegalAttackTargets(attackerId)).not.toContain(enemyId);
  });

  it("cannot grant the attack option to a Base", () => {
    const base = createMockBase({ hp: 5 });
    const engine = GundamTestEngine.create({
      hand: [gd03BridgeCrew105],
      baseSection: [base],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;
    const baseId = p1.getCardsInZone("baseSection")[0]!;

    expectFailure(p1.playCommand(commandId, { targets: [baseId] }), "INVALID_TARGET");

    expect(p1.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
    expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
  });
});
