import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op01Crocodile067,
  op01EustassCaptainKid051,
  op02MonkeyDGarp002,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-002 Monkey.D.Garp", () => {
  test("maps an own DON!! attachment to an opposing cost-7-or-less turn modifier", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02MonkeyDGarp002,
        character: [eb01Doma005],
        activeDon: 1,
      },
      { character: [op01Crocodile067, op01EustassCaptainKid051] },
    );
    const recipientId = engine.findCardInZone("south", "character", eb01Doma005);
    const boundaryId = engine.findCardInZone("north", "character", op01Crocodile067);
    const excludedId = engine.findCardInZone("north", "character", op01EustassCaptainKid051);

    engine.attachDon(recipientId, 1, "south");

    const decision = engine.pendingDecision("effectTargetSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error(
        "Expected the DON!! recipient's controller to choose a cost modifier target.",
      );
    }
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([boundaryId]);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [boundaryId] }, "south");

    expect(engine.getView("south").players.north.characters[0]?.cost).toBe(6);
    engine.endTurn("south");
    expect(engine.getView("south").players.north.characters[0]?.cost).toBe(7);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
