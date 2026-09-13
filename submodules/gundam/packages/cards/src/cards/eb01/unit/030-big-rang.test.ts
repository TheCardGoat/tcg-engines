import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { eb01BigRang030 } from "./030-big-rang.ts";

describe("Big-Rang (EB01-030)", () => {
  it("【Deploy】 offers only a Lv.3 G Generation Unit from the top three", () => {
    const eligible = createMockUnit({ level: 3, traits: ["g generation"] });
    const wrongLevel = createMockUnit({ level: 4, traits: ["g generation"] });
    const wrongTrait = createMockUnit({ level: 3, traits: ["zeon"] });
    const engine = GundamTestEngine.create({
      hand: [eb01BigRang030],
      resourceArea: activeResources(5),
      deck: [eligible, wrongLevel, wrongTrait],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(eb01BigRang030));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected Big-Rang's deck-look choice");
    expect(choice.revealedCardIds).toHaveLength(3);
    expect(choice.legalTutorCardIds).toHaveLength(1);
    const chosenId = choice.legalTutorCardIds[0]!;
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { [choice.directiveIndex]: { tutorCardId: chosenId } },
      }),
    );

    expect(p1.getCardZone(chosenId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
  });

  it("does not offer a tutor choice when none of the three visible cards match", () => {
    const engine = GundamTestEngine.create({
      hand: [eb01BigRang030],
      resourceArea: activeResources(5),
      deck: [
        createMockUnit({ level: 4, traits: ["g generation"] }),
        createMockUnit({ level: 3, traits: ["zeon"] }),
        createMockUnit({ level: 2, traits: ["academy"] }),
      ],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(eb01BigRang030));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected Big-Rang's deck-look choice");
    expect(choice.legalTutorCardIds).toHaveLength(0);
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { [choice.directiveIndex]: {} },
      }),
    );
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
  });
});
