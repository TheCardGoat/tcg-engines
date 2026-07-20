import { describe, expect, test } from "vite-plus/test";
import { op05MaryGeoise097 } from "../../../../../cards/src/cards/OP05/stages/097-mary-geoise.ts";
import { op13OroJackson078 } from "../../../../../cards/src/cards/OP13/stages/078-oro-jackson.ts";
import { op13TheEmptyThrone099 } from "../../../../../cards/src/cards/OP13/stages/099-the-empty-throne.ts";
import { op13SaintMjosgard092 } from "../../../../../cards/src/cards/OP13/characters/092-saint-mjosgard.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-092 Saint Mjosgard", () => {
  test("at three Life optionally plays only a cost-1 Mary Geoise Stage from own trash", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13SaintMjosgard092],
      life: 3,
      trash: [op05MaryGeoise097, op13OroJackson078, op13TheEmptyThrone099],
      activeDon: op13SaintMjosgard092.cost,
    });
    const eligibleId = engine.findCardInZone("south", "trash", op05MaryGeoise097);
    const wrongTraitId = engine.findCardInZone("south", "trash", op13OroJackson078);
    const tooExpensiveId = engine.findCardInZone("south", "trash", op13TheEmptyThrone099);

    engine.playCard(op13SaintMjosgard092, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Mjosgard's Stage choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    const candidates = play.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toContain(eligibleId);
    expect(candidates).not.toContain(wrongTraitId);
    expect(candidates).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.stage?.instanceId).toBe(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("with four Life does not offer the trash Stage play", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13SaintMjosgard092],
      life: 4,
      trash: [op05MaryGeoise097],
      activeDon: op13SaintMjosgard092.cost,
    });
    const stageId = engine.findCardInZone("south", "trash", op05MaryGeoise097);

    engine.playCard(op13SaintMjosgard092, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(stageId);
    expect(view.players.south.stage).toBeNull();
    expect(view.prompts).toHaveLength(0);
  });
});
