import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03Gfred048 } from "./048-gfred.ts";

describe("GFreD (GD03-048)", () => {
  function revealBurst(enemyShields: number) {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const shields = Array.from({ length: enemyShields }, (_, index) =>
      createMockUnit({ name: `Enemy Shield ${index + 1}` }),
    );
    const engine = GundamTestEngine.create(
      { shieldArea: [gd03Gfred048] },
      { play: [attacker], shieldArea: shields },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    return p1;
  }

  it("【Burst】 deploys a visible rested AP4/HP3 Unit token with 3 or fewer enemy Shields", () => {
    const p1 = revealBurst(3);

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      directiveIndex: -1,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    const tokenId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.isExhausted(tokenId)).toBe(true);
    expect(p1.getVisibleCard(tokenId)).toMatchObject({ effectiveAp: 4, effectiveHp: 3 });
    expect(p1.getCardZone(gd03Gfred048)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("does not offer the Burst or deploy a token while the enemy has 4 Shields", () => {
    const p1 = revealBurst(4);

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    expect(p1.getCardZone(gd03Gfred048)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("lets the Shield owner decline the Burst without deploying a token", () => {
    const p1 = revealBurst(3);

    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: false } }));

    expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    expect(p1.getCardZone(gd03Gfred048)).toBe(`trash:${PLAYER_ONE}`);
  });
});
