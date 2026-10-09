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
  test("FAQ: two Kalgara respond to opposing Life removal but draw only one card", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [op12Kalgara099, op12Kalgara099, { card: eb01MountainGod018, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { life: [eb01Doma005, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(eb01MountainGod018, e.leader("north"));
    const order = e.pendingDecision("readyEffectOrder", "south").steps[0];
    if (order?.kind !== "chooseOption")
      throw new Error("Expected ordering of the two fulfilled Kalgara effects");
    e.asSouth().chooseOption("readyEffectOrder", order.options[0]!.id);
    expect(e.getView("south").players.south.hand).toHaveLength(1);
    expect(e.getView("south").players.south.deckCount).toBe(2);
    expect(e.getView("south").players.north.lifeCount).toBe(1);
  });
});
