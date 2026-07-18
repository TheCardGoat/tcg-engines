import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op09Lim037, op09PortgasDAce035 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-037 Lim", () => {
  test("searches top five for an included ODYSSEY card other than Lim and bottoms the rest in order", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09Lim037],
      activeDon: op09Lim037.cost,
      deck: [
        op09PortgasDAce035,
        op09Lim037,
        eb01Doma005,
        eb01Fourtricks025,
        eb01Doma005,
        eb01Doma005,
      ],
    });
    const eligibleId = engine.findCardInZone("south", "deck", op09PortgasDAce035);
    const limId = engine.findCardInZone("south", "deck", op09Lim037);

    engine.playCard(op09Lim037, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (search?.kind !== "selectEntity") throw new Error("Expected Lim's search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === limId)?.legal).toBe(false);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Lim's remainder order.");
    const order = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      eligibleId,
    );
    expect(engine.getState().players.south.deck.slice(-4)).toEqual(order);
  });

  test("at end of turn sets itself active only with three rested Characters", () => {
    const enabled = OnePieceTestEngine.create({
      character: [
        { card: op09Lim037, rested: true },
        { card: eb01Doma005, rested: true },
        { card: eb01Fourtricks025, rested: true },
      ],
    });
    const enabledId = enabled.findCardInZone("south", "character", op09Lim037);
    enabled.endTurn("south");
    expect(
      enabled
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === enabledId)?.rested,
    ).toBe(false);

    const disabled = OnePieceTestEngine.create({
      character: [
        { card: op09Lim037, rested: true },
        { card: eb01Doma005, rested: true },
        eb01Fourtricks025,
      ],
    });
    const disabledId = disabled.findCardInZone("south", "character", op09Lim037);
    disabled.endTurn("south");
    expect(
      disabled
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === disabledId)?.rested,
    ).toBe(true);
  });
});
