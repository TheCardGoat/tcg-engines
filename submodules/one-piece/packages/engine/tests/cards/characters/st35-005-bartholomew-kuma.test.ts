import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST35-005", () => {
  test.each(["hand", "trash"] as const)(
    "plays eligible physical card from %s after giving DON only to Leader",
    (zone) => {
      const e = OnePieceTestEngine.create(
        {
          hand: [
            "ST35-005",
            "ST21-005",
            "ST35-004",
            "ST21-016",
            ...(zone === "hand" ? ["ST35-002"] : []),
          ],
          trash: zone === "trash" ? ["ST35-002"] : [],
          activeDon: 5,
        },
        {},
      );
      const selected = e.findCardInZone("south", zone, "ST35-002");
      e.playCard("ST35-005");
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
      { hand: ["ST35-005"], trash: ["ST35-002"], activeDon: 5 },
      {},
    );
    e.playCard("ST35-005");
    e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    e.asSouth().choosePlay(e.findCardInZone("south", "trash", "ST35-002"));
    expect(e.getView("south").players.south.characters[1]?.cardId).toBe("ST35-002");
    expect(e.getView("south").players.south.restedDon).toBe(5);
  });
  test("declines optional mixed-source play after DON grant", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST35-005", "ST35-002"], activeDon: 5 }, {});
    e.playCard("ST35-005");
    e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    e.asSouth().chooseNoPlay();
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.leader.attachedDon).toBe(1);
  });
});
