import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op05Chaka008 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-008 Chaka", () => {
  test("with one DON!! attached gives up to two rested DON!! to one own Leader or Character once per turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op05Chaka008, attachedDon: 1 }, eb01Doma005],
      restedDon: 2,
    });
    const chakaId = engine.findCardInZone("south", "character", op05Chaka008);
    const characterId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(chakaId, "activateMain", "south");

    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(count?.kind).toBe("chooseOption");
    if (count?.kind !== "chooseOption") throw new Error("Expected Chaka's DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");

    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(recipient?.kind).toBe("selectEntity");
    if (recipient?.kind !== "selectEntity") throw new Error("Expected Chaka's DON!! recipient.");
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), chakaId, characterId]),
    );
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      engine.leader("north"),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [characterId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.restedDon).toBe(0);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === characterId)?.attachedDon,
    ).toBe(2);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: chakaId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("cannot activate without one DON!! attached", () => {
    const engine = OnePieceTestEngine.create({
      character: [op05Chaka008],
      restedDon: 2,
    });
    const chakaId = engine.findCardInZone("south", "character", op05Chaka008);

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: chakaId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
    expect(engine.getView("south").players.south.restedDon).toBe(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
