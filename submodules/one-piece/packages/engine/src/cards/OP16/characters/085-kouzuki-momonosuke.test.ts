import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-085 Kouzuki Momonosuke", () => {
  test("[On Play] may play a Land of Wano Character of cost 6 or less from trash", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-085"], trash: ["OP16-091"], activeDon: 9 },
      {},
    );

    engine.playCard("OP16-085");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the play choice.");
    engine.resolveDecision(
      "effectPlaySelection",
      { selectedIds: [play.candidates[0]!.ref.id] },
      "south",
    );

    const south = engine.getView("south").players.south;
    expect(south.characters.map((card) => card?.cardId)).toContain("OP16-091");
    expect(south.trash.map((card) => card.cardId)).not.toContain("OP16-091");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining leaves the trash untouched", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-085"], trash: ["OP16-091"], activeDon: 9 },
      {},
    );

    engine.playCard("OP16-085");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the play choice.");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.cardId)).toContain(
      "OP16-091",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
