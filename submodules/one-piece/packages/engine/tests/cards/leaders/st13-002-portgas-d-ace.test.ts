import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST13-002 Portgas.D.Ace", () => {
  test("searches only exact-cost-five Characters and trashes all face-up Life including another effect's card", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST13-002",
        activeDon: 2,
        deck: ["ST04-005", "ST11-004", "ST04-004", "ST02-006", "ST02-002", "ST04-012"],
        life: [{ cardId: "ST02-012", faceUp: true, publicKnowledge: true }, "ST02-002"],
      },
      { deck: 10 },
    );
    const top = e.findCardInZone("south", "deck", "ST04-005"),
      prior = e.findCardInZone("south", "life", "ST02-012"),
      hidden = e.findCardInZone("south", "life", "ST02-002");
    e.attachDon(e.leader("south"), 2);
    e.asSouth().activateMain(e.leader("south"));
    const p = e.pendingDecision("effectSearchSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("search");
    expect(p.candidates).toHaveLength(5);
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([top]);
    e.resolveDecision("effectSearchSelection", { selectedIds: [top] }, "south");
    const order = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw Error("order");
    const ids = order.candidates.map((c) => c.ref.id).reverse();
    e.resolveDecision("effectSearchRemainderOrder", { selectedIds: ids }, "south");
    expect(e.getView("north").players.south.life[0]).toMatchObject({
      instanceId: top,
      cardId: "ST04-005",
    });
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.leader("south"),
      trigger: "activateMain",
    });
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toEqual(
      expect.arrayContaining([prior, top]),
    );
    expect(e.getView("south").players.south.life).toHaveLength(1);
    // Hidden-zone identity verifies only the pre-existing face-down Life remains.
    expect(e.getState().players.south.life).toEqual([hidden]);
    expect(e.getState().players.south.deck.slice(-4)).toEqual(ids);
  });
  test("declines the Life card but still orders all five viewed cards at the bottom", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST13-002",
      activeDon: 2,
      deck: ["ST04-005", "ST11-004", "ST04-004", "ST02-006", "ST02-002", "ST04-012"],
      life: 1,
    });
    e.attachDon(e.leader("south"), 2);
    e.asSouth().activateMain(e.leader("south"));
    e.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");
    const p = e.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (p?.kind !== "orderItems") throw Error("order");
    const ids = p.candidates.map((c) => c.ref.id).reverse();
    e.resolveDecision("effectSearchRemainderOrder", { selectedIds: ids }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    expect(e.getState().players.south.deck.slice(-5)).toEqual(ids);
  });
  test("one attached DON does not permit activation", () => {
    const e = OnePieceTestEngine.create({ leaderCardId: "ST13-002", activeDon: 1, deck: 8 });
    e.attachDon(e.leader("south"), 1);
    e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.leader("south"),
      trigger: "activateMain",
    });
    expect(e.getView("south").players.south.deckCount).toBe(8);
  });
});
