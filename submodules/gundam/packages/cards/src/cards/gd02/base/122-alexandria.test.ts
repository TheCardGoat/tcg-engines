import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02Alexandria122 } from "./122-alexandria.ts";

function reachAlexandriaDeploy(enemyLevel: number) {
  const enemy = createMockUnit({ level: enemyLevel, ap: 1, hp: 5 });
  const engine = GundamTestEngine.create(
    {
      hand: [gd02Alexandria122],
      shieldArea: [
        createMockUnit({ name: "First Shield" }),
        createMockUnit({ name: "Second Shield" }),
      ],
      resourceArea: activeResources(3),
      deck: 3,
    },
    { play: [enemy], deck: 3 },
    { initialActivePlayer: PLAYER_TWO },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const enemyId = p2.getCardsInZone("battleArea")[0]!;

  expectSuccess(p2.enterBattle(enemyId, "direct"));
  expectSuccess(p1.passBlock());
  expectSuccess(p1.passBattleAction());
  expectSuccess(p2.passBattleAction());
  passTurnThroughPublicMoves(engine, PLAYER_TWO);
  const handCountBeforeDeploy = p1.getBoardView().players[PLAYER_ONE]?.handCount;
  expectSuccess(p1.deployBase(gd02Alexandria122));

  return { p1, p2, enemyId, handCountBeforeDeploy };
}

describe("Alexandria (GD02-122)", () => {
  it("【Burst】 deploys the revealed Shield into its owner's Base section", () => {
    const attacker = createMockUnit({ level: 5, ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd02Alexandria122] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burstPrompt = p2.getBoardView().pendingChoice;
    if (burstPrompt?.kind !== "optional") {
      throw new Error("Expected a visible Alexandria Burst choice");
    }
    expect(burstPrompt).toMatchObject({
      controllerId: PLAYER_TWO,
      prompt: "【Burst】Deploy this card.",
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstPrompt.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02Alexandria122)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 adds a Shield and damages the chosen rested enemy at Lv.4 or lower", () => {
    const { p1, p2, enemyId, handCountBeforeDeploy } = reachAlexandriaDeploy(4);

    expect(p1.getCardZone(gd02Alexandria122)).toBe(`baseSection:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(0);
    expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(handCountBeforeDeploy);
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible rested enemy Unit choice");
    }
    expect(choice.legalTargetIds).toEqual([enemyId]);
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(0);
    expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBeGreaterThan(0);
    expect(p2.getDamage(enemyId)).toBe(1);
    expect(p1.getCardZone(gd02Alexandria122)).toBe(`baseSection:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
  });

  it("does not damage a rested enemy above Lv.4", () => {
    const { p1, p2, enemyId } = reachAlexandriaDeploy(5);

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getDamage(enemyId)).toBe(0);
  });

  it("cannot be deployed below its printed Lv.3", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02Alexandria122],
      resourceArea: activeResources(2),
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployBase(gd02Alexandria122),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(engine.asPlayer(PLAYER_ONE).getCardZone(gd02Alexandria122)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal deployment exhausts all Resources", () => {
    const resourceSpender = createMockUnit({
      name: "Resource Spender",
      level: 0,
      cost: 3,
    });
    const engine = GundamTestEngine.create({
      hand: [resourceSpender, gd02Alexandria122],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [resourceSpenderId, alexandriaId] = p1.getHand();

    expectSuccess(p1.deployUnit(resourceSpenderId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployBase(alexandriaId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(alexandriaId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
