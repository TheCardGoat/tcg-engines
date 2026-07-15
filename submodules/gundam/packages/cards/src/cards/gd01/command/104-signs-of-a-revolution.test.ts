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
import { gd01SignsOfARevolution104 } from "./104-signs-of-a-revolution.ts";

describe("Signs of a Revolution (GD01-104)", () => {
  it("【Burst】 draws 1 after the player accepts the revealed Shield's effect", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd01SignsOfARevolution104], deck: 5 },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p2.getCardsInZone("battleArea")[0]!;
    const handBefore = p1.getHand().length;
    const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p1.getHand()).toHaveLength(handBefore + 1);
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore - 1);
  });

  it("【Main】 deals 2 damage to a rested enemy Unit", () => {
    const enemy = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01InterceptOrders099, gd01SignsOfARevolution104],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const [interceptOrdersId, commandId] = p1.getHand();

    expectSuccess(p1.playCommand(interceptOrdersId!));
    const restChoice = p1.getBoardView().pendingChoice;
    if (restChoice?.kind !== "targetSelection") {
      throw new Error("Expected Intercept Orders to ask which enemy Unit to rest");
    }
    expect(restChoice.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    expectSuccess(p1.playCommand(commandId!));
    const damageChoice = p1.getBoardView().pendingChoice;
    if (damageChoice?.kind !== "targetSelection") {
      throw new Error("Expected Signs of a Revolution to ask for a rested enemy Unit");
    }
    expect(damageChoice.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(2);
    expect(p1.getCardZone(commandId!)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("rejects an active enemy Unit and a rested friendly Unit", () => {
    const friendly = createMockUnit({ keywordEffects: [{ keyword: "Support", value: 1 }] });
    const supportTarget = createMockUnit();
    const enemy = createMockUnit();
    const engine = GundamTestEngine.create(
      {
        hand: [gd01SignsOfARevolution104],
        play: [friendly, supportTarget],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [friendlyId, supportTargetId] = p1.getCardsInZone("battleArea");
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.useSupport(friendlyId!, supportTargetId!));
    expectFailure(
      p1.playCommand(gd01SignsOfARevolution104, { targets: [enemyId] }),
      "INVALID_TARGET",
    );
    expectFailure(
      p1.playCommand(gd01SignsOfARevolution104, { targets: [friendlyId] }),
      "INVALID_TARGET",
    );
  });

  it("cannot use its Main effect in a legally reached Action step", () => {
    const enemy = createMockUnit();
    const engine = GundamTestEngine.create(
      { hand: [gd01SignsOfARevolution104], resourceArea: activeResources(3) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());

    expectFailure(
      p1.playCommand(gd01SignsOfARevolution104, { targets: [enemyId] }),
      "WRONG_TIMING",
    );
  });

  it("cannot be played below its printed Lv.3 requirement", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01SignsOfARevolution104],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.playCommand(gd01SignsOfARevolution104), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd01SignsOfARevolution104)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal setup leaves only 1 active Resource", () => {
    const setup = createMockCommand({
      name: "Resource Setup",
      level: 0,
      cost: 2,
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
      hand: [setup, gd01SignsOfARevolution104],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [setupId, commandId] = p1.getHand();

    expectSuccess(p1.playCommand(setupId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(1);
    expectFailure(p1.playCommand(commandId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
