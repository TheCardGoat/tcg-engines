import { describe, expect, test } from "vite-plus/test";
import { eb01OffWhite019, op11Hibari010 } from "@tcg/op-cards";
import { op12Carne066 } from "../../../../../cards/src/cards/OP12/characters/066-carne.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-066 Carne", () => {
  test("gains Blocker at the threshold of four Events in trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op12Carne066],
        trash: [eb01OffWhite019, eb01OffWhite019, eb01OffWhite019, eb01OffWhite019],
      },
      { character: [{ card: op11Hibari010, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const carneId = engine.findCardInZone("south", "character", op12Carne066);
    const attackerId = engine.findCardInZone("north", "character", op11Hibari010);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Carne's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(carneId);
    engine.resolveDecision("battleBlocker", { selectedIds: [carneId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });

  test("does not gain Blocker with only three Events in trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op12Carne066],
        trash: [eb01OffWhite019, eb01OffWhite019, eb01OffWhite019],
      },
      { character: [{ card: op11Hibari010, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", op11Hibari010);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore - 1);
    expect(view.prompts).toHaveLength(0);
  });
});
