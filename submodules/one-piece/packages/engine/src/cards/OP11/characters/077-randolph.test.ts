import { describe, expect, test } from "vite-plus/test";
import { op02Hydra090 } from "@tcg/op-cards";
import { op11Randolph077 } from "../../../../../cards/src/cards/OP11/characters/077-randolph.ts";

import { OnePieceTestEngine } from "../../../index.ts";

function payOneReturnedDon(engine: OnePieceTestEngine) {
  const payment = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
  expect(payment).toMatchObject({ kind: "payCost", min: 1, max: 1 });
  if (payment?.kind !== "payCost") throw new Error("Expected a DON!! return cost.");
  engine.resolveDecision(
    "effectCostReturnDon",
    { selectedIds: [payment.candidates[0]!.ref.id] },
    "south",
  );
}

describe("OP11-077 Randolph", () => {
  test("once per turn gains cost after DON!! returns and keeps it through the opponent's turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [op11Randolph077],
      hand: [op02Hydra090, op02Hydra090],
      activeDon: 4,
    });
    const randolphId = engine.findCardInZone("south", "character", op11Randolph077);

    engine.playCard(op02Hydra090, "south");
    payOneReturnedDon(engine);
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Randolph's cost target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(randolphId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [randolphId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === randolphId)?.cost,
    ).toBe((op11Randolph077.cost ?? 0) + 2);

    engine.playCard(op02Hydra090, "south");
    payOneReturnedDon(engine);
    expect(
      engine.getView("south").prompts.some((prompt) => prompt.label.includes("Randolph")),
    ).toBe(false);

    engine.endTurn("south");
    expect(
      engine
        .getView("north")
        .players.south.characters.find((card) => card?.instanceId === randolphId)?.cost,
    ).toBe((op11Randolph077.cost ?? 0) + 2);
    engine.endTurn("north");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === randolphId)?.cost,
    ).toBe(op11Randolph077.cost);
  });
});
