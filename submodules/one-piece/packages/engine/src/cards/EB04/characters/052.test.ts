import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("EB04-052", () => {
  test("[On K.O.] with 2 or less Life plays a yellow Character of 6000 power or less from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ cardId: "EB04-052", rested: true }],
        hand: ["OP16-104"],
        life: ["OP12-013", "OP12-017"],
        activeDon: 5,
      },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const koId = engine.findCardInZone("south", "character", "EB04-052");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "EB04-052");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the play choice.");
    const kumaCandidates = play.candidates.map((c) => c.ref.id);
    expect(kumaCandidates).toHaveLength(1);
    engine.resolveDecision("effectPlaySelection", { selectedIds: kumaCandidates }, "south");

    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(koId);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP16-104",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[On K.O.] with 3 Life offers nothing", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ cardId: "EB04-052", rested: true }],
        hand: ["OP16-104"],
        life: ["OP12-013", "OP12-017", "OP12-018"],
        activeDon: 5,
      },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const koId = engine.findCardInZone("south", "character", "EB04-052");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "EB04-052");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(koId);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).not.toContain(
      "OP16-104",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[When Attacking] its base power becomes the opposing Leader's power", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["EB04-052"], activeDon: 5 },
      { activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    // Without the effect, 4000 power could not damage the 5000-power Leader.
    engine.asSouth().attack("EB04-052", engine.asNorth().leader());

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
  });
});
