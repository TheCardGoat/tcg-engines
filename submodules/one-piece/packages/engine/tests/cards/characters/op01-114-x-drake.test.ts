import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op01XDrake114 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-114 X.Drake", () => {
  test("returns one DON!! on play, then lets the opponent trash a chosen hand card", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01XDrake114],
        activeDon: op01XDrake114.cost + 1,
      },
      { hand: [eb01Doma005, eb01Fourtricks025] },
    );
    const discardedId = engine.findCardInZone("north", "hand", eb01Fourtricks025);
    const keptId = engine.findCardInZone("north", "hand", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op01XDrake114, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const discard = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    expect(discard?.kind).toBe("selectEntity");
    if (discard?.kind !== "selectEntity") throw new Error("Expected X.Drake's opposing discard.");
    expect(discard.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([discardedId, keptId]),
    );
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(keptId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the On Play cost when the opponent has no cards in hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01XDrake114],
        activeDon: op01XDrake114.cost + 1,
      },
      {},
    );
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op01XDrake114, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const xDrakeId = engine.findCardInZone("south", "character", op01XDrake114);
    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === xDrakeId)).toBe(true);
    expect(view.players.south.activeDon).toBe(1);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore);
    expect(view.players.north.hand).toHaveLength(0);
    expect(view.players.north.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });
});
