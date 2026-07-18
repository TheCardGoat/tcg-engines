import { describe, expect, test } from "vite-plus/test";
import { op04CorridaColiseum096, op04Rebecca039 } from "@tcg/op-cards";
import { op10Moocy043 } from "../../../../../cards/src/cards/OP10/characters/043-moocy.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-043 Moocy", () => {
  test("accepts either a Dressrosa Leader or Stage as its rest cost", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op04Rebecca039,
      hand: [op10Moocy043],
      stage: op04CorridaColiseum096,
      activeDon: op10Moocy043.cost,
    });
    engine.playCard(op10Moocy043, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostRestCards", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Moocy's Leader-or-Stage rest cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([
        engine.leader("south"),
        engine.findCardInZone("south", "stage", op04CorridaColiseum096),
      ]),
    );
  });
});
