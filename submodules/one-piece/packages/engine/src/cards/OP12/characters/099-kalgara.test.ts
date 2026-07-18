import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op12Kalgara099,
  op12Lindbergh095,
  op12Sabo100,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-099 Kalgara", () => {
  test("draws when own Life is removed, then blocks later draws from own effects that turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [op12Kalgara099],
      hand: [op12Sabo100, op12Lindbergh095, eb01Doma005],
      life: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      deck: [
        eb01MountainGod018,
        eb01Doma005,
        eb01MountainGod018,
        eb01Doma005,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: 10,
    });
    engine.playCard(op12Sabo100, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const discardId = engine.findCardInZone("south", "hand", eb01Doma005);
    const firstTrash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (firstTrash?.kind !== "selectEntity") throw new Error("Expected Sabo's trash choice.");
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardId] }, "south");
    const deckAfterKalgara = engine.getView("south").players.south.deckCount;

    engine.playCard(op12Lindbergh095, "south");
    const secondTrash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (secondTrash?.kind !== "selectEntity") throw new Error("Expected Lindbergh's trash choice.");
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [secondTrash.candidates[0]!.ref.id] },
      "south",
    );
    expect(engine.getView("south").players.south.deckCount).toBe(deckAfterKalgara);
  });
});
