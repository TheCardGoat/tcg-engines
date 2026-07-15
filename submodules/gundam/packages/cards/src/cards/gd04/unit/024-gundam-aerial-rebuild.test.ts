import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04GundamAerialRebuild024 } from "./024-gundam-aerial-rebuild.ts";

describe("Gundam Aerial Rebuild (GD04-024)", () => {
  it("【Deploy】 reveals top 3 and tutors an (Academy) card to hand", () => {
    const academyTutor = createMockUnit({
      ap: 1,
      hp: 1,
      traits: ["academy"],
    });
    const filler1 = createMockUnit({ ap: 1, hp: 1, traits: ["unrelated-1"] });
    const filler2 = createMockUnit({ ap: 1, hp: 1, traits: ["unrelated-2"] });

    const engine = GundamTestEngine.create({
      hand: [gd04GundamAerialRebuild024],
      deck: [academyTutor, filler1, filler2],
      resourceArea: activeResources(7),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd04GundamAerialRebuild024));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
    expect(choice.revealedCardIds).toHaveLength(3);
    expect(choice.legalTutorCardIds).toHaveLength(1);
    const academyTutorId = choice.legalTutorCardIds[0]!;
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: {
          0: {
            tutorCardId: academyTutorId,
          },
        },
      }),
    );

    expect(p1.getHand()).toContain(academyTutorId);
    expect(p1.getCardZone(gd04GundamAerialRebuild024)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("deck")).toHaveLength(2);
  });

  it("allows the player to return all 3 cards to the bottom without tutoring one", () => {
    const academyUnit = createMockUnit({ name: "Academy Unit", traits: ["academy"] });
    const filler1 = createMockUnit({ name: "Filler 1" });
    const filler2 = createMockUnit({ name: "Filler 2" });
    const engine = GundamTestEngine.create({
      hand: [gd04GundamAerialRebuild024],
      deck: [academyUnit, filler1, filler2],
      resourceArea: activeResources(7),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd04GundamAerialRebuild024));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
    expect(choice.revealedCardIds).toHaveLength(3);
    expect(choice.legalTutorCardIds).toHaveLength(1);
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { 0: {} },
      }),
    );

    expect(p1.getHand()).toHaveLength(0);
    expect(p1.getCardsInZone("deck")).toHaveLength(3);
  });
});
