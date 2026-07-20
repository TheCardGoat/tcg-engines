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
import { gd04MomentOfRest102 } from "./102-moment-of-rest.ts";

describe("Moment of Rest (GD04-102)", () => {
  it("【Burst】offers activation, draws 1, and moves the Shield to trash", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 3, hp: 5 });
    const drawCard = createMockUnit({ name: "Burst Draw" });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04MomentOfRest102], deck: [drawCard] },
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
    expect(p1.getBoardView().pendingChoice?.kind).toBe("optional");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p1.getHand()).toHaveLength(1);
    expect(p1.getCardsInZone("deck")).toHaveLength(0);
    expect(p1.getCardZone(gd04MomentOfRest102)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("【Main】keeps a rested enemy Lv.5 Unit rested through its next start phase", () => {
    const enemy = createMockUnit({ level: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04MomentOfRest102],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [{ card: enemy, exhausted: true }], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(commandId, { targets: [enemyId] }));
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p2.isExhausted(enemyId)).toBe(true);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("cannot target an active enemy Unit", () => {
    const enemy = createMockUnit({ level: 5 });
    const engine = GundamTestEngine.create(
      { hand: [gd04MomentOfRest102], resourceArea: activeResources(4), deck: 5 },
      { play: [enemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectFailure(p1.playCommand(gd04MomentOfRest102, { targets: [enemyId] }), "INVALID_TARGET");
  });
});
