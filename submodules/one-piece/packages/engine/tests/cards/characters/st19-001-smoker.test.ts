import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST19-001 Smoker", () => {
  test.each([0, 1, 2])(
    "black Navy payment prevents %s chosen attacks through opponent next turn",
    (count) => {
      const e = OnePieceTestEngine.create(
        {
          hand: ["ST19-001", "ST06-002", "ST06-004", "ST02-006", "ST13-013", "OP06-086"],
          activeDon: 6,
        },
        {
          character: [
            { cardId: "ST02-006", playedOnTurn: 0 },
            { cardId: "ST02-012", playedOnTurn: 0 },
            "ST02-013",
          ],
        },
        { firstPlayer: "north", activeSeat: "south" },
      );
      const paid = e.findCardInZone("south", "hand", "ST06-002");
      const a = e.findCardInZone("north", "character", "ST02-006"),
        b = e.findCardInZone("north", "character", "ST02-012");
      e.asSouth().play("ST19-001");
      e.asSouth().acceptOptional();
      const cost = e.pendingDecision("effectCostTrashFromHand", "south").steps[0];
      if (cost?.kind !== "payCost") throw Error("discard");
      expect(cost.candidates?.map((c) => c.ref.id)).toEqual([
        paid,
        e.findCardInZone("south", "hand", "ST06-004"),
      ]);
      e.resolveDecision("effectCostTrashFromHand", { selectedIds: [paid] }, "south");
      const target = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (target?.kind !== "selectEntity") throw Error("targets");
      expect(target.candidates.filter((c) => c.legal).map((c) => c.ref.id)).not.toContain(
        e.findCardInZone("north", "character", "ST02-013"),
      );
      e.asSouth().chooseTargets(...[a, b].slice(0, count));
      e.asSouth().endTurn();
      for (const id of [a, b].slice(0, count))
        e.expectFailure({
          type: "declareAttack",
          seat: "north",
          attackerId: id,
          targetId: e.leader("south"),
        });
      if (count === 0) {
        e.asNorth().attack(a, e.leader("south"));
        e.asSouth().chooseCounter();
        expect(e.getView("south").players.south.lifeCount).toBe(3);
      }
      e.asNorth().endTurn();
      e.asSouth().endTurn();
      e.asNorth().attack(a, e.leader("south"));
      e.asSouth().chooseCounter();
      expect(e.getView("south").players.south.lifeCount).toBe(count === 0 ? 2 : 3);
    },
  );
  test("declines optional discard and leaves opposing attacks available", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST19-001", "ST06-002"], activeDon: 6 },
      { character: [{ cardId: "ST02-006", playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().play("ST19-001");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.handCount).toBe(1);
    e.asSouth().endTurn();
    e.asNorth().attack(e.findCardInZone("north", "character", "ST02-006"), e.leader("south"));
    e.asSouth().chooseCounter();
    expect(e.getView("south").players.south.lifeCount).toBe(3);
  });
});
