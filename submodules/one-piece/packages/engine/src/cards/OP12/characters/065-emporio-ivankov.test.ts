import { describe, expect, test } from "vite-plus/test";
import { eb01OffWhite019, op01Shanks120 } from "@tcg/op-cards";
import { op12EmporioIvankov065 } from "../../../../../cards/src/cards/OP12/characters/065-emporio-ivankov.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-065 Emporio.Ivankov", () => {
  test("with four Events gains Blocker, then returns a chosen Event after its battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op12EmporioIvankov065],
        trash: [eb01OffWhite019, eb01OffWhite019, eb01OffWhite019, eb01OffWhite019],
      },
      { character: [{ card: op01Shanks120, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const ivankovId = engine.findCardInZone("south", "character", op12EmporioIvankov065);
    const attackerId = engine.findCardInZone("north", "character", op01Shanks120);
    const returnedEventId = engine.findCardInZone("south", "trash", eb01OffWhite019);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Ivankov's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(ivankovId);
    engine.resolveDecision("battleBlocker", { selectedIds: [ivankovId] }, "south");

    const event = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (event?.kind !== "selectEntity") throw new Error("Expected Ivankov's Event choice.");
    expect(event.candidates.map((candidate) => candidate.ref.id)).toContain(returnedEventId);
    expect(event.candidates.map((candidate) => candidate.ref.id)).not.toContain(ivankovId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [returnedEventId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(returnedEventId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(ivankovId);
    expect(view.prompts).toHaveLength(0);
  });
});
