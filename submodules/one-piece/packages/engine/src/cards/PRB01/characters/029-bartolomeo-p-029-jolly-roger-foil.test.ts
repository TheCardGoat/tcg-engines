import { eb01Doma005, op13SunnyKun026 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { prb01BartolomeoP029JollyRogerFoil029 } from "../../../../../cards/src/cards/PRB01/characters/029-bartolomeo-p-029-jolly-roger-foil.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("P-029 Bartolomeo", () => {
  test("at end of turn may rest itself to set an included FILM Character other than Bartolomeo active", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          prb01BartolomeoP029JollyRogerFoil029,
          { card: prb01BartolomeoP029JollyRogerFoil029, rested: true },
          { card: op13SunnyKun026, rested: true },
          { card: eb01Doma005, rested: true },
        ],
      },
      { character: [{ card: op13SunnyKun026, rested: true }] },
    );
    const sourceId = engine.findCardInZone(
      "south",
      "character",
      prb01BartolomeoP029JollyRogerFoil029,
    );
    const bartolomeoIds = engine
      .getView("south")
      .players.south.characters.filter(
        (card) => card?.cardId === prb01BartolomeoP029JollyRogerFoil029.id,
      )
      .map((card) => card?.instanceId);
    const eligibleId = engine.findCardInZone("south", "character", op13SunnyKun026);
    const wrongTraitId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", op13SunnyKun026);

    engine.endTurn("south");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Bartolomeo's FILM target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    for (const excludedId of [...bartolomeoIds, wrongTraitId, opposingId]) {
      expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    }
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === sourceId)?.rested,
    ).toBe(true);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without resting itself", () => {
    const engine = OnePieceTestEngine.create({
      character: [prb01BartolomeoP029JollyRogerFoil029, { card: op13SunnyKun026, rested: true }],
    });
    const sourceId = engine.findCardInZone(
      "south",
      "character",
      prb01BartolomeoP029JollyRogerFoil029,
    );

    engine.endTurn("south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === sourceId)
        ?.rested,
    ).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
