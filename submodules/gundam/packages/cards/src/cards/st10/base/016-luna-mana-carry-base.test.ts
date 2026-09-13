import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st10LunaManaCarryBase016 } from "./016-luna-mana-carry-base.ts";

describe("Luna Mana & Carry Base (ST10-016)", () => {
  it("【Burst】 deploys the revealed Base into its owner's Base section", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [st10LunaManaCarryBase016] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const choice = p2.getBoardView().pendingChoice;
    if (choice?.kind !== "optional") throw new Error("Expected Luna Mana's visible Burst choice");
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [choice.directiveIndex]: true } }));

    expect(p2.getCardZone(st10LunaManaCarryBase016)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】returns one Shield and recovers every friendly G Generation Unit by one", () => {
    const firstGenerationUnit = createMockUnit({ traits: ["g generation"], hp: 6 });
    const secondGenerationUnit = createMockUnit({ traits: ["g generation"], hp: 6 });
    const outsider = createMockUnit({ traits: ["zeon"], hp: 6 });
    const shield = createMockUnit({ name: "Returned Shield" });
    const engine = GundamTestEngine.create({
      hand: [st10LunaManaCarryBase016],
      play: [
        { card: firstGenerationUnit, damage: 2 },
        { card: secondGenerationUnit, damage: 1 },
        { card: outsider, damage: 2 },
      ],
      shieldArea: [shield],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [firstId, secondId, outsiderId] = p1.getCardsInZone("battleArea");
    const baseId = p1.getHand()[0]!;

    expectSuccess(p1.deployBase(baseId));

    expect(p1.getCardZone(shield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(0);
    expect(p1.getDamage(firstId!)).toBe(1);
    expect(p1.getDamage(secondId!)).toBe(0);
    expect(p1.getDamage(outsiderId!)).toBe(2);
  });

  it("requires its printed Lv.4 and one active Resource to deploy", () => {
    const lowLevel = GundamTestEngine.create({
      hand: [st10LunaManaCarryBase016],
      resourceArea: activeResources(3),
    });
    expectFailure(
      lowLevel.asPlayer(PLAYER_ONE).deployBase(st10LunaManaCarryBase016),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );

    const exhausted = GundamTestEngine.create({
      hand: [st10LunaManaCarryBase016],
      resourceArea: restedResources(4),
    });
    expectFailure(
      exhausted.asPlayer(PLAYER_ONE).deployBase(st10LunaManaCarryBase016),
      "INSUFFICIENT_RESOURCES",
    );
  });
});
