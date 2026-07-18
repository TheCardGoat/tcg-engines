import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01TonyTonyChopper006,
  op01Nami016,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-016 Nami", () => {
  test("finds a compound Straw Hat Crew Character other than Nami and orders the rest", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01Nami016],
      deck: [
        eb01TonyTonyChopper006,
        op01Nami016,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: op01Nami016.cost,
    });
    const chopperId = engine.findCardInZone("south", "deck", eb01TonyTonyChopper006);
    const namiId = engine.findCardInZone("south", "deck", op01Nami016);

    engine.playCard(op01Nami016, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Nami's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === chopperId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === namiId)?.legal).toBe(false);
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
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
