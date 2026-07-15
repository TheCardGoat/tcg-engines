import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st07TacticalVisionary014 } from "./014-tactical-visionary.ts";

describe("Tactical Visionary (ST07-014)", () => {
  it("tutors a CB Pilot from the top 3 into hand", () => {
    const cbPilot = createMockPilot({ traits: ["cb"] });
    const nonMatch1 = createMockUnit({ traits: ["zeon"] });
    const nonMatch2 = createMockUnit({ traits: [] });
    const engine = GundamTestEngine.create({
      hand: [st07TacticalVisionary014],
      resourceArea: activeResources(1),
      deck: [nonMatch1, cbPilot, nonMatch2],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(st07TacticalVisionary014));
    const choice = p1.getBoardView().pendingChoice;
    expect(choice).toMatchObject({ kind: "deckLook", legalTutorCardIds: [expect.any(String)] });
    if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
    const cbPilotId = choice.legalTutorCardIds[0]!;
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: {
          [choice.directiveIndex]: {
            tutorCardId: cbPilotId,
            toBottom: choice.revealedCardIds.filter((id) => id !== cbPilotId),
          },
        },
      }),
    );

    expect(p1.getHand()).toContain(cbPilotId);
  });
});
