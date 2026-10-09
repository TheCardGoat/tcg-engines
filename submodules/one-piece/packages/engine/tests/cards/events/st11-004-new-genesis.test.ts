import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST11-004 New Genesis", () => {
  test("privately looks at three, reveals a FILM card other than itself, orders the rest, then readies DON", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST11-001",
        hand: ["ST11-004"],
        activeDon: 1,
        deck: ["ST11-004", "ST04-012", "ST05-002", "ST05-009", "ST02-002"],
      },
      { deck: 20 },
    );
    const selected = e.findCardInZone("south", "deck", "ST05-002"),
      outside = e.findCardInZone("south", "deck", "ST05-009");
    e.asSouth().play("ST11-004");
    const p = e.pendingDecision("effectSearchSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("search");
    expect(p.candidates).toHaveLength(3);
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([selected]);
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(outside);
    const lookedIds = p.candidates.map((c) => c.ref.id);
    expect(
      e
        .getView("north")
        .logs.some(
          (l) => l.message.includes("reveals ") && l.targetIds.some((id) => lookedIds.includes(id)),
        ),
    ).toBe(false);
    e.resolveDecision("effectSearchSelection", { selectedIds: [selected] }, "south");
    const order = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw Error("order");
    const ids = order.candidates.map((c) => c.ref.id).reverse();
    e.resolveDecision("effectSearchRemainderOrder", { selectedIds: ids }, "south");
    e.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([selected]);
    expect(
      e
        .getView("north")
        .logs.some((l) => l.message.includes("reveals Ain") && l.targetIds.includes(selected)),
    ).toBe(true);
    expect(
      e
        .getView("north")
        .logs.some(
          (l) =>
            l.message.includes("reveals ") &&
            l.targetIds.some((id) => lookedIds.includes(id) && id !== selected),
        ),
    ).toBe(false);
    const fifth = e.findCardInZone("south", "deck", "ST02-002");
    for (const expected of [outside, fifth, ids[0]]) {
      const before = e.getView("south").players.south.hand.map((c) => c.instanceId);
      e.asSouth().endTurn();
      e.asNorth().endTurn();
      expect(
        e
          .getView("south")
          .players.south.hand.filter((c) => !before.includes(c.instanceId))
          .map((c) => c.instanceId),
      ).toEqual([expected]);
    }
    expect(e.getView("south").players.south.deckCount).toBe(1);
  });
  test("declining the FILM card still allows the DON to become active", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST11-001",
      hand: ["ST11-004"],
      activeDon: 1,
      deck: ["ST05-002", "ST11-004", "ST04-012", "ST05-009"],
    });
    e.asSouth().play("ST11-004");
    e.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const p = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (p?.kind !== "orderItems") throw Error("order");
    e.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: p.candidates.map((c) => c.ref.id) },
      "south",
    );
    e.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("south").players.south.activeDon).toBe(1);
    expect(e.getView("south").players.south.deckCount).toBe(4);
  });
  test("another Leader neither searches nor readies the spent DON", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST11-004"],
      activeDon: 1,
      deck: ["ST05-002", "ST11-004", "ST04-012", "ST05-009"],
    });
    e.asSouth().play("ST11-004");
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.south.handCount).toBe(0);
  });
});
