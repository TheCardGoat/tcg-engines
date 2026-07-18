import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01Usopp004,
  op04WeaknessIsAnUnforgivableSin076,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-004 Usopp", () => {
  test("draws once when the opponent activates a Counter Event during its controller's turn with DON!! attached", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op01Usopp004, attachedDon: 1, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
        deck: [eb01Doma005, eb01MountainGod018],
      },
      {
        hand: [op04WeaknessIsAnUnforgivableSin076, op04WeaknessIsAnUnforgivableSin076],
        activeDon: 4,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const firstAttackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const secondAttackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const firstEventId = engine.findCardInZone("north", "hand", op04WeaknessIsAnUnforgivableSin076);
    const usoppHandBefore = engine.getView("south").players.south.hand.length;

    engine.declareAttack(firstAttackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [firstEventId!] }, "north");
    const firstReturn = engine.pendingDecision("effectCostReturnDon", "north").steps[0];
    expect(firstReturn?.kind).toBe("payCost");
    if (firstReturn?.kind !== "payCost") throw new Error("Expected the Event's DON!! cost.");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: [firstReturn.candidates[0]!.ref.id] },
      "north",
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    expect(engine.getView("south").players.south.hand).toHaveLength(usoppHandBefore + 1);
    expect(engine.getView("south").players.south.deckCount).toBe(1);

    const secondEventId = engine.findCardInZone(
      "north",
      "hand",
      op04WeaknessIsAnUnforgivableSin076,
    );
    engine.declareAttack(secondAttackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [secondEventId] }, "north");
    const secondReturn = engine.pendingDecision("effectCostReturnDon", "north").steps[0];
    expect(secondReturn?.kind).toBe("payCost");
    if (secondReturn?.kind !== "payCost")
      throw new Error("Expected the second Event's DON!! cost.");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: [secondReturn.candidates[0]!.ref.id] },
      "north",
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    expect(engine.getView("south").players.south.hand).toHaveLength(usoppHandBefore + 1);
    expect(engine.getView("south").players.south.deckCount).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
