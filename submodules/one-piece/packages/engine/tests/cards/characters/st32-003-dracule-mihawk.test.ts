import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST32-003 Dracule Mihawk", () => {
  test.each(["OP06-093", "ST01-011"])("plays cost-five-or-less Perona or Slash %s", (card) => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP01-002",
      hand: ["ST32-003", card, "ST32-003", "ST02-002"],
      activeDon: 6,
    });
    const chosen = e.findCardInZone("south", "hand", card);
    e.asSouth().play("ST32-003");
    const p = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("play");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([chosen]);
    e.asSouth().choosePlay(chosen);
    // Brook may give rested DON after entering; decline that nested optional amount.
    if (card === "ST01-011") e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(chosen);
  });
  test("wrong Leader does not play even an eligible Perona", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST01-001",
      hand: ["ST32-003", "OP06-093"],
      activeDon: 6,
    });
    e.asSouth().play("ST32-003");
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("declines an eligible On Play card", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP01-002",
      hand: ["ST32-003", "OP06-093"],
      activeDon: 6,
    });
    e.asSouth().play("ST32-003");
    e.asSouth().chooseNoPlay();
    expect(e.getView("south").players.south.handCount).toBe(1);
  });
  test("resting to attack during own turn draws and discards", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST32-003"], deck: ["ST02-002", "ST02-006"] },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const drawn = e.findCardInZone("south", "deck", "ST02-002");
    e.asSouth().attack(e.findCardInZone("south", "character", "ST32-003"), e.leader("north"));
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(drawn);
    expect(e.getView("south").players.south.deckCount).toBe(1);
  });
  test("opponent effect rest does not draw", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST32-003"] },
      { hand: ["OP01-117"], activeDon: 2 },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().play("OP01-117");
    e.asNorth().acceptOptional();
    e.asNorth().chooseTargets(e.findCardInZone("south", "character", "ST32-003"));
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
  });
  test("resting as an effect cost during own turn also draws and discards", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "OP14-020",
      character: ["ST32-003"],
      restedDon: 3,
      deck: ["ST02-002", "ST02-006"],
    });
    const mihawk = e.findCardInZone("south", "character", "ST32-003"),
      drawn = e.findCardInZone("south", "deck", "ST02-002");
    e.asSouth().activateMain(e.leader("south"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostRestCards", { selectedIds: [mihawk] }, "south");
    e.resolveDecision("effectSetActiveDon", { optionId: "3" }, "south");
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(drawn);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
  });
});
