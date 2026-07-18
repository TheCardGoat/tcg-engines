import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op02IceAge117,
  op04WeaknessIsAnUnforgivableSin076,
  op06Gion044,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-044 Gion", () => {
  test("during its turn makes the opponent bottom-deck their chosen card only once after Event Counters", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          op06Gion044,
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      {
        hand: [
          op04WeaknessIsAnUnforgivableSin076,
          op04WeaknessIsAnUnforgivableSin076,
          eb01Doma005,
          eb01Doma005,
        ],
        activeDon: 2,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerIds = engine
      .getView("south")
      .players.south.characters.filter((card) => card?.cardId === eb01MountainGod018.id)
      .map((card) => card!.instanceId);
    const eventIds = engine
      .getView("north")
      .players.north.hand.filter((card) => card.cardId === op04WeaknessIsAnUnforgivableSin076.id)
      .map((card) => card.instanceId);
    const handIds = engine
      .getView("north")
      .players.north.hand.filter((card) => card.cardId === eb01Doma005.id)
      .map((card) => card.instanceId);
    const donDeckBefore = engine.getView("north").players.north.donDeckCount;

    engine.declareAttack(attackerIds[0]!, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventIds[0]!] }, "north");
    const firstReturn = engine.pendingDecision("effectCostReturnDon", "north").steps[0];
    expect(firstReturn?.kind).toBe("payCost");
    if (firstReturn?.kind !== "payCost") throw new Error("Expected the Event's DON!! cost.");
    const firstRestedDon = firstReturn.candidates.find((candidate) =>
      candidate.ref.id.startsWith("rested-don:"),
    );
    if (!firstRestedDon) throw new Error("Expected the Event payment DON!! to be returnable.");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: [firstRestedDon.ref.id] },
      "north",
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const returnChoice = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(returnChoice?.kind).toBe("selectEntity");
    if (returnChoice?.kind !== "selectEntity") throw new Error("Expected Gion's hand choice.");
    expect(returnChoice.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining(handIds),
    );
    const selectedId = handIds[0]!;
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    expect(engine.getState().players.north.deck.at(-1)).toBe(selectedId);
    expect(engine.getView("north").prompts).toHaveLength(0);

    engine.declareAttack(attackerIds[1]!, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventIds[1]!] }, "north");
    expect(engine.getView("north").players.north.donDeckCount).toBe(donDeckBefore + 2);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      handIds[1],
    );
    expect(engine.getState().players.north.deck.filter((id) => id === selectedId)).toHaveLength(1);
  });

  test("does not trigger when the opponent activates an Event outside Gion's turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op06Gion044] },
      {
        hand: [op02IceAge117],
        character: [eb01MountainGod018],
        activeDon: op02IceAge117.cost,
      },
      { firstPlayer: "north", activeSeat: "north" },
    );

    engine.playCard(op02IceAge117, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");

    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
