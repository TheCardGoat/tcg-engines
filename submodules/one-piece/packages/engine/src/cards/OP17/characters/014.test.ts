import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-014 Whitey Bay", () => {
  test("[On Play] K.O.s a 2000-base-power-or-less opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-014"], activeDon: 3 },
      { character: [{ cardId: "OP17-023", rested: true }], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP17-023");

    engine.playCard("OP17-014");
    const koTarget = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (koTarget?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    expect(engine.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(
      higumaId,
    );
  });

  test("is present on the field", () => {
    const engine = OnePieceTestEngine.create({ character: ["OP17-014"], activeDon: 5 }, {});
    const cardId = engine.findCardInZone("south", "character", "OP17-014");
    expect(cardId).toBeDefined();
  });
});
