import { describe, expect, test } from "vite-plus/test";
import { op01Inuarashi034, op09Izo044, op17KouzukiOden007 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-007 Kouzuki Oden", () => {
  test("under [Edward.Newgate] (OP17-001) it replays a Land-of-Wano Whitebeard Character of 6000 or less power", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP17-001",
        hand: [op17KouzukiOden007, op09Izo044, op01Inuarashi034],
        activeDon: op17KouzukiOden007.cost,
      },
      {},
    );
    const izoId = engine.findCardInZone("south", "hand", op09Izo044);

    engine.playCard(op17KouzukiOden007, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the replay choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([
      izoId,
      engine.findCardInZone("south", "hand", op01Inuarashi034),
    ]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [izoId] }, "south");

    const view = engine.getView("south").players.south;
    expect(view.characters.map((card) => card?.instanceId)).toContain(izoId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not open under a Leader without the name or trait", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP13-001",
        hand: [op17KouzukiOden007, op09Izo044, op01Inuarashi034],
        activeDon: op17KouzukiOden007.cost,
      },
      {},
    );

    engine.playCard(op17KouzukiOden007, "south");

    const view = engine.getView("south").players.south;
    expect(view.hand.map((card) => card.cardId)).toContain(op09Izo044.id);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
