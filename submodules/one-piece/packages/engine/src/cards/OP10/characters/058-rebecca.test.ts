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

function chooseReadySource(engine: OnePieceTestEngine, sourceId: string) {
  const step = engine.pendingDecision("readyEffectOrder", "south").steps[0];
  if (step?.kind !== "chooseOption") throw new Error("Expected ready On Play effect choice");
  const option = step.options.find((candidate) => candidate.targetId === sourceId);
  if (!option) throw new Error("Expected the selected On Play source");
  engine.resolveDecision("readyEffectOrder", { optionId: option.id }, "south");
}

describe("OP10-058 Rebecca", () => {
  test("without a cost-8 Character neither draws nor reveals or plays available Dressrosa cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10Rebecca058, op10Mansherry056, op10Kyros046],
      activeDon: op10Rebecca058.cost,
    });
    const before = engine.getView("south").players.south.deckCount;
    engine.playCard(op10Rebecca058);
    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(before);
    expect(view.players.south.hand.map((card) => card.cardId)).toEqual([
      op10Mansherry056.id,
      op10Kyros046.id,
    ]);
    expect(view.players.south.characters.filter(Boolean)).toHaveLength(1);
    expect(view.prompts).toHaveLength(0);
  });

  test.each([1, 4])(
    "draws and plays active/rested Characters starting with %s Characters",
    (fieldCount) => {
      const engine = OnePieceTestEngine.create({
        hand: [op10Rebecca058, op10Hajrudin050, op10BlueGilly054],
        character: [op01Shanks120, ...Array.from({ length: fieldCount - 1 }, () => eb01Doma005)],
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
      const assignment = engine.pendingDecision("effectGroupedPlayStateAssignment", "south")
        .steps[0];
      if (assignment?.kind !== "chooseOption") {
        throw new Error("Expected Rebecca's play-state assignment.");
      }
      expect(assignment.options.map((option) => option.id)).toEqual([hajrudinId]);
      engine.resolveDecision("effectGroupedPlayStateAssignment", { optionId: hajrudinId }, "south");
      if (fieldCount === 4) {
        const rebeccaId = engine.findCardInZone("south", "character", op10Rebecca058);
        const shanksId = engine.findCardInZone("south", "character", op01Shanks120);
        engine.resolveDecision(
          "effectPlayCharacterReplacement",
          { selectedIds: [rebeccaId] },
          "south",
        );
        engine.resolveDecision(
          "effectPlayCharacterReplacement",
          { selectedIds: [shanksId] },
          "south",
        );
        expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toEqual(
          expect.arrayContaining([rebeccaId, shanksId]),
        );
        expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(5);
      }

      const view = engine.getView("south");
      expect(view.players.south.deckCount).toBe(deckBefore - 1);
      expect(
        view.players.south.characters.find((card) => card?.instanceId === hajrudinId)?.rested,
      ).toBe(false);
      expect(
        view.players.south.characters.find((card) => card?.instanceId === blueGillyId)?.rested,
      ).toBe(true);
      expect(view.prompts).toHaveLength(0);
    },
  );

  test("cancels a grouped Character's pending On Play when Mansherry returns it as a cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04Rebecca039,
        hand: [op10Rebecca058, op10Mansherry056, op10Kyros046],
        activeDon: op10Rebecca058.cost,
      },
      { character: [eb01MountainGod018, op01Shanks120] },
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
    chooseReadySource(engine, mansherryId);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnCharacter", { selectedIds: [kyrosId] }, "south");
    // Kyros leaves before its On Play activates (8-1-3-1-3). Mansherry
    // cannot return the cost-5 Mountain God, so it stays in the Character area.
    expect(engine.findCardInZone("south", "hand", op10Kyros046)).toBe(kyrosId);
    expect(engine.findCardInZone("north", "character", eb01MountainGod018)).toBe(opponentId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
