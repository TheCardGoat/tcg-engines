import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { eb01LeCygneEx023 } from "./023-le-cygne-ex.ts";

describe("Le Cygne (EX) (EB01-023)", () => {
  it("【Attack】 gives each player an independent public deck-look choice", () => {
    const p1Eligible = createMockUnit({ name: "P1 eligible", level: 5 });
    const p2Eligible = createMockUnit({ name: "P2 eligible", level: 5 });
    const defender = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [eb01LeCygneEx023], deck: [p1Eligible] },
      { play: [{ card: defender, exhausted: true }], deck: [p2Eligible] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, defenderId));

    const p1Choice = p1.getBoardView().pendingChoice;
    if (p1Choice?.kind !== "deckLook") throw new Error("Expected player one's deck look");
    const p1CardId = p1Choice.legalTutorCardIds[0]!;
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { [p1Choice.directiveIndex]: { tutorCardId: p1CardId } },
      }),
    );
    expect(p1.getCardZone(p1CardId)).toBe(`hand:${PLAYER_ONE}`);

    const p2Choice = p2.getBoardView().pendingChoice;
    if (p2Choice?.kind !== "deckLook") throw new Error("Expected player two's deck look");
    const p2CardId = p2Choice.legalTutorCardIds[0]!;
    expectSuccess(
      p2.resolveEffect({
        deckLookAnswers: { [p2Choice.directiveIndex]: { tutorCardId: p2CardId } },
      }),
    );
    expect(p2.getCardZone(p2CardId)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("does not offer an ineligible top card as a tutor choice and returns it to its owner's deck", () => {
    const p1Ineligible = createMockUnit({ name: "P1 low level", level: 4 });
    const p2Ineligible = createMockUnit({ name: "P2 low level", level: 4 });
    const defender = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [eb01LeCygneEx023], deck: [p1Ineligible] },
      { play: [{ card: defender, exhausted: true }], deck: [p2Ineligible] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    const p1Choice = p1.getBoardView().pendingChoice;
    if (p1Choice?.kind !== "deckLook") throw new Error("Expected player one's deck look");
    expect(p1Choice.legalTutorCardIds).toHaveLength(0);
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { [p1Choice.directiveIndex]: { toBottom: p1Choice.revealedCardIds } },
      }),
    );

    const p2Choice = p2.getBoardView().pendingChoice;
    if (p2Choice?.kind !== "deckLook") throw new Error("Expected player two's deck look");
    expect(p2Choice.legalTutorCardIds).toHaveLength(0);
    expectSuccess(
      p2.resolveEffect({
        deckLookAnswers: { [p2Choice.directiveIndex]: { toBottom: p2Choice.revealedCardIds } },
      }),
    );

    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
    expect(p2.getBoardView().players[PLAYER_TWO]?.deckCount).toBe(1);
  });
});
