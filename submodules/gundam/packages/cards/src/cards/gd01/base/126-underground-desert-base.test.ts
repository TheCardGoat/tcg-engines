import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01UndergroundDesertBase126 } from "./126-underground-desert-base.ts";

describe("Underground Desert Base (GD01-126)", () => {
  it("【Burst】 deploys the revealed Shield into its owner's Base section", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd01UndergroundDesertBase126] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd01UndergroundDesertBase126)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 adds one Shield to hand", () => {
    const returnedShield = createMockUnit({ name: "Returned Shield" });
    const engine = GundamTestEngine.create({
      hand: [gd01UndergroundDesertBase126],
      shieldArea: [returnedShield],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd01UndergroundDesertBase126));

    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(gd01UndergroundDesertBase126)).toBe(`baseSection:${PLAYER_ONE}`);
  });

  it("still deploys successfully when no Shields remain", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01UndergroundDesertBase126],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd01UndergroundDesertBase126));

    expect(p1.getCardZone(gd01UndergroundDesertBase126)).toBe(`baseSection:${PLAYER_ONE}`);
    expect(p1.getHand()).toHaveLength(0);
  });
});
