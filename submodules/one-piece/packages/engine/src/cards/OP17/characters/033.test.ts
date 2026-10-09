import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";
describe("OP17-033 Lucky.Roux", () => {
  test.each([true, false])(
    "search includes Allies, reveals selection and preserves chosen bottom order; select=%s",
    (select) => {
      let e = OnePieceTestEngine.create({
        hand: ["OP17-033"],
        deck: ["OP17-026", "OP17-002", "OP17-027", "OP17-006"],
        activeDon: 4,
      });
      const ally = e.findCardInZone("south", "deck", "OP17-026"),
        wrong = e.findCardInZone("south", "deck", "OP17-002"),
        benn = e.findCardInZone("south", "deck", "OP17-027"),
        unlooked = e.findCardInZone("south", "deck", "OP17-006");
      e.playCard("OP17-033");
      const step = e.pendingDecision("effectSearchSelection", "south").steps[0];
      if (step?.kind !== "selectEntity") throw new Error("Expected search selection");
      expect(step.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([ally, benn]);
      expect(step.candidates.map((c) => c.ref.id)).not.toContain(unlooked);
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.resolveDecision("effectSearchSelection", { selectedIds: select ? [ally] : [] }, "south");
      const order = select ? [benn, wrong] : [benn, wrong, ally];
      e.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");
      expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual(
        select ? [ally] : [],
      );
      // Physical order is intentionally checked through the saved state; deck faces are private.
      expect(e.getState().players.south.deck).toEqual([unlooked, ...order]);
      expect(e.getView("north").logs.some((l) => l.message.includes("reveals Fugar"))).toBe(select);
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
  test.each(["leader", "character"])(
    "opponent attack pays self-trash and rests opposing %s",
    (targetKind) => {
      const e = OnePieceTestEngine.create(
        { character: ["OP17-033"], life: 3 },
        { character: [{ cardId: "OP17-006", playedOnTurn: 0 }, "OP17-002"] },
        { activeSeat: "north" },
      );
      const roux = e.findCardInZone("south", "character", "OP17-033"),
        attacker = e.findCardInZone("north", "character", "OP17-006");
      const target =
        targetKind === "leader"
          ? e.leader("north")
          : e.findCardInZone("north", "character", "OP17-002");
      e.declareAttack(attacker, e.leader("south"), "north");
      e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
      expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toEqual([roux]);
      e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
      expect(
        targetKind === "leader"
          ? e.getView("south").players.north.leader?.rested
          : e.getView("south").players.north.characters.find((c) => c?.instanceId === target)
              ?.rested,
      ).toBe(true);
      expect(e.getView("south").players.south.lifeCount).toBe(2);
    },
  );
  test("declines optional self-trash cost and leaves active opposing Leader unchanged", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP17-033"], life: 3 },
      { character: [{ cardId: "OP17-006", playedOnTurn: 0 }] },
      { activeSeat: "north" },
    );
    const roux = e.findCardInZone("south", "character", "OP17-033");
    e.declareAttack(e.findCardInZone("north", "character", "OP17-006"), e.leader("south"), "north");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(roux);
    expect(e.getView("south").players.south.trash).toHaveLength(0);
    expect(e.getView("south").players.north.leader?.rested).toBe(false);
  });
});
