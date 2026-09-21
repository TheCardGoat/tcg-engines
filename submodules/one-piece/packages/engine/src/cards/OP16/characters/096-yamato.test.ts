import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-096 Yamato", () => {
  test("[On K.O.] may play a [Yamato] of cost 6 or less from trash", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-096", rested: true }], trash: ["OP16-098"] },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const yamatoId = engine.findCardInZone("south", "character", "OP16-096");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-096");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the play choice.");
    engine.resolveDecision(
      "effectPlaySelection",
      { selectedIds: [play.candidates[0]!.ref.id] },
      "south",
    );

    const south = engine.getView("south").players.south;
    expect(south.trash.map((card) => card.instanceId)).toContain(yamatoId);
    expect(south.characters.map((card) => card?.cardId)).toContain("OP16-098");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-096", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP16-096",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
