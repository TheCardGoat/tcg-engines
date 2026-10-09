import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST31-005 Thousand Sunny", () => {
  test.each(["ST01-006", "ST01-014"])(
    "searches five for Straw Hat card %s and orders the rest",
    (card) => {
      let e = OnePieceTestEngine.create({
        hand: ["ST31-005"],
        activeDon: 1,
        deck: ["ST02-002", card, "ST02-006", "ST02-012", "ST02-002", "ST02-006"],
      });
      const chosen = e.findCardInZone("south", "deck", card);
      e.asSouth().play("ST31-005");
      const p = e.pendingDecision("effectSearchSelection", "south").steps[0];
      if (p?.kind !== "selectEntity") throw Error("search");
      expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([chosen]);
      e.asSouth().chooseSearch(chosen);
      const order = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
      if (order?.kind !== "orderItems") throw Error("order");
      const ids = order.candidates.map((c) => c.ref.id).reverse();
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.asSouth().orderCards("effectSearchRemainderOrder", ids);
      expect(e.getState().players.south.deck.slice(-4)).toEqual(ids);
      expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(chosen);
    },
  );
  test("declines search and orders all five", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST31-005"],
      activeDon: 1,
      deck: ["ST01-006", "ST02-002", "ST02-006", "ST02-012", "ST02-002", "ST02-006"],
    });
    e.asSouth().play("ST31-005");
    e.asSouth().chooseNoSearch();
    const p = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (p?.kind !== "orderItems") throw Error("order");
    e.asSouth().orderCards(
      "effectSearchRemainderOrder",
      p.candidates.map((c) => c.ref.id),
    );
    expect(e.getView("south").players.south.handCount).toBe(0);
  });
  test.each(["leader", "character"])("rests Stage and gives rested DON to Luffy %s", (zone) => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST01-001",
      stage: "ST31-005",
      character: ["ST01-012", "ST02-002"],
      restedDon: 1,
      activeDon: 1,
    });
    const stage = e.findCardInZone("south", "stage", "ST31-005"),
      luffy = e.findCardInZone("south", "character", "ST01-012");
    e.asSouth().activateMain(stage);
    e.asSouth().acceptOptional();
    e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("target");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([
      e.leader("south"),
      luffy,
    ]);
    e.asSouth().chooseTargets(zone === "leader" ? e.leader("south") : luffy);
    const v = e.getView("south").players.south;
    expect(v.stage?.rested).toBe(true);
    expect(v.restedDon).toBe(0);
    expect(v.activeDon).toBe(1);
    expect(
      (zone === "leader" ? v.leader : v.characters.find((c) => c?.instanceId === luffy))
        ?.attachedDon,
    ).toBe(1);
  });
  test.each(["decline", "zero"])("can %s while DON and target are available", (mode) => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST01-001",
      stage: "ST31-005",
      restedDon: 1,
    });
    e.asSouth().activateMain(e.findCardInZone("south", "stage", "ST31-005"));
    if (mode === "decline") e.asSouth().declineOptional();
    else {
      e.asSouth().acceptOptional();
      e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    }
    expect(e.getView("south").players.south.restedDon).toBe(1);
    expect(e.getView("south").players.south.stage?.rested).toBe(mode === "zero");
  });
});
