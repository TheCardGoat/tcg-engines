import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Laboon048, eb01MountainGod018, eb02Brook048 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-048 Brook", () => {
  test("returns Laboon on play, then plays that physical card when another Brook is K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb02Brook048],
        character: [{ card: eb02Brook048, rested: true, playedOnTurn: 0 }],
        trash: [eb01Laboon048, eb01Doma005],
        deck: [eb01Doma005],
        activeDon: 5,
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "south", activeSeat: "south" },
    );
    const koBrookId = engine.findCardInZone("south", "character", eb02Brook048);
    const laboonId = engine.findCardInZone("south", "trash", eb01Laboon048);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(eb02Brook048, "south");
    const returnLaboon = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(returnLaboon?.kind).toBe("selectEntity");
    if (returnLaboon?.kind !== "selectEntity") {
      throw new Error("Expected Brook's trash-to-hand Laboon choice.");
    }
    expect(returnLaboon.candidates.map((candidate) => candidate.ref.id)).toEqual([laboonId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [laboonId] }, "south");

    engine.endTurn("south");
    engine.declareAttack(attackerId, koBrookId, "north");
    const counter = engine.getView("south").decisions.flatMap((decision) => decision.steps)[0];
    if (counter?.kind === "selectEntity") {
      engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    }

    const playLaboon = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(playLaboon?.kind).toBe("selectEntity");
    if (playLaboon?.kind !== "selectEntity") {
      throw new Error("Expected K.O.'d Brook's Laboon play choice.");
    }
    expect(playLaboon.candidates.map((candidate) => candidate.ref.id)).toEqual([laboonId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [laboonId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(koBrookId);
    expect(view.players.south.characters.some((card) => card?.instanceId === laboonId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
