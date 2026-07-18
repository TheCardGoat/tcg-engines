import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op04Cavendish081,
  op04CorridaColiseum096,
  op10Mansherry056,
  op10Rebecca058,
  op10Usopp042,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-056 Mansherry", () => {
  test("may rest a Dressrosa Stage and return a cost-4 Dressrosa Character as separate costs", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10Usopp042,
        hand: [op10Mansherry056],
        stage: op04CorridaColiseum096,
        character: [op04Cavendish081, op10Rebecca058],
        activeDon: op10Mansherry056.cost,
      },
      { character: [eb01Doma005] },
    );
    const stageId = engine.findCardInZone("south", "stage", op04CorridaColiseum096);
    const paymentId = engine.findCardInZone("south", "character", op04Cavendish081);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op10Mansherry056, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const rest = engine.pendingDecision("effectCostRestCards", "south").steps[0];
    if (rest?.kind !== "payCost") throw new Error("Expected Mansherry's rest cost.");
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toContain(stageId);
    engine.resolveDecision("effectCostRestCards", { selectedIds: [stageId] }, "south");
    const returned = engine.pendingDecision("effectCostReturnCharacter", "south").steps[0];
    if (returned?.kind !== "payCost") throw new Error("Expected Mansherry's return cost.");
    expect(returned.candidates.map((candidate) => candidate.ref.id)).toContain(paymentId);
    engine.resolveDecision("effectCostReturnCharacter", { selectedIds: [paymentId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingId] }, "south");

    expect(engine.getView("south").players.south.stage?.rested).toBe(true);
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      paymentId,
    );
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      opposingId,
    );
  });
});
