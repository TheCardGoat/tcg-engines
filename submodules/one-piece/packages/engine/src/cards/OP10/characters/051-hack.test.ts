import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op10Hack051 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-051 Hack", () => {
  test("with one DON!! attached, searches an included Revolutionary Army Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op10Hack051, playedOnTurn: 0 }],
        deck: [op10Hack051, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const hackId = engine.findCardInZone("south", "character", op10Hack051);
    const searchedId = engine.findCardInZone("south", "deck", op10Hack051);

    engine.attachDon(hackId, 1, "south");
    engine.declareAttack(hackId, engine.leader("north"), "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Hack's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === searchedId)?.legal).toBe(
      true,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [searchedId] }, "south");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Hack's remainder order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      searchedId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
