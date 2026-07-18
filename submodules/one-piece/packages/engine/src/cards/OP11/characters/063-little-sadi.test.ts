import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op02Magellan071 } from "@tcg/op-cards";
import { op11LittleSadi063 } from "../../../../../cards/src/cards/OP11/characters/063-little-sadi.ts";

import { OnePieceTestEngine } from "../../../index.ts";

function payReturnDon(engine: OnePieceTestEngine) {
  engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
  const payment = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
  if (payment?.kind !== "payCost") throw new Error("Expected Little Sadi's DON!! return cost.");
  engine.resolveDecision(
    "effectCostReturnDon",
    { selectedIds: [payment.candidates[0]!.ref.id] },
    "south",
  );
}

describe("OP11-063 Little Sadi", () => {
  test("pays DON!! -1 before resting an opposing cost-3-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02Magellan071,
        hand: [op11LittleSadi063],
        activeDon: op11LittleSadi063.cost + 1,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const lowCostId = engine.findCardInZone("north", "character", eb01Doma005);
    const highCostId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op11LittleSadi063, "south");
    payReturnDon(engine);
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Little Sadi's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(lowCostId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lowCostId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(0);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === lowCostId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay its DON!! cost even when the post-colon Leader condition fails", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op11LittleSadi063],
      activeDon: op11LittleSadi063.cost + 1,
    });

    engine.playCard(op11LittleSadi063, "south");
    payReturnDon(engine);

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });
});
