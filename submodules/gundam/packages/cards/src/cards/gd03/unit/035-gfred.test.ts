import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03Nyaan092 } from "../pilot/092-nyaan.ts";
import { gd03Gfred035 } from "./035-gfred.ts";

describe("GFreD (GD03-035)", () => {
  it("【Activate･Main】 pays 1 and exiles 1 Pilot from trash to deal 1 damage to all enemy Units", () => {
    const trashPilot = createMockPilot();
    const enemyA = createMockUnit({ hp: 4 });
    const enemyB = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        play: [gd03Gfred035],
        trash: [trashPilot],
        resourceArea: activeResources(6),
      },
      { play: [enemyA, enemyB] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const trashPilotId = p1.getCardsInZone("trash")[0]!;
    const enemyIds = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    expectSuccess(p1.activateAbility(unitId, 0, { targets: [trashPilotId] }));

    expect(p1.getCardsInZone("trash")).not.toContain(trashPilotId);
    expect(p1.getCardZone(trashPilotId)).toBe("removalArea");
    const p2 = engine.asPlayer(PLAYER_TWO);
    expect(p2.getDamage(enemyIds[0]!)).toBe(1);
    expect(p2.getDamage(enemyIds[1]!)).toBe(1);
  });

  it("cannot activate the Main ability more than once in the same turn", () => {
    const firstPilot = createMockPilot({ name: "First Pilot" });
    const secondPilot = createMockPilot({ name: "Second Pilot" });
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        play: [gd03Gfred035],
        trash: [firstPilot, secondPilot],
        resourceArea: activeResources(6),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const [firstPilotId, secondPilotId] = p1.getCardsInZone("trash");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.activateAbility(unitId, 0, { targets: [firstPilotId!] }));
    expectFailure(
      p1.activateAbility(unitId, 0, { targets: [secondPilotId!] }),
      "ABILITY_LIMIT_REACHED",
    );

    expect(p1.getCardZone(secondPilotId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p2.getDamage(enemyId)).toBe(1);
  });

  it("【When Linked】 can choose an active enemy Unit with AP equal to or less than this Unit", () => {
    const lowApEnemy = createMockUnit({ ap: 4 });
    const highApEnemy = createMockUnit({ ap: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03Nyaan092],
        play: [gd03Gfred035],
        resourceArea: activeResources(6),
      },
      { play: [lowApEnemy, highApEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const [lowApEnemyId, highApEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(gd03Nyaan092, unitId));
    const ordering = p1.getBoardView().pendingChoice;
    if (ordering?.kind !== "ordering") throw new Error("Expected When Linked ordering");
    const gfredEffect = ordering.candidates.find((candidate) => candidate.sourceCardId === unitId);
    expectSuccess(p1.resolveEffect({ pendingEffectId: gfredEffect!.effectId }));

    expect(p1.getLegalAttackTargets(unitId)).toContain(lowApEnemyId);
    expect(p1.getLegalAttackTargets(unitId)).not.toContain(highApEnemyId);
  });

  it("removes its linked active-enemy attack option after the turn ends", () => {
    const activeEnemy = createMockUnit({ ap: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03Nyaan092],
        play: [gd03Gfred035],
        resourceArea: activeResources(6),
        deck: 5,
      },
      { play: [activeEnemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd03Nyaan092, unitId));
    const ordering = p1.getBoardView().pendingChoice;
    if (ordering?.kind !== "ordering") throw new Error("Expected When Linked ordering");
    const gfredEffect = ordering.candidates.find((candidate) => candidate.sourceCardId === unitId);
    expectSuccess(p1.resolveEffect({ pendingEffectId: gfredEffect!.effectId }));
    expect(p1.getLegalAttackTargets(unitId)).toContain(enemyId);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());

    expect(p1.getLegalAttackTargets(unitId)).not.toContain(enemyId);
  });
});
