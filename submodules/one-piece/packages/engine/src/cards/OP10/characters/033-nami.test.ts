import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op10Brook035, op10Franky034, op10Nami033 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-033 Nami", () => {
  test("offers only an opponent's rested DON!! card for the next-Refresh freeze", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op10Nami033],
        character: [
          { card: op10Brook035, rested: true },
          { card: op10Franky034, rested: true },
        ],
        activeDon: op10Nami033.cost,
      },
      {
        character: [{ card: eb01Doma005, rested: true }],
        restedDon: 1,
        deck: [eb01Doma005, eb01Doma005],
      },
    );
    const characterId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op10Nami033, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Nami's DON!! freeze choice.");
    expect(
      target.candidates.some((candidate) => candidate.ref.id.startsWith("rested-don:north:")),
    ).toBe(true);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(characterId);
    const donTarget = target.candidates.find((candidate) =>
      candidate.ref.id.startsWith("rested-don:north:"),
    );
    if (!donTarget) throw new Error("Expected Nami's rested DON!! target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [donTarget.ref.id] }, "south");

    engine.endTurn("south");
    expect(engine.getView("north").players.north.restedDon).toBe(1);
    engine.endTurn("north");
    engine.endTurn("south");
    expect(engine.getView("north").players.north.restedDon).toBe(0);
  });
});
