import { eb01Doma005 } from "@tcg/op-cards";
import type { CharacterCard } from "@tcg/op-types";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04MsWednesday083 } from "../../../../../cards/src/cards/OP14EB04/characters/083-ms-wednesday.ts";
import { registerCards } from "../../../../../cards/src/runtime-catalog.ts";

import { OnePieceTestEngine } from "../../../index.ts";

const zeroCostTarget: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-OP14-083-ZERO-COST",
  canonicalId: "TEST-OP14-083-ZERO-COST",
  name: "Zero-cost target",
  cost: 0,
};

registerCards([zeroCostTarget]);

describe("OP14-083 Ms. Wednesday", () => {
  test("may trash itself to give one opposing current-cost-0 Character minus 3000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04MsWednesday083] },
      { character: [zeroCostTarget, eb01Doma005] },
    );
    const sourceId = engine.findCardInZone("south", "character", op14eb04MsWednesday083);
    const eligibleId = engine.findCardInZone("north", "character", zeroCostTarget);
    const ineligibleId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Ms. Wednesday's target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sourceId);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.power,
    ).toBe((zeroCostTarget.power ?? 0) - 3000);
    engine.endTurn("south");
    view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.power,
    ).toBe(zeroCostTarget.power);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without trashing itself", () => {
    const engine = OnePieceTestEngine.create({ character: [op14eb04MsWednesday083] });
    const sourceId = engine.findCardInZone("south", "character", op14eb04MsWednesday083);

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(sourceId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
