import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-102 Avalo Pizarro", () => {
  test("[On K.O.] draws 1 and may play a [Fullalead] from hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-102", rested: true }], hand: ["OP17-057"] },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const pizarroId = engine.findCardInZone("south", "character", "OP16-102");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-102");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the play choice.");
    engine.resolveDecision(
      "effectPlaySelection",
      { selectedIds: [play.candidates[0]!.ref.id] },
      "south",
    );

    const south = engine.getView("south").players.south;
    expect(south.trash.map((card) => card.instanceId)).toContain(pizarroId);
    engine.findCardInZone("south", "stage", "OP17-057");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("without [Fullalead] available only the draw happens", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-102", rested: true }], hand: ["OP13-013"] },
      { character: ["OP16-003"], activeDon: 5 },
    );

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-102");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    expect(engine.getView("south").players.south.hand).toHaveLength(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
