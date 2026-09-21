import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-029 Antlerkov", () => {
  test("[When Attacking] with [Bunkov] may play a cost-2-or-less Character from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ cardId: "OP16-029", attachedDon: 1 }, "OP16-025"],
        hand: ["EB01-005"],
        activeDon: 5,
      },
      {},
    );

    engine.asSouth().attack("OP16-029", engine.asNorth().leader());
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Antlerkov's play choice.");
    engine.resolveDecision(
      "effectPlaySelection",
      { selectedIds: [play.candidates[0]!.ref.id] },
      "south",
    );

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "EB01-005",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("without [Bunkov] the When Attacking play does not trigger", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-029", attachedDon: 1 }], hand: ["EB01-005"], activeDon: 5 },
      {},
    );

    engine.asSouth().attack("OP16-029", engine.asNorth().leader());

    expect(engine.getView("south").players.south.hand.map((card) => card.cardId)).toContain(
      "EB01-005",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
