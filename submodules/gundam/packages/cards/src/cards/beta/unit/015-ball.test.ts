import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
} from "@tcg/gundam-engine";
import { betaBall015 } from "./015-ball.ts";

describe("Ball (GD01-015)", () => {
  it("【Attack】Choose 1 of your Units. It recovers 1 HP.", () => {
    const friendly = createMockUnit({ ap: 1, hp: 5 });
    const enemy = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        play: [
          { card: betaBall015, damage: 2 },
          { card: friendly, damage: 2 },
        ],
      },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const ballId = p1.getCardsInZone("battleArea")[0]!;
    const friendlyId = p1.getCardsInZone("battleArea")[1]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expect(p1.getDamage(friendlyId)).toBe(2);

    expectSuccess(p1.enterBattle(ballId, enemyId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      sourceCardId: ballId,
    });
    expectSuccess(p1.resolveEffect({ targets: [friendlyId] }));

    expect(p1.getDamage(friendlyId)).toBe(1);
    expect(p1.getDamage(ballId)).toBe(2);
  });
});
