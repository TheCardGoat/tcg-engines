import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op01RoundTable027 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-027 Round Table", () => {
  test("maps the opposing Character choice and expires its power reduction at turn end", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01RoundTable027],
        activeDon: 4,
      },
      {
        character: [eb01Doma005, eb01MountainGod018],
      },
    );
    const eventId = engine.findCardInZone("south", "hand", op01RoundTable027);
    const otherCharacterId = engine.findCardInZone("north", "character", eb01Doma005);
    const selectedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op01RoundTable027);

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to receive the opposing Character choice.");
    }
    expect(targetStep).toMatchObject({ min: 0, max: 1 });
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      otherCharacterId,
      selectedId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === selectedId)?.power,
    ).toBe(-3000);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === otherCharacterId)?.power,
    ).toBe(3000);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 4 });
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("south");
    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === selectedId)?.power,
    ).toBe(7000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
