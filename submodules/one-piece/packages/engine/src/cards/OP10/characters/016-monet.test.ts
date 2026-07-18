import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op10Monet016 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-016 Monet", () => {
  test("rests itself, gives two rested DON!! to one own card, then gives −1000 to an opponent", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10Monet016, eb01Doma005], restedDon: 2 },
      { character: [eb01Doma005] },
    );
    const monetId = engine.findCardInZone("south", "character", op10Monet016);
    const recipientId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);
    const opposingPower = engine
      .getView("south")
      .players.north.characters.find((card) => card?.instanceId === opposingId)?.power;
    if (opposingPower === null || opposingPower === undefined) {
      throw new Error("Expected opposing power.");
    }

    engine.activateEffect(monetId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(count?.kind).toBe("chooseOption");
    if (count?.kind !== "chooseOption") throw new Error("Expected Monet's DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");

    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(recipient?.kind).toBe("selectEntity");
    if (recipient?.kind !== "selectEntity") throw new Error("Expected Monet's DON!! recipient.");
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).toContain(recipientId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recipientId] }, "south");

    const opposingTarget = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(opposingTarget).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (opposingTarget?.kind !== "selectEntity") throw new Error("Expected Monet's power target.");
    expect(opposingTarget.candidates.map((candidate) => candidate.ref.id)).toEqual([opposingId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === monetId)?.rested).toBe(
      true,
    );
    expect(
      view.players.south.characters.find((card) => card?.instanceId === recipientId)?.attachedDon,
    ).toBe(2);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingId)?.power,
    ).toBe(opposingPower - 1000);
    expect(view.prompts).toHaveLength(0);
  });
});
