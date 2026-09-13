import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectPilotBurstAddsToHand } from "../../../test-helpers/pilot-behavior-test-helpers.ts";
import { eb01AsunaElmarit067 } from "./067-asuna-elmarit.ts";

describe("Asuna Elmarit (EB01-067)", () => {
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(eb01AsunaElmarit067);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [eb01AsunaElmarit067],
      play: [unit],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01AsunaElmarit067, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("【When Paired】 exposes only a (G Generation) Unit and returns the selected revealed card to deck", () => {
    const host = createMockUnit();
    const eligible = createMockUnit({ traits: ["g generation"] });
    const ineligible = createMockUnit({ traits: ["academy"] });
    const engine = GundamTestEngine.create({
      hand: [eb01AsunaElmarit067],
      play: [host],
      deck: [eligible, ineligible, createMockUnit({ traits: ["zeon"] })],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(eb01AsunaElmarit067, hostId));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "deckLook") throw new Error("Expected Asuna's deck-look choice");
    expect(choice.legalTutorCardIds).toHaveLength(1);
    const selectedId = choice.legalTutorCardIds[0]!;
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { [choice.directiveIndex]: { tutorCardId: selectedId } },
      }),
    );

    expect(p1.getCardZone(selectedId)).toBe(`deck:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
  });
});
