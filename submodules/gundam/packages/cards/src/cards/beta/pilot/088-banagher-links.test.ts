import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { betaBanagherLinks088 } from "./088-banagher-links.ts";

describe("Banagher Links (GD01-088)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [betaBanagherLinks088] },
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

    expect(p2.getCardZone(betaBanagherLinks088)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【When Linked】 draws 1 when Banagher completes the Unit's link condition", () => {
    const linkUnit = createMockUnit({ linkCondition: "[Banagher Links]", ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [betaBanagherLinks088],
      play: [linkUnit],
      resourceArea: activeResources(5),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const handBefore = p1.getHand().length;
    const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

    expectSuccess(p1.assignPilot(betaBanagherLinks088, unitId));

    expect(p1.getHand()).toHaveLength(handBefore);
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore - 1);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("does not draw when Banagher is paired without forming a Link Unit", () => {
    const otherUnit = createMockUnit({ linkCondition: "[Riddhe Marcenas]", ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [betaBanagherLinks088],
      play: [otherUnit],
      resourceArea: activeResources(5),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

    expectSuccess(p1.assignPilot(betaBanagherLinks088, unitId));

    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore);
  });
});
