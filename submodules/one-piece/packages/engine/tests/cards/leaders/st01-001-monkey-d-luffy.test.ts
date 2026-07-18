import { describe, expect, test } from "vite-plus/test";
import { op14eb04Diamante066, st01MonkeyDLuffy001 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST01-001 Monkey.D.Luffy", () => {
  test("maps the 0–1 rested-DON!! choice directly to a Leader-or-Character recipient", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: st01MonkeyDLuffy001,
      character: [op14eb04Diamante066],
      restedDon: 1,
    });
    const recipientId = engine.findCardInZone("south", "character", op14eb04Diamante066);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");

    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(count?.kind).toBe("chooseOption");
    if (count?.kind !== "chooseOption") throw new Error("Expected Luffy's DON!! count choice.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(recipient?.kind).toBe("selectEntity");
    if (recipient?.kind !== "selectEntity") throw new Error("Expected Luffy's recipient choice.");
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      recipientId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recipientId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.restedDon).toBe(0);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === recipientId)?.attachedDon,
    ).toBe(1);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
