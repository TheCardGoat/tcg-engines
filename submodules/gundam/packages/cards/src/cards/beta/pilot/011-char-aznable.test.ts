import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  expectSuccess,
  createMockUnit,
} from "@tcg/gundam-engine";
import { betaCharAznable011 } from "./011-char-aznable.ts";
describe("Char Aznable (ST03-011)", () => {
  it("【Burst】 adds Char to hand when his shield is destroyed", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [betaCharAznable011] },
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
      sourceCardId: expect.any(String),
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(betaCharAznable011)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【Attack】During this turn, this Unit gets AP+1 and, if it is a Link Unit, it gains <High-Maneuver>.", () => {
    const linkUnit = createMockUnit({
      ap: 3,
      hp: 5,
      level: 1,
      cost: 1,
      linkCondition: "[Char Aznable]",
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const defender = createMockUnit({ ap: 1, hp: 5 });

    const engine = GundamTestEngine.create(
      {
        hand: [betaCharAznable011],
        play: [linkUnit],
        resourceArea: activeResources(6),
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const pilotId = p1.getHand()[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.assignPilot(pilotId, attackerId));
    const apBeforeAttack = p1.getVisibleCard(attackerId)?.effectiveAp;

    expectSuccess(p1.enterBattle(attackerId, defenderId));

    expect(p1.getVisibleCard(attackerId)?.effectiveAp).toBe((apBeforeAttack ?? 0) + 1);
    expect(p1.getVisibleCard(attackerId)?.keywords).toContain("HighManeuver");
  });
});
