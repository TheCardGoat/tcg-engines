import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-081 Gerd", () => {
  test("a non-Elbaph Leader leaves cost two, and payable recovery may be declined", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST06-001",
        hand: ["OP17-081", "ST06-004"],
        trash: ["ST06-008"],
        activeDon: 2,
      },
      {},
    );
    const retained = e.findCardInZone("south", "hand", "ST06-004");
    const recovery = e.findCardInZone("south", "trash", "ST06-008");
    e.asSouth().play("OP17-081");
    e.pendingDecision("effectOptional", "south");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const view = e.getView("south");
    expect(view.players.south.characters[0]?.cost).toBe(2);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([retained]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual([recovery]);
    expect(view.players.south.activeDon).toBe(0);
    expect(view.players.south.restedDon).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });

  test("the paid hand card becomes a recovery candidate, excluding Gerd and cost-nine Characters", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP17-079",
        hand: ["OP17-081", "ST06-004"],
        trash: ["OP17-081", "OP17-064"],
        activeDon: 2,
      },
      {},
    );
    const paid = e.findCardInZone("south", "hand", "ST06-004");
    e.asSouth().play("OP17-081");
    e.asSouth().acceptOptional();
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step.kind !== "selectEntity") throw new Error("Expected recovery");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([paid]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [paid] }, "south");
    expect(e.getView("south").players.south.hand[0]?.instanceId).toBe(paid);
    expect(e.getView("south").players.south.characters[0]?.cost).toBe(14);
  });
});
