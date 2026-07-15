import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04ReineforceJr121 } from "./121-reineforce-jr.ts";

describe("Reineforce Jr. (GD04-121)", () => {
  it("【Deploy】 adds 1 shield to hand", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04ReineforceJr121],
      resourceArea: activeResources(3),
      shieldArea: [createMockUnit({ name: "Shield" })],
      deck: 4,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const shieldId = p1.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.deployBase(gd04ReineforceJr121));

    expect(p1.getHand()).toContain(shieldId);
    expect(p1.getCardsInZone("baseSection")).toHaveLength(1);
  });

  it("【Burst】 offers its owner the choice to deploy this card after a direct attack", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd04ReineforceJr121] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const shieldId = p2.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      controllerId: PLAYER_TWO,
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(shieldId)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Burst】 leaves this card in trash when its owner declines", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd04ReineforceJr121] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const shieldId = p2.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      controllerId: PLAYER_TWO,
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: false } }));

    expect(p2.getCardZone(shieldId)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("deploys a Parts token when a friendly League Militaire Unit is in play on your turn", () => {
    const leagueUnit = createMockUnit({ traits: ["league militaire"] });
    const engine = GundamTestEngine.create({
      hand: [gd04ReineforceJr121],
      play: [leagueUnit],
      resourceArea: activeResources(3),
      shieldArea: [createMockUnit({ name: "Shield" })],
      deck: 4,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const battleAreaBefore = p1.getCardsInZone("battleArea");

    expectSuccess(p1.deployBase(gd04ReineforceJr121));

    const tokenId = p1
      .getCardsInZone("battleArea")
      .find((cardId) => !battleAreaBefore.includes(cardId));
    expect(tokenId).toBeDefined();
    expect(p1.getVisibleCard(tokenId!)).toMatchObject({
      effectiveAp: 1,
      effectiveHp: 1,
      restrictions: ["cannot-target-player"],
    });
    expect(p1.getLegalAttackTargets(tokenId!)).not.toContain("direct");
  });
});
