import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01DearkaElthman095 } from "./095-dearka-elthman.ts";

describe("Dearka Elthman (GD01-095)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd01DearkaElthman095] },
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

    expect(p2.getCardZone(gd01DearkaElthman095)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【When Linked】 asks which card to discard, then draws only after the chosen discard", () => {
    const host = createMockUnit({ linkCondition: "[Dearka Elthman]", ap: 2, hp: 4 });
    const firstFodder = createMockUnit({ name: "First Fodder" });
    const secondFodder = createMockUnit({ name: "Second Fodder" });
    const engine = GundamTestEngine.create({
      hand: [gd01DearkaElthman095, firstFodder, secondFodder],
      play: [host],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd01DearkaElthman095, hostId));
    const [firstFodderId, secondFodderId] = p1.getHand();
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [firstFodderId, secondFodderId],
    });
    const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;
    expectSuccess(p1.resolveEffect({ targets: [secondFodderId!] }));

    expect(p1.getCardZone(secondFodderId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(firstFodderId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore - 1);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("does not draw when no card can be discarded after Dearka becomes linked", () => {
    const host = createMockUnit({ linkCondition: "[Dearka Elthman]", ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd01DearkaElthman095],
      play: [host],
      resourceArea: activeResources(3),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

    expectSuccess(p1.assignPilot(gd01DearkaElthman095, hostId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore);
  });
});
