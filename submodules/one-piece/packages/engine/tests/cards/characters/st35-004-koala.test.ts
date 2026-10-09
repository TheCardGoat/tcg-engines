import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST35-004", () => {
  test.each(["hand", "trash"] as const)(
    "plays eligible physical card from %s after giving DON only to Leader",
    (zone) => {
      const e = OnePieceTestEngine.create(
        {
          hand: [
            "ST35-004",
            "ST21-005",
            "ST35-004",
            "ST21-016",
            ...(zone === "hand" ? ["ST35-002"] : []),
          ],
          trash: zone === "trash" ? ["ST35-002"] : [],
          activeDon: 7,
        },
        {},
      );
      const selected = e.findCardInZone("south", zone, "ST35-002");
      e.playCard("ST35-004");
      expect(e.getView("south").players.south.characters[0]?.cost).toBe(8);
      e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
      const p = e.pendingDecision("effectPlaySelection", "south").steps[0];
      if (p?.kind !== "selectEntity") throw Error("play");
      expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([selected]);
      e.asSouth().choosePlay(selected);
      expect(e.getView("south").players.south.leader.attachedDon).toBe(1);
      expect(e.getView("south").players.south.characters[1]?.instanceId).toBe(selected);
    },
  );
  test("declines optional DON but still plays from trash", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST35-004"], trash: ["ST35-002"], activeDon: 7 },
      {},
    );
    e.playCard("ST35-004");
    e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    e.asSouth().choosePlay(e.findCardInZone("south", "trash", "ST35-002"));
    expect(e.getView("south").players.south.characters[1]?.cardId).toBe("ST35-002");
    expect(e.getView("south").players.south.restedDon).toBe(7);
  });
  test("declines optional mixed-source play after DON grant", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST35-004", "ST35-002"], activeDon: 7 }, {});
    e.playCard("ST35-004");
    e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    e.asSouth().chooseNoPlay();
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.leader.attachedDon).toBe(1);
  });
  test("permanent Blocker intercepts an actual attack", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST35-004"] },
      { character: [{ cardId: "ST15-002", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST15-002"), e.leader("south"));
    e.asSouth().chooseBlocker(e.findCardInZone("south", "character", "ST35-004"));
    expect(e.getView("south").players.south.lifeCount).toBe(4);
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST35-004");
  });
});
