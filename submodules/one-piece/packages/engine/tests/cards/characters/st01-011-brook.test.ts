import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, st01Brook011 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST01-011 Brook", () => {
  test("on play gives up to 2 rested DON!! to a chosen Leader or Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [st01Brook011],
      character: [eb01Doma005],
      activeDon: st01Brook011.cost,
      restedDon: 2,
    });
    const recipientId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(st01Brook011, "south");
    const brookId = engine.findCardInZone("south", "character", st01Brook011);
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(count?.kind).toBe("chooseOption");
    if (count?.kind !== "chooseOption") throw new Error("Expected Brook's DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");

    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(recipient?.kind).toBe("selectEntity");
    if (recipient?.kind !== "selectEntity") throw new Error("Expected Brook's DON!! recipient.");
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      recipientId,
      brookId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recipientId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.restedDon).toBe(2);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === recipientId)?.attachedDon,
    ).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });
});
