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
import { gd03FieldDirective103 } from "./103-field-directive.ts";

describe("Field Directive (GD03-103)", () => {
  it("【Burst】 offers and rests only an enemy Unit with 2 or less HP", () => {
    const sturdyAttacker = createMockUnit({ name: "Sturdy Attacker", hp: 3 });
    const fragileEnemy = createMockUnit({ name: "Fragile Enemy", hp: 2 });
    const engine = GundamTestEngine.create(
      { play: [sturdyAttacker, fragileEnemy] },
      { shieldArea: [gd03FieldDirective103] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [sturdyId, fragileId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(sturdyId!, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [fragileId],
    });
    expectSuccess(p2.resolveEffect({ targets: [fragileId!] }));

    expect(p1.isExhausted(fragileId!)).toBe(true);
    expect(p2.getCardZone(gd03FieldDirective103)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("【Main】 deals 2 damage to a rested enemy Unit when 3 enemy Units are in play", () => {
    const rested = createMockUnit({ name: "Rested Target", hp: 4 });
    const activeA = createMockUnit({ hp: 4 });
    const activeB = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd03FieldDirective103], resourceArea: activeResources(4) },
      { play: [{ card: rested, exhausted: true }, activeA, activeB] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const restedId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(commandId, { targets: [restedId] }));

    expect(p2.getDamage(restedId)).toBe(2);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("plays without damage or a target choice when fewer than 3 enemy Units are in play", () => {
    const rested = createMockUnit({ hp: 4 });
    const active = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd03FieldDirective103], resourceArea: activeResources(4) },
      { play: [{ card: rested, exhausted: true }, active] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const restedId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(commandId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getDamage(restedId)).toBe(0);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("rejects an active enemy Unit as the Main effect's damage target", () => {
    const rested = createMockUnit({ hp: 4 });
    const activeTarget = createMockUnit({ hp: 4 });
    const thirdEnemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd03FieldDirective103], resourceArea: activeResources(4) },
      { play: [{ card: rested, exhausted: true }, activeTarget, thirdEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const activeTargetId = p2.getCardsInZone("battleArea")[1]!;

    expectFailure(p1.playCommand(commandId, { targets: [activeTargetId] }), "INVALID_TARGET");

    expect(p2.getDamage(activeTargetId)).toBe(0);
    expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
  });
});
