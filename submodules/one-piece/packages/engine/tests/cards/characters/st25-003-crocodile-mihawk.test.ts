import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST25-003 Crocodile & Mihawk", () => {
  test("OnPlay draws two, trashes one, then plays only cost-four Cross Guild", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST25-003", "ST25-002", "ST22-010"],
      activeDon: 8,
      deck: ["ST01-006", "ST25-003", "ST02-002"],
    });
    const paid = e.findCardInZone("south", "deck", "ST01-006"),
      target = e.findCardInZone("south", "hand", "ST25-002");
    e.asSouth().play("ST25-003");
    expect(e.getView("south").players.south.handCount).toBe(4);
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [paid] }, "south");
    const p = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("play");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([target]);
    e.asSouth().choosePlay(target);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(2);
    expect(e.getView("south").players.south.handCount).toBe(2);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(paid);
  });
  test.each(["ST25-003", "ST25-002"])("opponent removal of %s can discard instead", (id) => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-056"], activeDon: 6 },
      { character: ["ST25-003", "ST25-002"], hand: ["ST01-006"] },
    );
    const target = e.findCardInZone("north", "character", id);
    e.asSouth().play("OP04-056");
    e.asSouth().chooseTargets(target);
    e.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "north");
    expect(e.getView("north").players.north.characters.map((c) => c?.instanceId)).toContain(target);
    expect(e.getView("north").players.north.handCount).toBe(0);
    expect(e.getView("north").players.north.trash.map((c) => c.cardId)).toEqual(["ST01-006"]);
  });
  test("replacement is once per turn with another hand card still available", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-038", "OP04-038"], activeDon: 10 },
      {
        character: ["ST25-003", { cardId: "ST25-002", rested: true }],
        hand: ["ST01-006", "ST02-002"],
      },
    );
    const target = e.findCardInZone("north", "character", "ST25-002"),
      paid = e.findCardInZone("north", "hand", "ST01-006");
    e.asSouth().play("OP04-038");
    e.asSouth().chooseTargets();
    e.asSouth().chooseTargets(target);
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [paid] }, "north");
    e.asSouth().play("OP04-038");
    e.asSouth().chooseTargets();
    e.asSouth().chooseTargets(target);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("north").players.north.handCount).toBe(1);
  });
  test("declines optional replacement", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-056"], activeDon: 6 },
      { character: ["ST25-003"], hand: ["ST01-006"] },
    );
    const target = e.findCardInZone("north", "character", "ST25-003");
    e.asSouth().play("OP04-056");
    e.asSouth().chooseTargets(target);
    e.resolveDecision("effectRemovalReplacement", { optionId: "no" }, "north");
    expect(e.getState().players.north.deck.at(-1)).toBe(target);
    expect(e.getView("north").players.north.handCount).toBe(1);
  });
  test("empty hand cannot replace removal", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-056"], activeDon: 6 },
      { character: ["ST25-003"] },
    );
    const target = e.findCardInZone("north", "character", "ST25-003");
    e.asSouth().play("OP04-056");
    e.asSouth().chooseTargets(target);
    expect(e.getState().players.north.deck.at(-1)).toBe(target);
    expect(e.getView("north").prompts).toHaveLength(0);
  });
  test("own effect cannot use opponent replacement", () => {
    const e = OnePieceTestEngine.create({
      hand: ["OP04-056", "ST01-006"],
      activeDon: 6,
      character: ["ST25-003"],
    });
    const target = e.findCardInZone("south", "character", "ST25-003");
    e.asSouth().play("OP04-056");
    e.asSouth().chooseTargets(target);
    expect(e.getState().players.south.deck.at(-1)).toBe(target);
    expect(e.getView("south").players.south.handCount).toBe(1);
  });
  test("wrong trait Character cannot be protected", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-056"], activeDon: 6 },
      { character: ["ST25-003", "ST22-010"], hand: ["ST01-006"] },
    );
    const target = e.findCardInZone("north", "character", "ST22-010");
    e.asSouth().play("OP04-056");
    e.asSouth().chooseTargets(target);
    expect(e.getState().players.north.deck.at(-1)).toBe(target);
    expect(e.getView("north").players.north.handCount).toBe(1);
  });
  test("declines optional play after draw and discard with eligible card remaining", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST25-003", "ST25-002"],
      activeDon: 8,
      deck: ["ST01-006", "ST02-002", "ST02-012"],
    });
    const paid = e.findCardInZone("south", "deck", "ST01-006"),
      target = e.findCardInZone("south", "hand", "ST25-002");
    e.asSouth().play("ST25-003");
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [paid] }, "south");
    e.asSouth().choosePlay();
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("south").players.south.handCount).toBe(2);
  });
  test("battle KO cannot discard for replacement", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST25-003", rested: true }], hand: ["ST01-006"] },
      { character: [{ cardId: "ST22-003", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const c = e.findCardInZone("south", "character", "ST25-003");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST22-003"), c);
    // No usable Counter remains, so the Counter Step ends automatically.
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(c);
    expect(e.getView("south").players.south.handCount).toBe(1);
  });
});
