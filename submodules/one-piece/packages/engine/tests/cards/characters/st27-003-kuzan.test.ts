import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st27-003-kuzan", () => {
  test("Blocker intercepts then KO plays a qualifying trash Character rested", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST27-003"], trash: ["OP09-083", "ST27-005", "ST21-005"] },
      { character: [{ cardId: "ST15-002", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST15-002"), e.leader("south"));
    e.asSouth().chooseBlocker(e.findCardInZone("south", "character", "ST27-003"));
    const p = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("play");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([
      e.findCardInZone("south", "trash", "OP09-083"),
    ]);
    e.asSouth().choosePlay(e.findCardInZone("south", "trash", "OP09-083"));
    expect(e.getView("south").players.south.characters[0]?.cardId).toBe("OP09-083");
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(e.getView("south").players.south.lifeCount).toBe(4);
  });
  test("declines optional OnKO play with eligible trash card", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST27-003", rested: true }], trash: ["OP09-083"] },
      { character: [{ cardId: "ST15-002", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(
      e.findCardInZone("north", "character", "ST15-002"),
      e.findCardInZone("south", "character", "ST27-003"),
    );
    e.asSouth().chooseNoPlay();
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(e.getView("south").players.south.trash).toHaveLength(2);
  });
  test("declines optional Blocker and keeps Kuzan active", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST27-003"] },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker();
    expect(e.getView("south").players.south.lifeCount).toBe(3);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
  });
});
