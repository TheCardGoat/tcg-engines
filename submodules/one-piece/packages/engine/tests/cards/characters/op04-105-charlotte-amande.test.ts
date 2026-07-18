import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op03Napoleon117,
  op03CharlottePerospero113,
  op04CharlotteAmande105,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-105 Charlotte Amande", () => {
  test("trashes only a Trigger card to rest an opposing cost-2-or-less Character once per turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op04CharlotteAmande105],
        hand: [op03Napoleon117, op03CharlottePerospero113, eb01Doma005],
      },
      { character: [eb01Doma005, eb01Fourtricks025] },
    );
    const amandeId = engine.findCardInZone("south", "character", op04CharlotteAmande105);
    const triggerId = engine.findCardInZone("south", "hand", op03Napoleon117);
    const otherTriggerId = engine.findCardInZone("south", "hand", op03CharlottePerospero113);
    const nonTriggerId = engine.findCardInZone("south", "hand", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const highCostId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.activateEffect(amandeId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Amande's Trigger-card cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([
      triggerId,
      otherTriggerId,
    ]);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonTriggerId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [triggerId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Amande's rest target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(triggerId);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: amandeId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("may decline without trashing a Trigger card or resting the opponent", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04CharlotteAmande105], hand: [op03Napoleon117] },
      { character: [eb01Doma005] },
    );
    const amandeId = engine.findCardInZone("south", "character", op04CharlotteAmande105);
    const triggerId = engine.findCardInZone("south", "hand", op03Napoleon117);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.activateEffect(amandeId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(triggerId);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay the Trigger-card cost and choose no opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04CharlotteAmande105], hand: [op03Napoleon117] },
      { character: [eb01Doma005] },
    );
    const amandeId = engine.findCardInZone("south", "character", op04CharlotteAmande105);
    const triggerId = engine.findCardInZone("south", "hand", op03Napoleon117);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.activateEffect(amandeId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(triggerId);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
