import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01TonyTonyChopper006,
  eb02Nami017,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-017 Nami", () => {
  test("reveals a compound Straw Hat card other than Nami and orders the rest", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb02Nami017],
      deck: [
        eb01TonyTonyChopper006,
        eb02Nami017,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: 1,
    });
    const chopperId = engine.findCardInZone("south", "deck", eb01TonyTonyChopper006);
    const namiId = engine.findCardInZone("south", "deck", eb02Nami017);

    engine.playCard(eb02Nami017, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Nami's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === chopperId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === namiId)?.legal).toBe(false);
    expect(search.candidates.filter((candidate) => candidate.legal)).toHaveLength(1);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [chopperId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Nami's deck order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      chopperId,
    );
    expect(engine.getView("south").players.south.deckCount).toBe(5);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
