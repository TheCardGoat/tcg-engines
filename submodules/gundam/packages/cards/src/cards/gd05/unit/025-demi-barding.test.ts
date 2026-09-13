import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05DemiBarding025 } from "./025-demi-barding.ts";

describe("Demi Barding (GD05-025)", () => {
  /** @behavioral-proof complete: Deploy timing, top-three visibility, Command-only filter, selected result, and optional decline are public. */
  it("looks at the top three and offers only Commands to add to hand", () => {
    const eligible = createMockCommand({ name: "Eligible Command" });
    const engine = GundamTestEngine.create({
      hand: [gd05DemiBarding025],
      resourceArea: activeResources(4),
      deck: [eligible, createMockUnit(), createMockPilot()],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(unitId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected Demi Barding's deck-look choice");
    expect(choice).toMatchObject({
      sourceCardId: unitId,
      randomizeRemainingToBottom: true,
    });
    expect(choice.revealedCardIds).toHaveLength(3);
    expect(choice.legalTutorCardIds).toHaveLength(1);
    const commandId = choice.legalTutorCardIds[0]!;

    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { [choice.directiveIndex]: { tutorCardId: commandId } },
      }),
    );

    expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(unitId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
  });

  it("may decline an eligible Command and returns all revealed cards to the deck", () => {
    const engine = GundamTestEngine.create({
      hand: [gd05DemiBarding025],
      resourceArea: activeResources(4),
      deck: [createMockCommand(), createMockUnit(), createMockPilot()],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd05DemiBarding025));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected Demi Barding's deck-look choice");
    expect(choice.legalTutorCardIds).toHaveLength(1);
    expectSuccess(p1.resolveEffect({ deckLookAnswers: { [choice.directiveIndex]: {} } }));

    expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(0);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
  });
});
