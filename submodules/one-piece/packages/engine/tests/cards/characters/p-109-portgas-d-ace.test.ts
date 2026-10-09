import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-109 Portgas.D.Ace", () => {
  test.each(["top", "bottom"])("privately orders three at %s before giving DON", (position) => {
    let e = OnePieceTestEngine.create({
      hand: ["P-109"],
      activeDon: 5,
      deck: ["ST02-002", "ST02-006", "ST02-012", "EB01-005"],
    });
    const original = e.getState().players.south.deck.slice();
    e.asSouth().play("P-109");
    const p = e.pendingDecision("effectRearrangeDeckOrder", "south").steps[0];
    if (p?.kind !== "orderItems") throw Error("Expected private deck order");
    const ids = p.candidates.map((c) => c.ref.id).reverse();
    expect(ids).toEqual(original.slice(0, 3).reverse());
    expect(
      e.getView("north").decisions.some((d) => d.steps.some((s) => s.kind === "orderItems")),
    ).toBe(false);
    e.asSouth().orderCards("effectRearrangeDeckOrder", ids);
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("effectRearrangeDeckPosition", { optionId: position }, "south");
    expect(e.getState().players.south.deck).toEqual(
      position === "top" ? [...ids, original[3]] : [original[3], ...ids],
    );
    e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
    expect(e.getView("south").players.south.leader.attachedDon).toBe(1);
  });
  test("blocks an attack instead of losing Leader Life", () => {
    const e = OnePieceTestEngine.create(
      { character: ["P-109"] },
      { character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const ace = e.findCardInZone("south", "character", "P-109");
    const life = e.getView("south").players.south.lifeCount;
    e.asNorth().attack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"));
    e.resolveDecision("battleBlocker", { selectedIds: [ace] }, "south");
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(ace);
    expect(e.getView("south").players.south.lifeCount).toBe(life);
  });
});
