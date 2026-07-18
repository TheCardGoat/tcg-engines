import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op03Haruta009 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-009 Haruta", () => {
  test("once per turn gives one rested DON!! to its Leader or a Character", () => {
    const engine = OnePieceTestEngine.create({
      character: [op03Haruta009, eb01Doma005],
      restedDon: 1,
    });
    const harutaId = engine.findCardInZone("south", "character", op03Haruta009);
    const recipientId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(harutaId, "activateMain", "south");

    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(count?.kind).toBe("chooseOption");
    if (count?.kind !== "chooseOption") throw new Error("Expected Haruta's DON!! count choice.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Haruta's DON!! recipient.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), recipientId]),
    );
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
        sourceInstanceId: harutaId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("may choose zero DON!! without moving one or leaving a target prompt", () => {
    const engine = OnePieceTestEngine.create({
      character: [op03Haruta009, eb01Doma005],
      restedDon: 1,
    });
    const harutaId = engine.findCardInZone("south", "character", op03Haruta009);
    const recipientId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(harutaId, "activateMain", "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.restedDon).toBe(1);
    expect(view.players.south.leader.attachedDon).toBe(0);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === recipientId)?.attachedDon,
    ).toBe(0);
    expect(view.prompts).toHaveLength(0);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: harutaId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });
});
