import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST02-008 Apoo", () => {
  test.each([0, 1])("rests an opposing DON only with given DON %i", (attachedDon) => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST02-008", attachedDon, playedOnTurn: 0 }] },
      { activeDon: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.declareAttack(e.findCardInZone("south", "character", "ST02-008"), e.leader("north"), "south");
    if (attachedDon) {
      const step = e.pendingDecision("effectMixedRestSelection", "south").steps[0];
      if (step?.kind !== "payCost") throw Error("DON choice");
      e.resolveDecision(
        "effectMixedRestSelection",
        { selectedIds: [step.candidates[0]!.ref.id] },
        "south",
      );
    }
    expect(e.getView("south").players.north).toMatchObject({
      activeDon: 2 - attachedDon,
      restedDon: attachedDon,
    });
  });
});
