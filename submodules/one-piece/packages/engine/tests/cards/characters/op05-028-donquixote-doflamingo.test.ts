import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op05DonquixoteDoflamingo028,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-028 Donquixote Doflamingo", () => {
  test("may trash itself to K.O. only an opposing rested cost-2-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05DonquixoteDoflamingo028] },
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01MountainGod018, rested: true },
          eb01Fourtricks025,
        ],
      },
    );
    const sourceId = engine.findCardInZone("south", "character", op05DonquixoteDoflamingo028);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const activeId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Doflamingo's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(activeId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sourceId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without trashing itself", () => {
    const engine = OnePieceTestEngine.create({ character: [op05DonquixoteDoflamingo028] });
    const sourceId = engine.findCardInZone("south", "character", op05DonquixoteDoflamingo028);

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === sourceId)).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(sourceId);
    expect(view.prompts).toHaveLength(0);
  });
});
