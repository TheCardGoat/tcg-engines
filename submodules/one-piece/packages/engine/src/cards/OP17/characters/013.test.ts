import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";
describe("OP17-013 Portgas.D.Ace", () => {
  test("10000 opposing power discounts hand cost and Newgate gates the rested-Character debuff", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP17-001", hand: ["OP17-013"], activeDon: 4 },
      { character: [{ cardId: "OP17-047", rested: true }, "OP17-006"] },
    );
    const target = e.findCardInZone("north", "character", "OP17-047");
    e.playCard("OP17-013");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw new Error("Expected rested targets");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === target)?.power,
    ).toBe(4000);
    e.endTurn("south");
    expect(
      e.getView("south").players.north.characters.find((c) => c?.instanceId === target)?.power,
    ).toBe(10000);
  });
  test("9000 opposing power cannot enable the four-DON play", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-013"], activeDon: 4 },
      { character: ["OP17-027"] },
    );
    const failed = e.expectFailure({
      type: "playCard",
      seat: "south",
      instanceId: e.findCardInZone("south", "hand", "OP17-013"),
    });
    const v = OnePieceTestEngine.fromState(failed.state).getView("south");
    expect(v.players.south.activeDon).toBe(4);
    expect(v.players.south.hand.map((c) => c.cardId)).toEqual(["OP17-013"]);
  });
  test("wrong Leader still gets the hand discount but not the debuff", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP01-001", hand: ["OP17-013"], activeDon: 4 },
      { character: [{ cardId: "OP17-047", rested: true }] },
    );
    e.playCard("OP17-013");
    expect(e.getView("south").players.north.characters[0]?.power).toBe(10000);
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
