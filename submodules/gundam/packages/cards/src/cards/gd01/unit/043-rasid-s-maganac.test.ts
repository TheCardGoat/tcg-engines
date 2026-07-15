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
import { gd01RasidSMaganac043 } from "./043-rasid-s-maganac.ts";

describe("Rasid's Maganac (GD01-043)", () => {
  it("lets the chosen green Unit attack an active enemy Unit with 4 or less AP", () => {
    const greenAlly = createMockUnit({ color: "green", hp: 5 });
    const legalEnemy = createMockUnit({ ap: 4, hp: 5 });
    const tooStrong = createMockUnit({ ap: 5, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01RasidSMaganac043],
        play: [greenAlly],
        resourceArea: activeResources(3),
      },
      { play: [legalEnemy, tooStrong] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const greenAllyId = p1.getCardsInZone("battleArea")[0]!;
    const [legalEnemyId, tooStrongId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd01RasidSMaganac043));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([greenAllyId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [greenAllyId] }));

    expect(p1.getLegalAttackTargets(greenAllyId)).toContain(legalEnemyId);
    expect(p1.getLegalAttackTargets(greenAllyId)).not.toContain(tooStrongId);
    expectSuccess(p1.enterBattle(greenAllyId, legalEnemyId!));
  });

  it("does not offer a friendly Unit outside the green color", () => {
    const blueAlly = createMockUnit({ color: "blue" });
    const engine = GundamTestEngine.create({
      hand: [gd01RasidSMaganac043],
      play: [blueAlly],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const blueAllyId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd01RasidSMaganac043));
    const rasidId = p1.getCardsInZone("battleArea")[1]!;
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [rasidId],
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [rasidId] }));

    expect(p1.getVisibleCard(blueAllyId)).not.toBeUndefined();
  });

  it("removes the extra active-Unit attack option after the turn ends", () => {
    const greenAlly = createMockUnit({ color: "green", hp: 5 });
    const enemy = createMockUnit({ ap: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01RasidSMaganac043],
        play: [greenAlly],
        resourceArea: activeResources(3),
        deck: 5,
      },
      { play: [enemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const greenAllyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd01RasidSMaganac043));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([greenAllyId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [greenAllyId] }));
    expect(p1.getLegalAttackTargets(greenAllyId)).toContain(enemyId);
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());

    expect(p1.getLegalAttackTargets(greenAllyId)).not.toContain(enemyId);
  });

  it("can attack on its deploy turn after pairing a Maganac Corps Pilot", () => {
    const pilot = createMockPilot({ traits: ["maganac corps"], level: 1, cost: 1 });
    const greenAlly = createMockUnit({ color: "green" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01RasidSMaganac043, pilot],
        play: [greenAlly],
        resourceArea: activeResources(3),
      },
      { shieldArea: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const greenAllyId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd01RasidSMaganac043));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([greenAllyId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [greenAllyId] }));
    expectSuccess(p1.assignPilot(pilot, gd01RasidSMaganac043));
    expectSuccess(p1.enterBattle(gd01RasidSMaganac043, "direct"));
  });
});
