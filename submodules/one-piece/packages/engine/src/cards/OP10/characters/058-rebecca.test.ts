import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01Shanks120,
  op04Rebecca039,
  op10BlueGilly054,
  op10Hajrudin050,
  op10Kyros046,
  op10Mansherry056,
  op10Rebecca058,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-058 Rebecca", () => {
  test("draws, reveals two physical Dressrosa Characters, then plays one active and one rested", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10Rebecca058, op10Hajrudin050, op10BlueGilly054],
      character: [op01Shanks120],
      deck: [eb01Doma005, eb01MountainGod018],
      activeDon: op10Rebecca058.cost,
    });
    const hajrudinId = engine.findCardInZone("south", "hand", op10Hajrudin050);
    const blueGillyId = engine.findCardInZone("south", "hand", op10BlueGilly054);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op10Rebecca058, "south");
    const reveal = engine.pendingDecision("effectRevealFromHandSelection", "south").steps[0];
    if (reveal?.kind !== "selectEntity") throw new Error("Expected Rebecca's reveal choice.");
    expect(reveal).toMatchObject({ min: 0, max: 2 });
    expect(reveal.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([hajrudinId, blueGillyId]),
    );
    engine.resolveDecision(
      "effectRevealFromHandSelection",
      { selectedIds: [hajrudinId, blueGillyId] },
      "south",
    );

    const grouped = engine.pendingDecision("effectGroupedPlaySelection", "south").steps[0];
    if (grouped?.kind !== "selectEntity") throw new Error("Expected Rebecca's grouped play.");
    expect(grouped.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([hajrudinId, blueGillyId]),
    );
    engine.resolveDecision(
      "effectGroupedPlaySelection",
      { selectedIds: [hajrudinId, blueGillyId] },
      "south",
    );
    const assignment = engine.pendingDecision("effectGroupedPlayStateAssignment", "south").steps[0];
    if (assignment?.kind !== "chooseOption") {
      throw new Error("Expected Rebecca's play-state assignment.");
    }
    expect(assignment.options.map((option) => option.id)).toEqual([hajrudinId]);
    engine.resolveDecision("effectGroupedPlayStateAssignment", { optionId: hajrudinId }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore - 1);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === hajrudinId)?.rested,
    ).toBe(false);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === blueGillyId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("keeps a grouped Character's queued On Play after Mansherry returns it as a cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04Rebecca039,
        hand: [op10Rebecca058, op10Mansherry056, op10Kyros046],
        activeDon: op10Rebecca058.cost,
      },
      { character: [eb01MountainGod018] },
    );
    const mansherryId = engine.findCardInZone("south", "hand", op10Mansherry056);
    const kyrosId = engine.findCardInZone("south", "hand", op10Kyros046);
    const opponentId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op10Rebecca058, "south");
    engine.resolveDecision(
      "effectRevealFromHandSelection",
      { selectedIds: [mansherryId, kyrosId] },
      "south",
    );
    engine.resolveDecision(
      "effectGroupedPlaySelection",
      { selectedIds: [mansherryId, kyrosId] },
      "south",
    );
    engine.resolveDecision("effectGroupedPlayStateAssignment", { optionId: kyrosId }, "south");
    engine.resolveDecision(
      "effectGroupedPlayOnPlayOrder",
      { selectedIds: [mansherryId, kyrosId] },
      "south",
    );
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnCharacter", { selectedIds: [kyrosId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opponentId] }, "south");

    expect(engine.findCardInZone("south", "hand", op10Kyros046)).toBe(kyrosId);
    expect(engine.findCardInZone("north", "hand", eb01MountainGod018)).toBe(opponentId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
