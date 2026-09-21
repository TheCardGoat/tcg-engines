import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-055", () => {
  test("[On K.O.] plays a Revolutionary Army Character with cost 4 or less from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ cardId: "EB04-055", rested: true }],
        hand: ["OP16-093"],
        activeDon: 5,
      },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const koId = engine.findCardInZone("south", "character", "EB04-055");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "EB04-055");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the play choice.");
    const candidates = play.candidates.map((c) => c.ref.id);
    expect(candidates).toHaveLength(1);
    engine.resolveDecision("effectPlaySelection", { selectedIds: candidates }, "south");

    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(koId);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP16-093",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
