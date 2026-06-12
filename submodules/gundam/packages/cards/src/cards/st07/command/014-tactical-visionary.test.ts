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
  it("data encodes a top-3 CB Unit/Pilot tutor", () => {
    const directive = st07TacticalVisionary014.effects?.[0]?.directives[0];

    if (!directive || !("action" in directive)) throw new Error("Unexpected directive shape");
    expect(directive.action).toEqual({
      action: "lookAtTopDeck",
      count: 3,
      return: "chooseTop",
      tutorFilter: {
        owner: "friendly",
        cardType: ["unit", "pilot"],
        attributeFilters: [{ attribute: "trait", comparison: "includes", value: "cb" }],
      },
    });
  });

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
    const [firstId, cbPilotId, thirdId] = p1.getCardsInZone("deck");

    expectSuccess(p1.playCommand(st07TacticalVisionary014));
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { 0: { tutorCardId: cbPilotId!, toBottom: [firstId!, thirdId!] } },
      }),
    );

    expect(p1.getHand().some((id) => id.includes(`_${cbPilot.cardNumber}_`))).toBe(true);
  });
});
