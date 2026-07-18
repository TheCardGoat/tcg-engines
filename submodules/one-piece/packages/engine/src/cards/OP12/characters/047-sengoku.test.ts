import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op10XDrake114,
  op12Kuzan043,
  op12Sengoku047,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-047 Sengoku", () => {
  test("pays a hand cost, finds up to two included Navy cards other than Sengoku, and orders the remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op12Sengoku047, eb01Doma005, eb01Fourtricks025],
      deck: [
        op12Kuzan043,
        op10XDrake114,
        op12Sengoku047,
        eb01Doma005,
        eb01MountainGod018,
        eb01Fourtricks025,
      ],
      activeDon: op12Sengoku047.cost,
    });
    const paidId = engine.findCardInZone("south", "hand", eb01Doma005);
    const kuzanId = engine.findCardInZone("south", "deck", op12Kuzan043);
    const compoundNavyId = engine.findCardInZone("south", "deck", op10XDrake114);
    const sengokuId = engine.findCardInZone("south", "deck", op12Sengoku047);
    const wrongTraitId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op12Sengoku047, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paidId] }, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search).toMatchObject({ kind: "selectEntity", min: 0, max: 2 });
    if (search?.kind !== "selectEntity") throw new Error("Expected Sengoku's Navy search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === kuzanId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === compoundNavyId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === sengokuId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongTraitId)?.legal).toBe(
      false,
    );
    engine.resolveDecision(
      "effectSearchSelection",
      { selectedIds: [kuzanId, compoundNavyId] },
      "south",
    );
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Sengoku's remainder order.");
    const order = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([kuzanId, compoundNavyId]),
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paidId);
    expect(engine.getState().players.south.deck.slice(-3)).toEqual(order);
  });
});
