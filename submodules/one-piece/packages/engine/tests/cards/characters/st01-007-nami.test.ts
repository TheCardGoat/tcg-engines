import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, st01Nami007 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST01-007 Nami", () => {
  test("once per turn gives up to 1 rested DON!! to a chosen Leader or Character", () => {
    const engine = OnePieceTestEngine.create({
      character: [st01Nami007, eb01Doma005],
      restedDon: 1,
    });
    const namiId = engine.findCardInZone("south", "character", st01Nami007);
    const recipientId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(namiId, "activateMain", "south");
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(count?.kind).toBe("chooseOption");
    if (count?.kind !== "chooseOption") throw new Error("Expected Nami's DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(recipient?.kind).toBe("selectEntity");
    if (recipient?.kind !== "selectEntity") throw new Error("Expected Nami's DON!! recipient.");
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      namiId,
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
        sourceInstanceId: namiId,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
  });
});
