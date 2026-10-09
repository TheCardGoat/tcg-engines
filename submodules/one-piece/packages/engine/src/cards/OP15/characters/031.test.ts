import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op15Purinpurin031 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-031 Purinpurin", () => {
  test("K.O.s the selected rested Character when its cost equals its attached DON!! count", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Purinpurin031], activeDon: 2 },
      {
        character: [
          { card: eb01Doma005, rested: true, attachedDon: 1 },
          { card: eb01Doma005, attachedDon: 1 },
        ],
      },
    );
    const targetId = engine.getView("south").players.north.characters[0]?.instanceId;
    const activeId = engine.getView("south").players.north.characters[1]?.instanceId;
    if (!targetId || !activeId) throw new Error("Expected fixture Characters.");
    engine.playCard(op15Purinpurin031, "south");
    const select = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (select?.kind !== "selectEntity") throw new Error("Expected rested Character selection.");
    expect(select.candidates.map((card) => card.ref.id)).toContain(targetId);
    expect(select.candidates.map((card) => card.ref.id)).not.toContain(activeId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(
      engine.getView("south").players.north.characters.map((card) => card?.instanceId),
    ).toContain(activeId);
  });

  test("may select a rested Character with unequal cost and DON!! count without K.O.'ing it", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15Purinpurin031], activeDon: 2 },
      {
        character: [
          { card: eb01Doma005, rested: true, attachedDon: 2 },
          { card: eb01Doma005, rested: true, attachedDon: 1 },
        ],
      },
    );
    const mismatchId = engine.getView("south").players.north.characters[0]?.instanceId;
    if (!mismatchId) throw new Error("Expected mismatch Character.");
    engine.playCard(op15Purinpurin031, "south");
    const select = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (select?.kind !== "selectEntity") throw new Error("Expected rested Character selection.");
    expect(select.candidates.map((card) => card.ref.id)).toContain(mismatchId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [mismatchId] }, "south");
    expect(
      engine.getView("south").players.north.characters.map((card) => card?.instanceId),
    ).toContain(mismatchId);
    expect(engine.getView("south").players.north.trash).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
