import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Komurasaki042,
  op01KouzukiMomonosuke041,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-041 Kouzuki Momonosuke", () => {
  test("rests itself and 1 DON!! to find a compound Land of Wano card and bottom-deck the rest", () => {
    const engine = OnePieceTestEngine.create({
      character: [op01KouzukiMomonosuke041],
      deck: [op01Komurasaki042, eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: 1,
    });
    const momonosukeId = engine.findCardInZone("south", "character", op01KouzukiMomonosuke041);
    const komurasakiId = engine.findCardInZone("south", "deck", op01Komurasaki042);

    engine.activateEffect(momonosukeId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Momonosuke's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === komurasakiId)?.legal).toBe(
      true,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [komurasakiId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Momonosuke's deck order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(komurasakiId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === momonosukeId)?.rested,
    ).toBe(true);
    expect(view.players.south.activeDon).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });
});
