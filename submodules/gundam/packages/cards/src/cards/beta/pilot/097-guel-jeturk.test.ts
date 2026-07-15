import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
  activeResources,
} from "@tcg/gundam-engine";
import { betaGuelJeturk097 } from "./097-guel-jeturk.ts";

describe("Guel Jeturk (GD01-097)", () => {
  it("【Burst】 adds Guel to hand when his shield is destroyed", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [betaGuelJeturk097] },
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
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(shieldId)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【Activate·Main】 sets unit active + cantAttack when opponent has 8+ cards", () => {
    const hostUnit = createMockUnit({ ap: 3, hp: 3, level: 3 });
    const opponentHand = Array.from({ length: 8 }, () => createMockUnit());
    const engine = GundamTestEngine.create(
      {
        play: [{ card: hostUnit, exhausted: true }],
        hand: [betaGuelJeturk097],
        resourceArea: activeResources(3),
        deck: 5,
      },
      { hand: opponentHand, deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(betaGuelJeturk097, hostUnit));

    const pilotId = p1.getCardsInZone("battleArea").find((id) => id !== hostId)!;

    const result = p1.activateAbility(pilotId, 0);
    expectSuccess(result);

    expect(p1.isExhausted(hostId)).toBe(false);
    expectFailure(p1.enterBattle(hostId, "direct"), "CANNOT_ATTACK");
  });
});
