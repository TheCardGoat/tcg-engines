import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockBase,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01InterceptOrders099 } from "./099-intercept-orders.ts";
import { gd01RasidSOrders110 } from "./110-rasid-s-orders.ts";

describe("Rasid's Orders (GD01-110)", () => {
  it("【Main】 lets the chosen Lv.4-or-higher Unit attack an active enemy Unit with 6 AP", () => {
    const attacker = createMockUnit({ level: 4, ap: 4, hp: 6 });
    const enemy = createMockUnit({ ap: 6, hp: 8 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01RasidSOrders110],
        play: [attacker],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Rasid's Orders to ask which Lv.4-or-higher Unit gains the option");
    }
    expect(choice.legalTargetIds).toContain(attackerId);
    expectSuccess(p1.resolveEffect({ targets: [attackerId] }));
    expect(p1.getLegalAttackTargets(attackerId)).toContain(enemyId);
    expectSuccess(p1.enterBattle(attackerId, enemyId));

    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("rejects a chosen Unit below Lv.4 and a non-Unit card", () => {
    const lowFriendly = createMockUnit({ level: 3, ap: 4, hp: 6 });
    const base = createMockBase({ level: 4, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01RasidSOrders110],
        play: [lowFriendly],
        baseSection: [base],
        resourceArea: activeResources(3),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const lowFriendlyId = p1.getCardsInZone("battleArea")[0]!;
    const baseId = p1.getCardsInZone("baseSection")[0]!;

    expectFailure(
      p1.playCommand(gd01RasidSOrders110, { targets: [lowFriendlyId] }),
      "INVALID_TARGET",
    );
    expectFailure(p1.playCommand(gd01RasidSOrders110, { targets: [baseId] }), "INVALID_TARGET");
  });

  it("can grant the attack option to an opponent's Lv.4-or-higher Unit", () => {
    const attackTarget = createMockUnit({ level: 3, ap: 6, hp: 6 });
    const enemyRecipient = createMockUnit({ level: 4, ap: 4, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01RasidSOrders110],
        play: [attackTarget],
        resourceArea: activeResources(3),
      },
      { play: [enemyRecipient] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackTargetId = p1.getCardsInZone("battleArea")[0]!;
    const enemyRecipientId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd01RasidSOrders110));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Rasid's Orders to offer either player's eligible Unit");
    }
    expect(choice.legalTargetIds).toContain(enemyRecipientId);
    expectSuccess(p1.resolveEffect({ targets: [enemyRecipientId] }));

    expect(p2.getLegalAttackTargets(enemyRecipientId)).toContain(attackTargetId);
  });

  it("does not add a rested or 7-AP enemy Unit as an attack target", () => {
    const attacker = createMockUnit({ level: 5, ap: 4, hp: 6 });
    const restedEnemy = createMockUnit({ ap: 6, hp: 3 });
    const strongEnemy = createMockUnit({ ap: 7, hp: 8 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01InterceptOrders099, gd01RasidSOrders110],
        play: [attacker],
        resourceArea: activeResources(4),
      },
      {
        play: [restedEnemy, strongEnemy],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyIds = p2.getCardsInZone("battleArea");
    const [restedEnemyId] = enemyIds;
    const [interceptOrdersId, rasidOrdersId] = p1.getHand();

    expectSuccess(p1.playCommand(interceptOrdersId!));
    const restChoice = p1.getBoardView().pendingChoice;
    if (restChoice?.kind !== "targetSelection") {
      throw new Error("Expected Intercept Orders to ask which enemy Unit to rest");
    }
    expect(restChoice.legalTargetIds).toEqual([restedEnemyId]);
    expectSuccess(p1.resolveEffect({ targets: [restedEnemyId!] }));
    expectSuccess(p1.playCommand(rasidOrdersId!));
    const recipientChoice = p1.getBoardView().pendingChoice;
    if (recipientChoice?.kind !== "targetSelection") {
      throw new Error("Expected Rasid's Orders to ask which Unit gains the attack option");
    }
    expect(recipientChoice.legalTargetIds).toContain(attackerId);
    expectSuccess(p1.resolveEffect({ targets: [attackerId] }));

    expect(p1.getLegalAttackTargets(attackerId)).not.toEqual(expect.arrayContaining(enemyIds));
  });

  it("can grant the attack option during a legally reached Action step", () => {
    const attacker = createMockUnit({ level: 4, ap: 4, hp: 6 });
    const enemy = createMockUnit({ ap: 6, hp: 8 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01RasidSOrders110],
        play: [attacker],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(gd01RasidSOrders110));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Rasid's Orders to ask which Lv.4-or-higher Unit gains the option");
    }
    expect(choice.legalTargetIds).toContain(attackerId);
    expectSuccess(p1.resolveEffect({ targets: [attackerId] }));

    expect(p1.getLegalAttackTargets(attackerId)).toContain(enemyId);
  });

  it("plays as Rasid Kurama, applies AP+0/HP+1, and forms a Link through his printed name", () => {
    const host = createMockUnit({
      level: 0,
      cost: 0,
      ap: 2,
      hp: 3,
      linkCondition: "[Rasid Kurama]",
    });
    const engine = GundamTestEngine.create(
      {
        hand: [host, gd01RasidSOrders110],
        resourceArea: activeResources(3),
      },
      { shieldArea: [createMockUnit({ name: "Shield" })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [hostId, commandId] = p1.getHand();

    expectSuccess(p1.deployUnit(hostId!));
    expectSuccess(p1.playCommandAsPilot(commandId!, hostId!));

    expect(p1.getPilotId(hostId!)).toBe(commandId);
    expect(p1.getCardZone(commandId!)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(hostId!)?.effectiveAp).toBe(2);
    expect(p1.getVisibleCard(hostId!)?.effectiveHp).toBe(4);
    expectSuccess(p1.enterBattle(hostId!, "direct"));
  });

  it("cannot be played below its printed Lv.3 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01RasidSOrders110],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01RasidSOrders110), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01RasidSOrders110)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal setup leaves no active Resources", () => {
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
      hand: [setup, gd01RasidSOrders110],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [setupId, commandId] = p1.getHand();

    expectSuccess(p1.playCommand(setupId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.playCommand(commandId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
