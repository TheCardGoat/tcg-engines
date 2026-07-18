import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb02FakeStrawHatCrew005, eb03Makino009 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-009 Makino", () => {
  test("rests itself before giving +2000 only to a Character with no base effect", () => {
    const engine = OnePieceTestEngine.create({
      character: [eb03Makino009, eb01Doma005, eb02FakeStrawHatCrew005],
    });
    const makinoId = engine.findCardInZone("south", "character", eb03Makino009);
    const vanillaId = engine.findCardInZone("south", "character", eb01Doma005);
    const effectfulId = engine.findCardInZone("south", "character", eb02FakeStrawHatCrew005);

    engine.activateEffect(makinoId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") {
      throw new Error("Expected Makino's effectless Character target.");
    }
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([vanillaId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(effectfulId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [vanillaId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === makinoId)?.rested,
    ).toBe(true);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === vanillaId)?.power,
    ).toBe(5000);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
