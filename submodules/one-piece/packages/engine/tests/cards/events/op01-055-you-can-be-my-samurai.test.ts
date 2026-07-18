import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb01Sanji014,
  op01YouCanBeMySamurai055,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-055 You Can Be My Samurai!!", () => {
  test("lets the controller choose exactly 2 active Characters to rest before drawing 2", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01YouCanBeMySamurai055],
      deck: [eb01MountainGod018, eb01Sanji014],
      character: [eb01Doma005, eb01Fourtricks025, eb01Sanji014],
      activeDon: 1,
    });
    const eventId = engine.findCardInZone("south", "hand", op01YouCanBeMySamurai055);
    const firstSelectedId = engine.findCardInZone("south", "character", eb01Doma005);
    const secondSelectedId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const unselectedId = engine.findCardInZone("south", "character", eb01Sanji014);
    const firstDrawId = engine.findCardInZone("south", "deck", eb01MountainGod018);
    const secondDrawId = engine.findCardInZone("south", "deck", eb01Sanji014);

    engine.playCard(op01YouCanBeMySamurai055);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const costDecision = engine.pendingDecision("effectCostRestCards", "south");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected the controller to receive the two-Character rest cost.");
    }
    expect(costStep).toMatchObject({ min: 2, max: 2 });
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstSelectedId,
      secondSelectedId,
      unselectedId,
    ]);
    engine.resolveDecision(
      "effectCostRestCards",
      { selectedIds: [firstSelectedId, secondSelectedId] },
      "south",
    );

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === firstSelectedId)?.rested,
    ).toBe(true);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === secondSelectedId)?.rested,
    ).toBe(true);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === unselectedId)?.rested,
    ).toBe(false);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([
      firstDrawId,
      secondDrawId,
    ]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
