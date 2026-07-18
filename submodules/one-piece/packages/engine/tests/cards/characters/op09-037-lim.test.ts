import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op09Lim037,
  op09PortgasDAce035,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-037 Lim", () => {
  test("finds an included ODYSSEY card other than Lim and orders the remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09Lim037],
      deck: [
        op09PortgasDAce035,
        op09Lim037,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: op09Lim037.cost,
    });
    const odysseyId = engine.findCardInZone("south", "deck", op09PortgasDAce035);
    const limId = engine.findCardInZone("south", "deck", op09Lim037);
    const wrongTraitId = engine.findCardInZone("south", "deck", eb01Doma005);
    const untouchedId = engine.getState().players.south.deck[5]!;

    engine.playCard(op09Lim037, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (search?.kind !== "selectEntity") throw new Error("Expected Lim's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === odysseyId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === limId)?.legal).toBe(false);
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongTraitId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [odysseyId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Lim's remainder order.");
    const order = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(odysseyId);
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...order]);
    expect(view.prompts).toHaveLength(0);
  });

  test("at end of turn becomes active with three rested Characters including itself", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op09Lim037, rested: true },
          { card: eb01Doma005, rested: true },
          { card: eb01Fourtricks025, rested: true },
        ],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const limId = engine.findCardInZone("south", "character", op09Lim037);

    engine.endTurn("south");

    const view = engine.getView("north");
    expect(view.players.south.characters.find((card) => card?.instanceId === limId)?.rested).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
