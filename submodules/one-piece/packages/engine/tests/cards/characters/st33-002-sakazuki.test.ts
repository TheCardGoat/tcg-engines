import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST33-002 Sakazuki", () => {
  test.each([5, 6])(
    "pays hand cost before opposing hand %s gate and opponent chooses discard",
    (count) => {
      const e = OnePieceTestEngine.create(
        { character: ["ST33-002"], hand: ["ST02-002"] },
        { hand: Array(count).fill("ST02-006") },
      );
      const target = e.getView("north").players.north.hand[0]!.instanceId!;
      e.asSouth().attack(e.findCardInZone("south", "character", "ST33-002"), e.leader("north"));
      e.asSouth().acceptOptional();
      expect(e.getView("south").players.south.handCount).toBe(0);
      if (count === 6)
        e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [target] }, "north");
      expect(e.getView("north").players.north.handCount).toBe(5);
      if (count === 6)
        expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(target);
    },
  );
  test("declines optional attack discard", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST33-002"], hand: ["ST02-002"] },
      { hand: Array.from({ length: 6 }, () => "EB01-005") },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST33-002"), e.leader("north"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("north").players.north.handCount).toBe(6);
  });
  test("On KO plays only cost<=4 Navy Character", () => {
    const e = OnePieceTestEngine.create(
      {},
      {
        character: [{ cardId: "ST33-002", rested: true }],
        hand: ["ST03-007", "ST33-005", "ST02-002", "ST06-016"],
      },
    );
    const source = e.findCardInZone("north", "character", "ST33-002"),
      target = e.findCardInZone("north", "hand", "ST03-007");
    e.asSouth().attack(e.leader("south"), source);
    e.asNorth().chooseCounter();
    const p = e.pendingDecision("effectPlaySelection", "north").steps[0];
    if (p?.kind !== "selectEntity") throw Error("play");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([target]);
    e.asNorth().choosePlay(target);
    expect(e.getView("north").players.north.characters.map((c) => c?.instanceId)).toContain(target);
  });
  test("declines optional OnKO play with eligible card", () => {
    const e = OnePieceTestEngine.create(
      {},
      { character: [{ cardId: "ST33-002", rested: true }], hand: ["ST03-007"] },
    );
    e.asSouth().attack(e.leader("south"), e.findCardInZone("north", "character", "ST33-002"));
    e.asNorth().chooseCounter();
    e.asNorth().chooseNoPlay();
    expect(e.getView("north").players.north.handCount).toBe(1);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(0);
  });
});
