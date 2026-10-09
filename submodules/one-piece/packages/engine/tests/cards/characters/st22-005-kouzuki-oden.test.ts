import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST22-005 Oden", () => {
  test("rests three DON and returns another Character to ready once", () => {
    let e = OnePieceTestEngine.create({
      character: [{ cardId: "ST22-005", rested: true }, "ST02-002", "OP10-082"],
      activeDon: 6,
    });
    const o = e.findCardInZone("south", "character", "ST22-005"),
      k = e.findCardInZone("south", "character", "OP10-082");
    e.asSouth().activateMain(o);
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectCostReturnCharacter", "south").steps[0];
    if (p?.kind !== "payCost") throw Error("return cost");
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(o);
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("effectCostReturnCharacter", { selectedIds: [k] }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(3);
    expect(e.getView("south").players.south.restedDon).toBe(3);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(k);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: o,
      trigger: "activateMain",
    });
  });
  test.each([1, 2])("insufficient %s DON cannot pay either cost", (don) => {
    const e = OnePieceTestEngine.create({
      character: [{ cardId: "ST22-005", rested: true }, "ST02-002"],
      activeDon: don,
    });
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.findCardInZone("south", "character", "ST22-005"),
      trigger: "activateMain",
    });
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(e.getView("south").players.south.activeDon).toBe(don);
    expect(e.getView("south").players.south.handCount).toBe(0);
  });
  test("self alone cannot pay the other-Character return", () => {
    const e = OnePieceTestEngine.create({
      character: [{ cardId: "ST22-005", rested: true }],
      activeDon: 3,
    });
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.findCardInZone("south", "character", "ST22-005"),
      trigger: "activateMain",
    });
    expect(e.getView("south").players.south.activeDon).toBe(3);
  });
  test("declines optional activation payment", () => {
    const e = OnePieceTestEngine.create({
      character: [{ cardId: "ST22-005", rested: true }, "ST02-002"],
      activeDon: 3,
    });
    e.asSouth().activateMain(e.findCardInZone("south", "character", "ST22-005"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(e.getView("south").players.south.activeDon).toBe(3);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(2);
  });
  test("opponent bottom-deck removal replacement discards exact two after snapshot", () => {
    let e = OnePieceTestEngine.create(
      { hand: ["OP04-056"], activeDon: 6 },
      { character: ["ST22-005"], hand: ["ST02-002", "ST02-006", "ST02-012"] },
    );
    const o = e.findCardInZone("north", "character", "ST22-005"),
      a = e.findCardInZone("north", "hand", "ST02-002"),
      b = e.findCardInZone("north", "hand", "ST02-012");
    e.asSouth().play("OP04-056");
    e.asSouth().chooseTargets(o);
    e.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "north");
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [b, a] }, "north");
    expect(e.getView("north").players.north.characters[0]?.instanceId).toBe(o);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toEqual([b, a]);
    expect(e.getView("north").players.north.hand.map((c) => c.cardId)).toEqual(["ST02-006"]);
  });
  test("declines optional removal replacement", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-056"], activeDon: 6 },
      { character: ["ST22-005"], hand: 2 },
    );
    const o = e.findCardInZone("north", "character", "ST22-005");
    e.asSouth().play("OP04-056");
    e.asSouth().chooseTargets(o);
    e.resolveDecision("effectRemovalReplacement", { optionId: "no" }, "north");
    expect(e.getState().players.north.deck.at(-1)).toBe(o);
    expect(e.getView("north").players.north.handCount).toBe(2);
  });
  test("one hand card cannot replace removal", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-056"], activeDon: 6 },
      { character: ["ST22-005"], hand: 1 },
    );
    const o = e.findCardInZone("north", "character", "ST22-005");
    e.asSouth().play("OP04-056");
    e.asSouth().chooseTargets(o);
    expect(e.getState().players.north.deck.at(-1)).toBe(o);
    expect(e.getView("north").players.north.handCount).toBe(1);
  });
  test("own effect removal does not offer replacement", () => {
    const e = OnePieceTestEngine.create({
      hand: ["OP04-056", "ST02-002", "ST02-012"],
      activeDon: 6,
      character: ["ST22-005"],
    });
    const o = e.findCardInZone("south", "character", "ST22-005");
    e.asSouth().play("OP04-056");
    e.asSouth().chooseTargets(o);
    expect(e.getState().players.south.deck.at(-1)).toBe(o);
    expect(e.getView("south").players.south.handCount).toBe(2);
  });
  test("battle KO does not offer effect-removal replacement", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST22-005", rested: true }], hand: ["ST01-006", "ST01-006"] },
      { character: [{ cardId: "ST22-003", playedOnTurn: 0 }] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    const o = e.findCardInZone("south", "character", "ST22-005");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST22-003"), o);
    // No usable Counter remains, so the Counter Step ends automatically.
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(o);
    expect(e.getView("south").players.south.handCount).toBe(2);
  });
  test("opponent effect KO is also replaced by two-card discard", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP04-038", "OP02-117"], activeDon: 6 },
      { character: [{ cardId: "ST22-005", rested: true }], hand: ["ST01-006", "ST01-006"] },
    );
    const o = e.findCardInZone("north", "character", "ST22-005");
    e.asSouth().play("OP02-117");
    e.asSouth().chooseTargets(o);
    e.asSouth().play("OP04-038");
    e.asSouth().chooseTargets();
    e.asSouth().chooseTargets(o);
    e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
    expect(e.getView("north").players.north.characters[0]?.instanceId).toBe(o);
    expect(e.getView("north").players.north.handCount).toBe(0);
    expect(e.getView("north").players.north.trash.map((c) => c.cardId)).toEqual([
      "ST01-006",
      "ST01-006",
    ]);
  });
});
