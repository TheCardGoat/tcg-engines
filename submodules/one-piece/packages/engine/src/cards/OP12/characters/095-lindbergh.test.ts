import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op05BeloBetty002, op12Lindbergh095 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-095 Lindbergh", () => {
  test("gains 4 cost with a Revolutionary Army Leader, draws, then trashes from hand", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op05BeloBetty002,
      hand: [op12Lindbergh095, eb01Doma005],
      deck: [eb01MountainGod018, eb01Doma005],
      activeDon: op12Lindbergh095.cost,
    });
    engine.playCard(op12Lindbergh095, "south");
    const lindberghId = engine.findCardInZone("south", "character", op12Lindbergh095);
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Lindbergh's trash choice.");
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [trash.candidates[0]!.ref.id] },
      "south",
    );
    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === lindberghId)?.cost,
    ).toBe(op12Lindbergh095.cost + 4);
    expect(view.players.south.trash).toHaveLength(1);
  });
});
