import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd02Qubeley036 } from "./036-qubeley.ts";
import { gd02HamanKarn091 } from "../pilot/091-haman-karn.ts";
import { gd02JeridMessa086 } from "../pilot/086-jerid-messa.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Qubeley (GD02-036)", () => {
  describe("Printed Lv.7 and cost 5", () => {
    it("cannot deploy with only 6 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02Qubeley036],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 4 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 3 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02Qubeley036],
        resourceArea: activeResources(7),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(spender));
      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
      expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(4);
    });
  });

  it("gains Suppression for the turn when Haman Karn is paired", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [gd02HamanKarn091],
        play: [gd02Qubeley036],
        resourceArea: activeResources(7),
        deck: 5,
      },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const qubeleyId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd02HamanKarn091, qubeleyId));
    expect(p1.getVisibleCard(qubeleyId)?.keywords).toContain("Suppression");

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getVisibleCard(qubeleyId)?.keywords).not.toContain("Suppression");
  });

  it("destroys two Shields with Suppression after Haman Karn creates a Link Unit", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [gd02HamanKarn091],
        play: [gd02Qubeley036],
        resourceArea: activeResources(7),
      },
      { shieldArea: [createMockUnit(), createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const qubeleyId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd02HamanKarn091, qubeleyId));
    expectSuccess(p1.enterBattle(qubeleyId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getBoardView().players[PLAYER_TWO]!.shieldCount).toBe(0);
    expect(p2.getCardsInZone("trash")).toHaveLength(2);
  });

  it("does not gain Suppression when paired with a Pilot that does not meet its Link Condition", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02JeridMessa086],
      play: [gd02Qubeley036],
      resourceArea: activeResources(7),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const qubeleyId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd02JeridMessa086, qubeleyId));

    expect(p1.getVisibleCard(qubeleyId)?.keywords).not.toContain("Suppression");
  });

  it("offers only damaged enemy Units for its paired Attack effect and deals 2 damage", () => {
    const neoZeonPilot = createMockPilot({
      name: "Mashymre Cello",
      traits: ["neo zeon"],
      cost: 1,
    });
    const damageSetupUnit = createMockUnit({ ap: 1, hp: 6 });
    const damagedEnemy = createMockUnit({ ap: 0, hp: 8 });
    const undamagedEnemy = createMockUnit({ ap: 0, hp: 8 });
    const engine = GundamTestEngine.create(
      {
        hand: [neoZeonPilot],
        play: [gd02Qubeley036, damageSetupUnit],
        resourceArea: activeResources(7),
        baseSection: [],
        shieldArea: [createMockUnit(), createMockUnit()],
        deck: 5,
      },
      {
        play: [damagedEnemy, undamagedEnemy],
        deck: 5,
      },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [qubeleyId, setupId] = p1.getCardsInZone("battleArea");
    const [damagedEnemyId, undamagedEnemyId] = p2.getCardsInZone("battleArea");

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [damagedEnemyId!, undamagedEnemyId!]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.assignPilot(neoZeonPilot, qubeleyId!));
    expectSuccess(p1.enterBattle(setupId!, damagedEnemyId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getDamage(damagedEnemyId!)).toBe(1);

    expectSuccess(p1.enterBattle(qubeleyId!, undamagedEnemyId!));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [damagedEnemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [damagedEnemyId!] }));

    expect(p2.getDamage(damagedEnemyId!)).toBe(3);
    expect(p2.getDamage(undamagedEnemyId!)).toBe(0);
  });

  it("does not offer the Attack effect without a Neo Zeon Pilot", () => {
    const wrongPilot = createMockPilot({ traits: ["earth federation"], cost: 1 });
    const damageSetupUnit = createMockUnit({ ap: 1, hp: 6 });
    const damagedEnemy = createMockUnit({ ap: 0, hp: 8 });
    const engine = GundamTestEngine.create(
      {
        hand: [wrongPilot],
        play: [gd02Qubeley036, damageSetupUnit],
        resourceArea: activeResources(7),
        shieldArea: [createMockUnit()],
        deck: 5,
      },
      { play: [damagedEnemy], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [qubeleyId, setupId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.assignPilot(wrongPilot, qubeleyId!));
    expectSuccess(p1.enterBattle(setupId!, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getDamage(enemyId)).toBe(1);
    expectSuccess(p1.enterBattle(qubeleyId!, enemyId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getDamage(enemyId)).toBe(1);
  });
});
