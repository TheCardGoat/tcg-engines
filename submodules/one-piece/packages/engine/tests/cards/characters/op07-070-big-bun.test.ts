import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op07BigBun070, op07Hamburg068, op07Monda074 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-070 Big Bun", () => {
  test("at equal DON!! plays only an included cost-4-or-less Foxy Pirates Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07BigBun070, op07Monda074, op07Hamburg068, eb01Doma005],
        activeDon: op07BigBun070.cost,
      },
      { activeDon: op07BigBun070.cost },
    );
    const eligibleId = engine.findCardInZone("south", "hand", op07Monda074);
    const expensiveId = engine.findCardInZone("south", "hand", op07Hamburg068);
    const wrongTraitId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op07BigBun070, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Big Bun's play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer a play when its controller has more DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07BigBun070, op07Monda074],
        activeDon: op07BigBun070.cost,
      },
      { activeDon: op07BigBun070.cost - 1 },
    );
    const candidateId = engine.findCardInZone("south", "hand", op07Monda074);

    engine.playCard(op07BigBun070, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(candidateId);
    expect(view.prompts).toHaveLength(0);
  });
});
