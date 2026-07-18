import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { op11Koby119 } from "../../../../../cards/src/cards/OP11/characters/119-koby.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-119 Koby", () => {
  test("on play lets one chosen Character attack an active Character this turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op11Koby119],
        character: [{ card: eb01Doma005, playedOnTurn: 0 }],
        activeDon: op11Koby119.cost,
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const activeTargetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op11Koby119, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [attackerId] }, "south");
    engine.declareAttack(attackerId, activeTargetId, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === attackerId)?.rested,
    ).toBe(true);
  });

  test("returns two ordered trash cards before granting power through the opponent's next turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op11Koby119, playedOnTurn: 0 }],
        trash: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kobyId = engine.findCardInZone("south", "character", op11Koby119);
    const paymentIds = engine.getState().players.south.trash.slice(0, 2).reverse();
    const leaderPower = engine.getView("south").players.south.leader.power;
    if (leaderPower === null) throw new Error("Expected the south Leader's visible power.");

    engine.declareAttack(kobyId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    expect(cost).toMatchObject({ kind: "payCost", min: 2, max: 2, ordered: true });
    engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds: paymentIds }, "south");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    expect(engine.getState().players.south.deck.slice(-2)).toEqual(paymentIds);
    expect(engine.getView("south").players.south.leader.power).toBe(leaderPower + 1000);
    engine.endTurn("south");
    expect(engine.getView("south").players.south.leader.power).toBe(leaderPower + 1000);
    engine.endTurn("north");
    expect(engine.getView("south").players.south.leader.power).toBe(leaderPower);
  });
});
