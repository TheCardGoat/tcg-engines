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
import { gd03AwakenedPotential118 } from "./118-awakened-potential.ts";

describe("Awakened Potential (GD03-118)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03AwakenedPotential118] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03AwakenedPotential118)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【Action】 returns a rested enemy Unit that is Lv.4 or lower to hand", () => {
    const enemy = createMockUnit({ level: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd03AwakenedPotential118], resourceArea: activeResources(4) },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(commandId, { targets: [enemyId] }));

    expect(p2.getHand()).toContain(enemyId);
  });

  it("with two copies in trash, may grant Blocker that can intercept this turn", () => {
    const blocker = createMockUnit({ hp: 5 });
    const firstAttacker = createMockUnit({ level: 4, ap: 2, hp: 5 });
    const secondAttacker = createMockUnit({ level: 4, ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03AwakenedPotential118],
        trash: [gd03AwakenedPotential118, gd03AwakenedPotential118],
        play: [blocker],
        resourceArea: activeResources(4),
      },
      { play: [firstAttacker, secondAttacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const blockerId = p1.getCardsInZone("battleArea")[0]!;
    const [firstAttackerId, secondAttackerId] = p2.getCardsInZone("battleArea");
    const commandId = p1.getHand()[0]!;

    expectSuccess(p2.enterBattle(firstAttackerId!, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.playCommand(commandId, { targets: [firstAttackerId!, blockerId] }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "optional" });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 1: true } }));
    expect(p2.getHand()).toContain(firstAttackerId);
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expectSuccess(p2.enterBattle(secondAttackerId!, "direct"));
    expectSuccess(p1.declareBlock(blockerId));

    expect(p1.getBoardView().pendingCombat?.blockerId).toBe(blockerId);
  });

  it("cannot return an active enemy Unit", () => {
    const enemy = createMockUnit({ level: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd03AwakenedPotential118], resourceArea: activeResources(4) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectFailure(p1.playCommand(commandId, { targets: [enemyId] }), "INVALID_TARGET");
  });
});
