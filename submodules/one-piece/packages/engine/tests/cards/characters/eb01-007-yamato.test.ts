import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Yamato007 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-007 Yamato", () => {
  test("maps the rested-DON!! count and Leader-or-Character recipient", () => {
    const engine = OnePieceTestEngine.create({
      character: [eb01Yamato007, eb01Doma005],
      restedDon: 1,
    });
    const yamatoId = engine.findCardInZone("south", "character", eb01Yamato007);
    const recipientId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(yamatoId, "activateMain", "south");

    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(count?.kind).toBe("chooseOption");
    if (count?.kind !== "chooseOption") throw new Error("Expected Yamato's DON!! count choice.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(recipient?.kind).toBe("selectEntity");
    if (recipient?.kind !== "selectEntity") {
      throw new Error("Expected Yamato's Leader-or-Character recipient.");
    }
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      yamatoId,
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
