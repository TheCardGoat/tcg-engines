import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb03Nami006, eb03NefeltariVivi001 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-006 Nami", () => {
  test("pays the active-Leader power cost to draw, then applies her once-per-turn reduction", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: eb03NefeltariVivi001,
        hand: [eb03Nami006],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: 5,
      },
      {
        character: [eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(eb03Nami006, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    let view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(0);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.south.deckCount).toBe(1);

    const namiId = engine.findCardInZone("south", "character", eb03Nami006);
    engine.activateEffect(namiId, "activateMain", "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Nami's opposing target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      2000,
    );
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: namiId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
