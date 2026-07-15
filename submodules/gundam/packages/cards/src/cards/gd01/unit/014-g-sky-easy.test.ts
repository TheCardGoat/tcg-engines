import { describe, expect, it } from "vite-plus/test";
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
import { gd01GSkyEasy014 } from "./014-g-sky-easy.ts";
import {
  passTurnThroughPublicMoves,
  resolveUnitBattle,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("G-Sky Easy (GD01-014)", () => {
  it("recovers 1 HP from a chosen friendly Unit during the end-phase Action Step while linked", () => {
    const pilot = createMockPilot({ traits: ["white base team"], level: 1, cost: 1 });
    const damaged = createMockUnit({ hp: 4 });
    const defender = createMockUnit({ ap: 2, hp: 10 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd01GSkyEasy014, damaged],
        resourceArea: activeResources(3),
        shieldArea: [createMockUnit()],
        deck: 5,
      },
      { play: [defender], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [gSkyId, damagedId] = p1.getCardsInZone("battleArea");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.assignPilot(pilot, gSkyId!));
    resolveUnitBattle(engine, PLAYER_ONE, damagedId!, defenderId);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.activateAbility(gSkyId!, 0));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([damagedId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [damagedId!] }));

    expect(p1.getDamage(damagedId!)).toBe(1);
  });

  it("can choose a damaged enemy Unit because the printed target is any Unit", () => {
    const pilot = createMockPilot({ traits: ["white base team"], level: 1, cost: 1 });
    const enemy = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd01GSkyEasy014],
        resourceArea: activeResources(3),
        shieldArea: [createMockUnit()],
        deck: 5,
      },
      { play: [enemy], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const gSkyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.assignPilot(pilot, gSkyId));
    resolveUnitBattle(engine, PLAYER_ONE, gSkyId, enemyId);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.activateAbility(gSkyId, 0));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([enemyId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(1);
  });

  it("rejects a second activation during the same turn", () => {
    const pilot = createMockPilot({ traits: ["white base team"], level: 1, cost: 1 });
    const damaged = createMockUnit({ hp: 4 });
    const defender = createMockUnit({ ap: 2, hp: 10 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd01GSkyEasy014, damaged],
        resourceArea: activeResources(3),
        shieldArea: [createMockUnit()],
        deck: 5,
      },
      { play: [defender], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [gSkyId, damagedId] = p1.getCardsInZone("battleArea");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.assignPilot(pilot, gSkyId!));
    resolveUnitBattle(engine, PLAYER_ONE, damagedId!, defenderId);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.activateAbility(gSkyId!, 0));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([damagedId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [damagedId!] }));
    expectSuccess(p2.passActionStep());

    expectFailure(
      p1.activateAbility(gSkyId!, 0, { targets: [damagedId!] }),
      "ABILITY_LIMIT_REACHED",
    );
  });

  it("rejects activation when its paired Pilot does not satisfy the Link Condition", () => {
    const pilot = createMockPilot({ traits: ["oz"], level: 1, cost: 1 });
    const damaged = createMockUnit({ hp: 4 });
    const defender = createMockUnit({ ap: 2, hp: 10 });
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd01GSkyEasy014, damaged],
        resourceArea: activeResources(3),
        shieldArea: [createMockUnit()],
        deck: 5,
      },
      { play: [defender], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [gSkyId, damagedId] = p1.getCardsInZone("battleArea");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.assignPilot(pilot, gSkyId!));
    resolveUnitBattle(engine, PLAYER_ONE, damagedId!, defenderId);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(p1.activateAbility(gSkyId!, 0, { targets: [damagedId!] }), "CONDITIONS_NOT_MET");
    expect(p1.getDamage(damagedId!)).toBe(2);
  });
});
