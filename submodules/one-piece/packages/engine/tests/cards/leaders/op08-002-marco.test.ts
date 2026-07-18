import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op08Marco002 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-002 Marco", () => {
  test("draws, maps the hand and deck-position choices, then reduces opposing power", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op08Marco002,
        hand: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01MountainGod018, eb01Doma005],
        character: [],
        activeDon: 1,
      },
      {
        character: [eb01Doma005, eb01MountainGod018],
      },
    );
    const drawnId = engine.findCardInZone("south", "deck", eb01MountainGod018);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const otherTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const targetPowerBefore = engine
      .getView("south")
      .players.north.characters.find((card) => card?.instanceId === targetId)?.power;
    if (targetPowerBefore === undefined || targetPowerBefore === null) {
      throw new Error("Expected Marco's target to expose its current power.");
    }

    engine.attachDon(engine.leader("south"), 1, "south");
    engine.activateEffect(engine.leader("south"), "activateMain", "south");

    const handChoice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(handChoice?.kind).toBe("selectEntity");
    if (handChoice?.kind !== "selectEntity") throw new Error("Expected Marco's hand choice.");
    expect(handChoice.candidates.map((candidate) => candidate.ref.id)).toContain(drawnId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [drawnId] }, "south");

    const position = engine.pendingDecision("effectDeckPosition", "south").steps[0];
    expect(position?.kind).toBe("chooseOption");
    if (position?.kind !== "chooseOption") throw new Error("Expected Marco's deck position.");
    expect(position.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectDeckPosition", { optionId: "bottom" }, "south");

    const powerChoice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(powerChoice?.kind).toBe("selectEntity");
    if (powerChoice?.kind !== "selectEntity") throw new Error("Expected Marco's power target.");
    expect(powerChoice.candidates.map((candidate) => candidate.ref.id)).toEqual([
      otherTargetId,
      targetId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(drawnId);
    expect(view.players.south.deckCount).toBe(2);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      targetPowerBefore - 2000,
    );
    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      targetPowerBefore,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
