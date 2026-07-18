import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op09TonyTonyChopper068 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-068 Tony Tony.Chopper", () => {
  test("at turn end returns multiple DON!!, becomes active, and blocks during the opponent's turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op09TonyTonyChopper068, rested: true, playedOnTurn: 0 }],
        activeDon: 3,
      },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const chopperId = engine.findCardInZone("south", "character", op09TonyTonyChopper068);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.endTurn("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(payment).toMatchObject({ kind: "payCost", min: 1, max: 3 });
    if (payment?.kind !== "payCost") throw new Error("Expected Chopper's variable DON!! cost.");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: payment.candidates.slice(0, 2).map((candidate) => candidate.ref.id) },
      "south",
    );

    let view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 2);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === chopperId)?.rested,
    ).toBe(false);

    const lifeBefore = view.players.south.lifeCount;
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Chopper's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(chopperId);
    engine.resolveDecision("battleBlocker", { selectedIds: [chopperId] }, "south");

    view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === chopperId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
