import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op08Duval088 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-088 Duval", () => {
  test("gives one of your Characters +1 cost through the end of the opponent's next turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op08Duval088], activeDon: 1, character: [eb01Doma005] },
      { character: [eb01Doma005] },
    );
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const opponentId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op08Duval088, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Duval's cost target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(ownId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(opponentId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === ownId)
        ?.cost,
    ).toBe(eb01Doma005.cost + 1);
    engine.endTurn("south");
    expect(
      engine.getView("north").players.south.characters.find((card) => card?.instanceId === ownId)
        ?.cost,
    ).toBe(eb01Doma005.cost + 1);
    engine.endTurn("north");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === ownId)
        ?.cost,
    ).toBe(eb01Doma005.cost);
  });
});
