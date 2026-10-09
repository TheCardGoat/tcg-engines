import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST33-003 Smoker", () => {
  test.each([0, 1, 2])(
    "paid discard bottoms %s opposing low-cost Characters, owner orders",
    (count) => {
      let e = OnePieceTestEngine.create(
        { hand: ["ST33-003", "ST02-002"], activeDon: 2 },
        { character: ["ST01-006", "ST33-001", "ST29-002"] },
      );
      const a = e.findCardInZone("north", "character", "ST01-006"),
        b = e.findCardInZone("north", "character", "ST33-001"),
        high = e.findCardInZone("north", "character", "ST29-002");
      e.asSouth().play("ST33-003");
      e.asSouth().acceptOptional();
      const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (p?.kind !== "selectEntity") throw Error("target");
      expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([a, b]);
      e.asSouth().chooseTargets(...[a, b].slice(0, count));
      if (count === 2) {
        e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
        e.asNorth().orderCards("effectReturnToDeckOwnerOrder", [b, a]);
        expect(e.getState().players.north.deck.slice(-2)).toEqual([b, a]);
      }
      if (count === 1) expect(e.getState().players.north.deck.at(-1)).toBe(a);
      expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(3 - count);
      expect(e.getView("north").players.north.characters.map((c) => c?.instanceId)).toContain(high);
      expect(e.getView("south").players.south.handCount).toBe(0);
    },
  );
  test("declines optional discard", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST33-003", "ST02-002"], activeDon: 2 },
      { character: ["ST01-006"] },
    );
    e.asSouth().play("ST33-003");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(1);
  });
});
