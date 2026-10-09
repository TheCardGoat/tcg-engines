import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST29-014 Zoro", () => {
  test("Rush Character permits real same-turn Character attack but not Leader", () => {
    let e = OnePieceTestEngine.create(
      { hand: ["ST29-014"], activeDon: 6 },
      { character: [{ cardId: "ST29-010", rested: true }] },
      { activeSeat: "south", firstPlayer: "north" },
    );
    e.asSouth().play("ST29-014");
    const source = e.findCardInZone("south", "character", "ST29-014"),
      target = e.findCardInZone("north", "character", "ST29-010");
    const f = e.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: source,
      targetId: e.leader("north"),
    });
    e = OnePieceTestEngine.fromState(f.state);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    e.asSouth().attack(source, target);
    expect(e.getView("south").players.north.trash.map((c) => c.instanceId)).toContain(target);
  });
  test.each(["leader", "character"])(
    "discards only Trigger card, draws and gives DON to %s; payable OPT retry fails",
    (kind) => {
      let e = OnePieceTestEngine.create({
        character: ["ST29-014"],
        hand: ["OP01-087", "ST29-005", "ST29-006"],
        deck: ["ST02-002", "ST02-006"],
        restedDon: 2,
      });
      const source = e.findCardInZone("south", "character", "ST29-014"),
        paid = e.findCardInZone("south", "hand", "OP01-087"),
        wrong = e.findCardInZone("south", "hand", "ST29-006");
      e.asSouth().activateMain(source);
      e.asSouth().acceptOptional();
      const p = e.pendingDecision("effectCostTrashFromHand", "south").steps[0];
      if (p?.kind !== "payCost") throw Error("cost");
      expect(p.candidates.map((c) => c.ref.id)).not.toContain(wrong);
      e.resolveDecision("effectCostTrashFromHand", { selectedIds: [paid] }, "south");
      expect(e.getView("south").players.south.handCount).toBe(3);
      e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.asSouth().chooseTargets(kind === "leader" ? e.leader("south") : source);
      expect(
        kind === "leader"
          ? e.getView("south").players.south.leader.attachedDon
          : e.getView("south").players.south.characters[0]?.attachedDon,
      ).toBe(1);
      expect(e.getView("south").players.south.restedDon).toBe(1);
      const failed = e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: source,
        trigger: "activateMain",
      });
      expect(
        OnePieceTestEngine.fromState(failed.state).getView("south").players.south.handCount,
      ).toBe(3);
    },
  );
  test("declines optional Trigger discard with payment available", () => {
    const e = OnePieceTestEngine.create({
      character: ["ST29-014"],
      hand: ["ST29-013"],
      restedDon: 1,
      deck: 10,
    });
    e.asSouth().activateMain(e.findCardInZone("south", "character", "ST29-014"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.deckCount).toBe(10);
    expect(e.getView("south").players.south.restedDon).toBe(1);
  });
  test("zero DON choice still draws after paid cost", () => {
    const e = OnePieceTestEngine.create({
      character: ["ST29-014"],
      hand: ["ST29-013"],
      restedDon: 1,
      deck: 10,
    });
    e.asSouth().activateMain(e.findCardInZone("south", "character", "ST29-014"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.deckCount).toBe(9);
    expect(e.getView("south").players.south.restedDon).toBe(1);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("ST29-013");
  });
});
