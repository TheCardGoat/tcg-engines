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
import { gd01ZeonRemnantForces115 } from "./115-zeon-remnant-forces.ts";
import { gd01TheWitchAndTheBride117 } from "./117-the-witch-and-the-bride.ts";

describe("The Witch and the Bride (GD01-117)", () => {
  it("【Burst】 activates Main and asks which eligible enemy Unit to return", () => {
    const attacker = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd01TheWitchAndTheBride117] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [attackerId],
    });
    expectSuccess(p1.resolveEffect({ targets: [attackerId] }));

    expect(p2.getCardZone(attackerId)).toBe(`hand:${PLAYER_TWO}`);
    expect(p2.isExhausted(attackerId)).toBe(false);
  });

  it("【Main】 returns an enemy Unit with 5 HP and moves the Command to trash", () => {
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [gd01TheWitchAndTheBride117], resourceArea: activeResources(5) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected The Witch and the Bride to ask which enemy Unit returns to hand");
    }
    expect(choice.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getCardZone(enemyId)).toBe(`hand:${PLAYER_TWO}`);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("can return an eligible enemy Unit during a legally reached Action step", () => {
    const enemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd01TheWitchAndTheBride117], resourceArea: activeResources(5) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(gd01TheWitchAndTheBride117));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected The Witch and the Bride to ask which enemy Unit returns to hand");
    }
    expect(choice.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getCardZone(enemyId)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("rejects an enemy Unit above 5 HP and a qualifying friendly Unit", () => {
    const friendly = createMockUnit({ hp: 5 });
    const enemy = createMockUnit({ hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01TheWitchAndTheBride117],
        play: [friendly],
        resourceArea: activeResources(5),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.playCommand(gd01TheWitchAndTheBride117, { targets: [enemyId] }),
      "INVALID_TARGET",
    );
    expectFailure(
      p1.playCommand(gd01TheWitchAndTheBride117, { targets: [friendlyId] }),
      "INVALID_TARGET",
    );
  });

  it("clears legally applied damage and rested state when the Unit enters its owner's hand", () => {
    const enemy = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01ZeonRemnantForces115, gd01InterceptOrders099, gd01TheWitchAndTheBride117],
        resourceArea: activeResources(9),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const [damageCommandId, restCommandId, bounceCommandId] = p1.getHand();

    expectSuccess(p1.playCommand(damageCommandId!));
    const damageChoice = p1.getBoardView().pendingChoice;
    if (damageChoice?.kind !== "targetSelection") {
      throw new Error("Expected Zeon Remnant Forces to ask which enemy Unit receives damage");
    }
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    expectSuccess(p1.playCommand(restCommandId!));
    const restChoice = p1.getBoardView().pendingChoice;
    if (restChoice?.kind !== "targetSelection") {
      throw new Error("Expected Intercept Orders to ask which enemy Unit to rest");
    }
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    expect(p2.getDamage(enemyId)).toBe(1);
    expect(p2.isExhausted(enemyId)).toBe(true);
    expectSuccess(p1.playCommand(bounceCommandId!));
    const bounceChoice = p1.getBoardView().pendingChoice;
    if (bounceChoice?.kind !== "targetSelection") {
      throw new Error("Expected The Witch and the Bride to ask which enemy Unit returns to hand");
    }
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getCardZone(enemyId)).toBe(`hand:${PLAYER_TWO}`);
    expect(p2.getDamage(enemyId)).toBe(0);
    expect(p2.isExhausted(enemyId)).toBe(false);
  });

  it("cannot be played below its printed Lv.5 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01TheWitchAndTheBride117],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01TheWitchAndTheBride117), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01TheWitchAndTheBride117)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal setup leaves only 1 active Resource", () => {
    const setup = createMockCommand({
      name: "Resource Setup",
      level: 0,
      cost: 4,
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
      hand: [setup, gd01TheWitchAndTheBride117],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [setupId, commandId] = p1.getHand();

    expectSuccess(p1.playCommand(setupId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(1);
    expectFailure(p1.playCommand(commandId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
