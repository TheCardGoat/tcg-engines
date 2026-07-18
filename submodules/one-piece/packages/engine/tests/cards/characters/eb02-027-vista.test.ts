import { describe, expect, test } from "vite-plus/test";
import { eb02FakeStrawHatCrew005, eb02Nami017, eb02Vista027 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-027 Vista", () => {
  test("bottom-decks only an opposing Character whose current power is 1000 or less", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb02Vista027],
        activeDon: 4,
      },
      {
        character: [eb02FakeStrawHatCrew005, eb02Nami017],
      },
    );
    const reducedId = engine.findCardInZone("north", "character", eb02FakeStrawHatCrew005);
    const excludedId = engine.findCardInZone("north", "character", eb02Nami017);

    engine.playCard(eb02Vista027, "south");
    const choice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(choice?.kind).toBe("selectEntity");
    if (choice?.kind !== "selectEntity") throw new Error("Expected Vista's return choice.");
    expect(choice).toMatchObject({ min: 0, max: 1 });
    expect(choice.candidates.map((candidate) => candidate.ref.id)).toEqual([reducedId]);
    expect(choice.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [reducedId] }, "south");

    expect(engine.getState().players.north.deck.at(-1)).toBe(reducedId);
    expect(
      engine.getView("south").players.north.characters.map((card) => card?.instanceId),
    ).not.toContain(reducedId);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
