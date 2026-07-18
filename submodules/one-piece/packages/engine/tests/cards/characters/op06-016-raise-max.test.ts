import { describe, expect, test } from "vite-plus/test";
import { op06Arlong023, op06RaiseMax016 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-016 Raise Max", () => {
  test("returns itself and its DON!! to reduce an opposing Character for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op06RaiseMax016, attachedDon: 2 }] },
      { character: [op06Arlong023] },
    );
    const raiseMaxId = engine.findCardInZone("south", "character", op06RaiseMax016);
    const targetId = engine.findCardInZone("north", "character", op06Arlong023);

    engine.activateEffect(raiseMaxId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Raise Max's power target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === raiseMaxId)).toBe(
      false,
    );
    expect(engine.getState().players.south.deck.at(-1)).toBe(raiseMaxId);
    expect(view.players.south.restedDon).toBe(2);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      3000,
    );

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      6000,
    );
  });
});
