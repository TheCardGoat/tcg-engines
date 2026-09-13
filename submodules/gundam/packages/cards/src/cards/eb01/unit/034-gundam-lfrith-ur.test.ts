import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { eb01GundamLfrithUr034 } from "./034-gundam-lfrith-ur.ts";

describe("Gundam Lfrith Ur (EB01-034)", () => {
  it("【When Linked】 offers only a Lv.3 G Generation Unit from the top three", () => {
    const pilot = createMockPilot({ traits: ["g generation"] });
    const eligible = createMockUnit({ level: 3, traits: ["g generation"] });
    const wrongLevel = createMockUnit({ level: 4, traits: ["g generation"] });
    const wrongTrait = createMockUnit({ level: 3, traits: ["academy"] });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [eb01GundamLfrithUr034],
      resourceArea: activeResources(1),
      deck: [eligible, wrongLevel, wrongTrait],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, sourceId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected Lfrith Ur's deck-look choice");
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

  it("does not offer a card when the linked deck look has no Lv.3 G Generation Unit", () => {
    const pilot = createMockPilot({ traits: ["g generation"] });
    const wrongLevel = createMockUnit({ level: 4, traits: ["g generation"] });
    const wrongTrait = createMockUnit({ level: 3, traits: ["academy"] });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [eb01GundamLfrithUr034],
      resourceArea: activeResources(1),
      deck: [wrongLevel, wrongTrait],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, sourceId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected Lfrith Ur's deck-look choice");
    expect(choice.legalTutorCardIds).toEqual([]);
    expectSuccess(p1.resolveEffect({ deckLookAnswers: { [choice.directiveIndex]: {} } }));

    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
  });
});
