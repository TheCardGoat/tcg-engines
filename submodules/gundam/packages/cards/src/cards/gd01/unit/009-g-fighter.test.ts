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
import { gd01GFighter009 } from "./009-g-fighter.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("G-Fighter (GD01-009)", () => {
  it("can attack on its deploy turn after pairing a White Base Team Pilot", () => {
    const pilot = createMockPilot({ traits: ["white base team"], level: 1, cost: 1 });
    const ally = createMockUnit({ traits: ["white base team"] });
    const enemy = createMockUnit({ ap: 0, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01GFighter009, pilot],
        play: [ally],
        resourceArea: activeResources(3),
        shieldArea: [createMockUnit()],
        deck: 5,
      },
      { play: [enemy], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const allyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.deployUnit(gd01GFighter009));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([allyId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [allyId] }));
    expectSuccess(p1.assignPilot(pilot, gd01GFighter009));
    expectSuccess(p1.enterBattle(gd01GFighter009, enemyId));
  });

  it("prevents an enemy Blocker from blocking the chosen White Base Team Unit this turn", () => {
    const ally = createMockUnit({ traits: ["white base team"], hp: 5 });
    const blocker = createMockUnit({ keywordEffects: [{ keyword: "Blocker" }], hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01GFighter009],
        play: [ally],
        resourceArea: activeResources(3),
      },
      { play: [blocker], shieldArea: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const allyId = p1.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd01GFighter009));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([allyId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [allyId] }));
    expectSuccess(p1.enterBattle(allyId, "direct"));

    expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK_HIGH_MANEUVER");
    expect(p2.isExhausted(blockerId)).toBe(false);
  });

  it("does not offer a friendly Unit outside the White Base Team trait", () => {
    const ally = createMockUnit({ traits: ["earth federation"] });
    const engine = GundamTestEngine.create({
      hand: [gd01GFighter009],
      play: [ally],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const allyId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd01GFighter009));
    const gFighterId = p1.getCardsInZone("battleArea")[1]!;
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [gFighterId],
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [gFighterId] }));

    expect(p1.getVisibleCard(allyId)?.keywords).not.toContain("HighManeuver");
  });

  it("removes the granted High-Maneuver at the end of the turn", () => {
    const ally = createMockUnit({ traits: ["white base team"] });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01GFighter009],
        play: [ally],
        resourceArea: activeResources(3),
        deck: 5,
      },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const allyId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd01GFighter009));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([allyId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [allyId] }));
    expect(p1.getVisibleCard(allyId)?.keywords).toContain("HighManeuver");
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getVisibleCard(allyId)?.keywords).not.toContain("HighManeuver");
  });
});
