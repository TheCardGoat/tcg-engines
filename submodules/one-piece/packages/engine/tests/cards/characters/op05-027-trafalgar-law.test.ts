import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op05TrafalgarLaw027 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-027 Trafalgar Law", () => {
  test("may trash itself to rest only an opposing cost-3-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05TrafalgarLaw027] },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const lawId = engine.findCardInZone("south", "character", op05TrafalgarLaw027);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const ineligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(lawId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Law's rest target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(lawId);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === ineligibleId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without trashing itself or resting a target", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05TrafalgarLaw027] },
      { character: [eb01Doma005] },
    );
    const lawId = engine.findCardInZone("south", "character", op05TrafalgarLaw027);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.activateEffect(lawId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === lawId)).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
