import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-044 Captain John", () => {
  test.each(["OP17-044", "OP01-051"])(
    "two active attack constraints permit either named Character: %s",
    (targetCard) => {
      // OP01-051 has the same named attack constraint as the FAQ's P-067,
      // plus a DON!! condition. P-067 is not currently in the catalog.
      const e = OnePieceTestEngine.create(
        {
          leaderCardId: "OP17-039",
          character: [
            { cardId: "OP17-044", rested: true },
            { cardId: "OP01-051", rested: true, attachedDon: 1 },
            { cardId: "EB01-005", rested: true },
          ],
        },
        {},
        { activeSeat: "north" },
      );
      const ordinary = e.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId: e.leader("north"),
        targetId: e.findCardInZone("south", "character", "EB01-005"),
      });
      expect(
        OnePieceTestEngine.fromState(ordinary.state).getView("south").players.north.leader?.rested,
      ).toBe(false);
      const failed = e.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId: e.leader("north"),
        targetId: e.leader("south"),
      });
      const resumed = OnePieceTestEngine.fromState(failed.state);
      expect(resumed.getView("south").players.south.lifeCount).toBe(5);
      resumed.declareAttack(
        resumed.leader("north"),
        resumed.findCardInZone("south", "character", targetCard),
        "north",
      );
      expect(resumed.getView("south").players.north.leader?.rested).toBe(true);
      expect(resumed.getView("south").players.south.lifeCount).toBe(5);
      expect(resumed.getView("south").prompts).toHaveLength(0);
    },
  );
  test("pays its rest cost, draws then discards, and prevents an attack on its Leader", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP17-039",
      character: ["OP17-044"],
      hand: ["EB01-005"],
      deck: ["OP17-002", "OP17-006"],
    });
    const john = e.findCardInZone("south", "character", "OP17-044"),
      doma = e.findCardInZone("south", "hand", "EB01-005");
    e.activateEffect(john, "activateMain", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [doma] }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["OP17-002"]);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toEqual([doma]);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === john)?.rested,
    ).toBe(true);
    e.endTurn("south");
    const failed = e.expectFailure({
      type: "declareAttack",
      seat: "north",
      attackerId: e.leader("north"),
      targetId: e.leader("south"),
    });
    expect(
      OnePieceTestEngine.fromState(failed.state).getView("south").players.south.lifeCount,
    ).toBe(5);
  });
  test("declines optional rest cost with a card available to draw", () => {
    const e = OnePieceTestEngine.create({
      character: ["OP17-044"],
      hand: ["EB01-005"],
      deck: ["OP17-002"],
    });
    const john = e.findCardInZone("south", "character", "OP17-044");
    e.activateEffect(john, "activateMain", "south");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === john)?.rested,
    ).toBe(false);
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["EB01-005"]);
    expect(e.getView("south").players.south.deckCount).toBe(1);
    expect(e.getView("south").players.south.trash).toHaveLength(0);
  });
});
