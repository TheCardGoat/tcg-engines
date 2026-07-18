import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op12Perona034, op12ShimotsukiKouzaburou029 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-029 Shimotsuki Kouzaburou", () => {
  test("rests a cost-2-or-less Character, then K.O.s a rested base-cost-1 Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op12ShimotsukiKouzaburou029], activeDon: op12ShimotsukiKouzaburou029.cost },
      { character: [op12Perona034, eb01Doma005] },
    );
    const peronaId = engine.findCardInZone("north", "character", op12Perona034);

    engine.playCard(op12ShimotsukiKouzaburou029, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [peronaId] }, "south");
    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(ko).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (ko?.kind !== "selectEntity") throw new Error("Expected Kouzaburou's K.O. choice.");
    expect(ko.candidates.map((candidate) => candidate.ref.id)).toEqual([peronaId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [peronaId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      peronaId,
    );
  });
});
