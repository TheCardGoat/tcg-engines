import { eb01Doma005, op13SaintCharlos087, op13StShepherdJuPeter084 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13York094 } from "../../../../../cards/src/cards/OP13/characters/094-york.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-094 York", () => {
  test("gives the selected self-owned included Celestial Dragons Character +2000 this turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13York094],
        character: [op13SaintCharlos087, op13StShepherdJuPeter084, eb01Doma005],
        activeDon: op13York094.cost,
      },
      { character: [op13SaintCharlos087] },
    );
    const exactTraitId = engine.findCardInZone("south", "character", op13SaintCharlos087);
    const includedTraitId = engine.findCardInZone("south", "character", op13StShepherdJuPeter084);
    const wrongTraitId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", op13SaintCharlos087);

    engine.playCard(op13York094, "south");
    const decision = engine.pendingDecision("effectTargetSelection", "south");
    expect(decision.actorId).toBe("south");
    const target = decision.steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected York's power target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([exactTraitId, includedTraitId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(opposingId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [includedTraitId] }, "south");

    let view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === includedTraitId)?.power,
    ).toBe((op13StShepherdJuPeter084.power ?? 0) + 2000);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === exactTraitId)?.power,
    ).toBe(op13SaintCharlos087.power);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingId)?.power,
    ).toBe(op13SaintCharlos087.power);
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === includedTraitId)?.power,
    ).toBe(op13StShepherdJuPeter084.power);
    expect(view.prompts).toHaveLength(0);
  });

  test("may choose no Celestial Dragons Character and apply no power modifier", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13York094],
      character: [op13SaintCharlos087],
      activeDon: op13York094.cost,
    });
    const targetId = engine.findCardInZone("south", "character", op13SaintCharlos087);

    engine.playCard(op13York094, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      op13SaintCharlos087.power,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
