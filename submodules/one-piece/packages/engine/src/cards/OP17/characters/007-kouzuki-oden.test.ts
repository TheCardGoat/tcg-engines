import { describe, expect, test } from "vite-plus/test";
import { op01Inuarashi034, op17KouzukiOden007 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-007 Kouzuki Oden", () => {
  test("under [Edward.Newgate] (OP17-001) it replays a Land-of-Wano Whitebeard Character of 6000 or less power", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP17-001",
        hand: [op17KouzukiOden007, op01Inuarashi034],
        activeDon: op17KouzukiOden007.cost,
      },
      {},
    );
    const inuarashiId = engine.findCardInZone("south", "hand", op01Inuarashi034);

    engine.playCard(op17KouzukiOden007, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the replay choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([inuarashiId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [inuarashiId] }, "south");

    const view = engine.getView("south").players.south;
    expect(view.characters.map((card) => card?.instanceId)).toContain(inuarashiId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not open under a Leader without the name or trait", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP13-001",
        hand: [op17KouzukiOden007, op01Inuarashi034],
        activeDon: op17KouzukiOden007.cost,
      },
      {},
    );

    engine.playCard(op17KouzukiOden007, "south");

    const view = engine.getView("south").players.south;
    expect(view.hand.map((card) => card.cardId)).toContain(op01Inuarashi034.id);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
