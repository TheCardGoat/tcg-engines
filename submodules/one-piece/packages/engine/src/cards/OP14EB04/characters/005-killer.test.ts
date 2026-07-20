import { eb01Doma005 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Killer005 } from "../../../../../cards/src/cards/OP14EB04/characters/005-killer.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-005 Killer", () => {
  test("once per turn gives one rested DON!! to a selected own Leader or Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04Killer005, eb01Doma005], restedDon: 1 },
      { character: [eb01Doma005] },
    );
    const killerId = engine.findCardInZone("south", "character", op14eb04Killer005);
    const recipientId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.activateEffect(killerId, "activateMain", "south");
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected Killer's DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Killer's DON!! recipient.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), killerId, recipientId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(opposingId);
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
        sourceInstanceId: killerId,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
    expect(view.prompts).toHaveLength(0);
  });

  test("may choose zero and leave the rested DON!! unattached", () => {
    const engine = OnePieceTestEngine.create({
      character: [op14eb04Killer005],
      restedDon: 1,
    });
    const killerId = engine.findCardInZone("south", "character", op14eb04Killer005);

    engine.activateEffect(killerId, "activateMain", "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.restedDon).toBe(1);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === killerId)?.attachedDon,
    ).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });
});
