import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01InterceptOrders099 } from "./099-intercept-orders.ts";

describe("Intercept Orders (GD01-099)", () => {
  describe("【Main】/【Action】Choose 1 to 2 enemy Units with 3 or less HP. Rest them.", () => {
    it("rests the one or two eligible enemy Units chosen during Main", () => {
      const firstEnemy = createMockUnit({ name: "First Enemy", hp: 3 });
      const secondEnemy = createMockUnit({ name: "Second Enemy", hp: 2 });
      const engine = GundamTestEngine.create(
        { hand: [gd01InterceptOrders099], resourceArea: activeResources(4) },
        { play: [firstEnemy, secondEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(commandId));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") {
        throw new Error("Expected Intercept Orders to ask which enemy Units to rest");
      }
      expect(choice.legalTargetIds).toEqual(expect.arrayContaining([firstEnemyId, secondEnemyId]));
      expect(choice.minTargets).toBe(1);
      expect(choice.maxTargets).toBe(2);
      expectSuccess(p1.resolveEffect({ targets: [firstEnemyId!, secondEnemyId!] }));

      expect(p2.isExhausted(firstEnemyId!)).toBe(true);
      expect(p2.isExhausted(secondEnemyId!)).toBe(true);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("can rest one eligible enemy Unit during a legally reached Action step", () => {
      const enemy = createMockUnit({ hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [gd01InterceptOrders099], resourceArea: activeResources(4) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(gd01InterceptOrders099));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") {
        throw new Error("Expected Intercept Orders to ask which enemy Unit to rest");
      }
      expect(choice.legalTargetIds).toEqual([enemyId]);
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p2.isExhausted(enemyId)).toBe(true);
    });

    it("rejects an enemy Unit with more than 3 HP", () => {
      const enemy = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [gd01InterceptOrders099], resourceArea: activeResources(4) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(gd01InterceptOrders099, { targets: [enemyId] }),
        "INVALID_TARGET",
      );
      expect(p1.getHand()).toHaveLength(1);
    });

    it("rejects a friendly Unit and more than two targets", () => {
      const friendly = createMockUnit({ hp: 3 });
      const enemies = Array.from({ length: 3 }, (_, index) =>
        createMockUnit({ name: `Enemy ${index + 1}`, hp: 3 }),
      );
      const engine = GundamTestEngine.create(
        {
          hand: [gd01InterceptOrders099],
          play: [friendly],
          resourceArea: activeResources(4),
        },
        { play: enemies },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;
      const enemyIds = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(gd01InterceptOrders099, { targets: [friendlyId] }),
        "INVALID_TARGET",
      );
      expectFailure(
        p1.playCommand(gd01InterceptOrders099, { targets: enemyIds }),
        "INVALID_TARGET",
      );
    });
  });

  it("【Burst】 asks for and rests an eligible enemy Unit", () => {
    const attacker = createMockUnit({ name: "Too Tough Attacker", ap: 1, hp: 6 });
    const eligible = createMockUnit({ name: "Eligible Unit", hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker, eligible] },
      { shieldArea: [gd01InterceptOrders099] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [attackerId, eligibleId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(attackerId!, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleId],
    });
    expectSuccess(p2.resolveEffect({ targets: [eligibleId!] }));

    expect(p1.isExhausted(eligibleId!)).toBe(true);
  });

  it("cannot be played below its printed Lv.4 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01InterceptOrders099],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01InterceptOrders099), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01InterceptOrders099)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal setup leaves only 1 active Resource", () => {
    const setup = createMockCommand({
      name: "Resource Setup",
      level: 0,
      cost: 3,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [],
          sourceText: "【Main】Do nothing.",
        },
      ],
    });
    const engine = GundamTestEngine.create({
      hand: [setup, gd01InterceptOrders099],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [setupId, commandId] = p1.getHand();

    expectSuccess(p1.playCommand(setupId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(1);
    expectFailure(p1.playCommand(commandId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
