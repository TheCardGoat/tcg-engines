import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op10Hack051,
  op13ButAceHereSaidYouDeservedIt019,
  op13Koala081,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-051 Hack", () => {
  test("with attached DON!! finds a compound-type Revolutionary Army Character and bottoms the rest", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op10Hack051, attachedDon: 1, playedOnTurn: 0 }],
        deck: [op13Koala081, op13ButAceHereSaidYouDeservedIt019, eb01Doma005, eb01Fourtricks025],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const hackId = engine.findCardInZone("south", "character", op10Hack051);
    const eligibleId = engine.findCardInZone("south", "deck", op13Koala081);
    const wrongCategoryId = engine.findCardInZone(
      "south",
      "deck",
      op13ButAceHereSaidYouDeservedIt019,
    );
    const unrelatedId = engine.findCardInZone("south", "deck", eb01Doma005);
    const untouchedId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.declareAttack(hackId, engine.leader("north"), "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Hack's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongCategoryId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === unrelatedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Hack's remainder order.");
    const order = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...order]);
    expect(view.prompts).toHaveLength(0);
  });
});
