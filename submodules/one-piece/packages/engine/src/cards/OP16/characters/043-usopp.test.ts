import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-043 Usopp", () => {
  test("[On K.O.] may rest a Dressrosa Leader to return an opposing Character with cost 5 or less to its owner's hand", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP04-039", character: [{ cardId: "OP16-043", rested: true }] },
      { character: ["OP13-013", "OP16-003"], activeDon: 5 },
    );
    const usoppId = engine.findCardInZone("south", "character", "OP16-043");
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.endTurn("south");
    const northHandBefore = engine.getView("south").players.north.handCount;
    engine.asNorth().attack("OP16-003", "OP16-043");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the return target.");
    // Cost 8 Newgate is not eligible.
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([higumaId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.rested).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(usoppId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(higumaId);
    expect(view.players.north.handCount).toBe(northHandBefore + 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("[On K.O.] declining the cost leaves the Leader active and the Character on the field", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP04-039", character: [{ cardId: "OP16-043", rested: true }] },
      { character: ["OP13-013", "OP16-003"], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-043");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.rested).toBe(false);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(higumaId);
    expect(view.prompts).toHaveLength(0);
  });

  test("without a Dressrosa Leader or Stage there is nothing to rest, so the effect does not open", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-043", rested: true }] },
      { character: ["OP13-013", "OP16-003"], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", "OP16-043");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(higumaId);
    expect(view.prompts).toHaveLength(0);
  });
});
