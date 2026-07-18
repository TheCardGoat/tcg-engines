import { describe, expect, test } from "vite-plus/test";
import { op07Foxy059, op07Itomimizu060 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-060 Itomimizu", () => {
  test("with an included Foxy Pirates Leader and no other copy, adds one rested DON!! once", () => {
    const originalTraits = op07Foxy059.traits;
    op07Foxy059.traits = ["Foxy Pirates Long Ring Long Land"];
    try {
      const engine = OnePieceTestEngine.create({
        leaderCardId: op07Foxy059,
        character: [op07Itomimizu060],
        donDeckCount: 2,
      });
      const itomimizuId = engine.findCardInZone("south", "character", op07Itomimizu060);

      engine.activateEffect(itomimizuId, "activateMain", "south");
      const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
      expect(addDon?.kind).toBe("chooseOption");
      if (addDon?.kind !== "chooseOption") throw new Error("Expected Itomimizu's DON!! choice.");
      expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
      engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

      expect(engine.getView("south").players.south).toMatchObject({
        restedDon: 1,
        donDeckCount: 1,
      });
      expect(
        engine.expectFailure({
          type: "activateEffect",
          seat: "south",
          sourceInstanceId: itomimizuId,
          trigger: "activateMain",
        }).accepted,
      ).toBe(false);
    } finally {
      op07Foxy059.traits = originalTraits;
    }
  });

  test("cannot activate while another Itomimizu is on the field", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op07Foxy059,
      character: [op07Itomimizu060, op07Itomimizu060],
      donDeckCount: 1,
    });
    const sourceId = engine
      .getView("south")
      .players.south.characters.find((card) => card?.cardId === op07Itomimizu060.id)?.instanceId;
    if (!sourceId) throw new Error("Expected an Itomimizu source.");

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: sourceId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
    expect(engine.getView("south").players.south).toMatchObject({ restedDon: 0, donDeckCount: 1 });
  });
});
