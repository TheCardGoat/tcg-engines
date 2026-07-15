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
import { gd01Shamblo047 } from "./047-shamblo.ts";

describe("Shamblo (GD01-047)", () => {
  it("links with a Newtype Pilot and offers 3 damage after attacking with two other rested Units", () => {
    const newtypePilot = createMockPilot({ traits: ["newtype"], level: 1, cost: 1 });
    const firstAlly = createMockUnit({ hp: 4 });
    const secondAlly = createMockUnit({ hp: 4 });
    const enemy = createMockUnit({ hp: 10 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01Shamblo047, newtypePilot],
        deck: 2,
        play: [firstAlly, secondAlly],
        resourceArea: activeResources(8),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      {
        play: [enemy],
        shieldArea: [
          createMockUnit({ name: "First Allied Attack Shield" }),
          createMockUnit({ name: "Second Allied Attack Shield" }),
        ],
      },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const [firstAllyId, secondAllyId] = p1.getCardsInZone("battleArea");

    expectSuccess(p2.enterBattle(enemyId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());

    expectSuccess(p1.enterBattle(firstAllyId!, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p1.enterBattle(secondAllyId!, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expectSuccess(p1.deployUnit(gd01Shamblo047));
    const shambloId = p1.getCardsInZone("battleArea").at(-1)!;
    expectSuccess(p1.assignPilot(newtypePilot, shambloId));
    expectSuccess(p1.enterBattle(shambloId, enemyId));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(3);
  });

  it("also links with a Cyber-Newtype Pilot and can attack on the deployment turn", () => {
    const cyberNewtype = createMockPilot({ traits: ["cyber-newtype"], level: 1, cost: 1 });
    const enemy = createMockUnit({ hp: 10 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01Shamblo047, cyberNewtype],
        deck: 2,
        resourceArea: activeResources(8),
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      { play: [enemy] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(enemyId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());

    expectSuccess(p1.deployUnit(gd01Shamblo047));
    const shambloId = p1.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(cyberNewtype, shambloId));

    expectSuccess(p1.enterBattle(shambloId, enemyId));
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("does not offer the damage effect with fewer than two other rested Units", () => {
    const onlyAlly = createMockUnit({ hp: 4 });
    const enemy = createMockUnit({ hp: 10 });
    const engine = GundamTestEngine.create(
      {
        deck: 2,
        play: [gd01Shamblo047, onlyAlly],
        shieldArea: [createMockUnit({ name: "Opening Shield" })],
      },
      {
        play: [enemy],
        shieldArea: [createMockUnit({ name: "Allied Attack Shield" })],
      },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const shambloId = p1.getCardsInZone("battleArea")[0]!;
    const onlyAllyId = p1.getCardsInZone("battleArea")[1]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(enemyId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.enterBattle(onlyAllyId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expectSuccess(p1.enterBattle(shambloId, enemyId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getDamage(enemyId)).toBe(0);
  });
});
