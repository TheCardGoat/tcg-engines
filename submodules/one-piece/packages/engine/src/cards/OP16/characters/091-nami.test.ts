import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-091 Nami", () => {
  test("[On Play] for a Land of Wano Leader looks at 4, takes a LoW card other than [Nami], trashes the rest", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP01-031",
        hand: ["OP16-091"],
        deck: ["OP13-013", "OP16-095", "OP13-013", "OP13-013", "OP13-013"],
        activeDon: 1,
      },
      {},
    );

    engine.playCard("OP16-091");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected the search choice.");
    const legal = search.candidates.filter((candidate) => candidate.legal);
    expect(legal.map((candidate) => candidate.publicInfo?.cardId)).toEqual(["OP16-095"]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [legal[0]!.ref.id!] }, "south");

    // The trashed rest goes straight to the trash.

    const south = engine.getView("south").players.south;
    expect(south.hand.map((card) => card.cardId)).toContain("OP16-095");
    expect(south.trash.map((card) => card.cardId)).toContain("OP13-013");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("without a Land of Wano Leader the On Play does not trigger", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-091"], deck: 5, activeDon: 1 }, {});

    engine.playCard("OP16-091");

    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
