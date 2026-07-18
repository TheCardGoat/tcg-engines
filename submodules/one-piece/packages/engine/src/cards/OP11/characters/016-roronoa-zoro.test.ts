import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op11RoronoaZoro016 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-016 Roronoa Zoro", () => {
  test("once per turn gives a chosen rested DON!! to its Leader or Character", () => {
    const engine = OnePieceTestEngine.create({
      character: [op11RoronoaZoro016, eb01Doma005],
      restedDon: 1,
    });
    const zoroId = engine.findCardInZone("south", "character", op11RoronoaZoro016);
    const recipientId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(zoroId, "activateMain", "south");
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(count).toMatchObject({ kind: "chooseOption" });
    if (count?.kind !== "chooseOption") throw new Error("Expected Zoro's DON!! count choice.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 1, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Zoro's DON!! recipient.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      zoroId,
      recipientId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recipientId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.restedDon).toBe(0);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === recipientId)?.attachedDon,
    ).toBe(1);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: zoroId,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
  });
});
