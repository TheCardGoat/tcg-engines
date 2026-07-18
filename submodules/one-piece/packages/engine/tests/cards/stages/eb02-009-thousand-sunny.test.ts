import { describe, expect, test } from "vite-plus/test";
import {
  eb02ThousandSunny009,
  op11NicoRobin009,
  op13RoronoaZoro037,
  op13Higuma013,
  op13Otama043,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-009 Thousand Sunny", () => {
  test("moves a chosen given DON!! card to a chosen Straw Hat Crew Character", () => {
    const engine = OnePieceTestEngine.create({
      stage: eb02ThousandSunny009,
      character: [
        { card: op13Higuma013, attachedDon: 1 },
        { card: op13Otama043, attachedDon: 1 },
        op13RoronoaZoro037,
        op11NicoRobin009,
      ],
    });
    const stageId = engine.findCardInZone("south", "stage", eb02ThousandSunny009);
    const selectedDonorId = engine.findCardInZone("south", "character", op13Higuma013);
    const unselectedDonorId = engine.findCardInZone("south", "character", op13Otama043);
    const selectedRecipientId = engine.findCardInZone("south", "character", op13RoronoaZoro037);
    const unselectedRecipientId = engine.findCardInZone("south", "character", op11NicoRobin009);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const sourceDecision = engine.pendingDecision("effectRedistributeDonSource", "south");
    const sourceStep = sourceDecision.steps[0];
    expect(sourceStep?.kind).toBe("selectEntity");
    if (sourceStep?.kind !== "selectEntity") {
      throw new Error("Expected Thousand Sunny to publish a DON!! source selection.");
    }
    expect(sourceStep.min).toBe(0);
    expect(sourceStep.max).toBe(1);
    expect(sourceStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selectedDonorId,
      unselectedDonorId,
    ]);

    engine.resolveDecision(
      "effectRedistributeDonSource",
      { selectedIds: [selectedDonorId] },
      "south",
    );

    const targetDecision = engine.pendingDecision("effectRedistributeDonTarget", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected Thousand Sunny to publish a DON!! recipient selection.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selectedRecipientId,
      unselectedRecipientId,
    ]);
    expect(targetStep.constraints).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "zones", label: "Zones: character" }),
        expect.objectContaining({ id: "trait", value: "Straw Hat Crew" }),
      ]),
    );

    engine.resolveDecision(
      "effectRedistributeDonTarget",
      { selectedIds: [selectedRecipientId] },
      "south",
    );

    const view = engine.getView("south");
    const characters = view.players.south.characters;
    expect(view.players.south.stage?.rested).toBe(true);
    expect(characters.find((card) => card?.instanceId === selectedDonorId)?.attachedDon).toBe(0);
    expect(characters.find((card) => card?.instanceId === unselectedDonorId)?.attachedDon).toBe(1);
    expect(characters.find((card) => card?.instanceId === selectedRecipientId)).toMatchObject({
      attachedDon: 1,
      power: 6000,
    });
    expect(characters.find((card) => card?.instanceId === unselectedRecipientId)).toMatchObject({
      attachedDon: 0,
      power: 4000,
    });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
