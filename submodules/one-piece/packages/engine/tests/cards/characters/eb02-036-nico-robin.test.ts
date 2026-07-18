import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb02Nami017,
  eb02NicoRobin036,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-036 Nico Robin", () => {
  test("blocks, then optionally returns DON!! to search a compound Straw Hat card on K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [eb02NicoRobin036],
        deck: [eb02Nami017, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: 1,
        restedDon: 1,
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const robinId = engine.findCardInZone("south", "character", eb02NicoRobin036);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const namiId = engine.findCardInZone("south", "deck", eb02Nami017);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Robin's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", robinId]);
    engine.resolveDecision("battleBlocker", { selectedIds: [robinId] }, "south");

    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Robin's DON!! payment choice.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining(["active-don:0", "rested-don:0"]),
    );
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Robin's top-three search.");
    expect(search.candidates.find((candidate) => candidate.ref.id === namiId)?.legal).toBe(true);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [namiId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Robin's deck-bottom order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(robinId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(namiId);
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
