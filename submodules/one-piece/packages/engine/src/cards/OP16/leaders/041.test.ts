import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-041", () => {
  test("when an {Impel Down} Character is removed, plays a [Prisoner of Impel Down] from hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP16-041",
        character: [{ cardId: "OP16-072", rested: true }],
        hand: ["OP16-042"],
        activeDon: 5,
      },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const hannyabalId = engine.findCardInZone("south", "character", "OP16-072");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-072");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the play choice.");
    const prisonerId = play.candidates[0]!.ref.id;
    engine.resolveDecision("effectPlaySelection", { selectedIds: [prisonerId] }, "south");

    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(
      hannyabalId,
    );
    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      prisonerId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("the Leader battles and deals damage normally", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP16-041", activeDon: 5 },
      { activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.asSouth().attack(engine.leader("south"), engine.asNorth().leader());

    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
