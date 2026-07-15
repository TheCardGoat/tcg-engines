import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03SomaPeries100 } from "./100-soma-peries.ts";

describe("Soma Peries (GD03-100)", () => {
  it("【Burst】 adds this revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03SomaPeries100] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03SomaPeries100)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【Destroyed】 gives the chosen enemy Unit AP-3 until the current turn ends", () => {
    const host = createMockUnit({ ap: 2, hp: 4 });
    const attacker = createMockUnit({ name: "Destroying Attacker", ap: 8, hp: 1 });
    const target = createMockUnit({ name: "AP Reduction Target", ap: 5, hp: 8 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03SomaPeries100],
        play: [{ card: host, exhausted: true }],
        resourceArea: activeResources(3),
        deck: 3,
      },
      { play: [attacker, target], deck: 3 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [attackerId, targetId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(gd03SomaPeries100, hostId));
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.enterBattle(attackerId!, hostId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [targetId],
    });
    expectSuccess(p1.resolveEffect({ targets: [targetId!] }));

    expect(p2.getVisibleCard(targetId!)?.effectiveAp).toBe(2);

    expectSuccess(p2.passPhase());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.passActionStep());

    expect(p2.getVisibleCard(targetId!)?.effectiveAp).toBe(5);
  });
});
