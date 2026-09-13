import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { palantirAeronoughtRed } from "@tcg/flesh-and-blood-cards/cards/actions/palantir-aeronought";
import { maskOfMomentum } from "@tcg/flesh-and-blood-cards/cards/equipment/mask-of-momentum";
import { sinkBelowRed } from "@tcg/flesh-and-blood-cards/cards/defense-reactions/sink-below";
import { bravo } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { rhinar } from "@tcg/flesh-and-blood-cards/cards/heroes/rhinar";
import { snatchRed } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { machoGrandeBlue } from "@tcg/flesh-and-blood-cards/cards/actions/macho-grande";
import { buildInteractionSubmission } from "@tcg/protocol";
import { FleshAndBloodServerEngine } from "./server-engine.ts";

// Public interaction contract: arbitrary-size selections still receive engine rules validation.
describe("FAB server defense selection", () => {
  it.each([true, false])(
    "retains hand co-defenders under equipment requirements (equipment: %s)",
    (equipment) => {
      const game = FabTestEngine.start(
        { hero: dash, hand: [palantirAeronoughtRed], resourcePoints: 2, deck: [snatchRed] },
        {
          hero: bravo,
          head: equipment ? [maskOfMomentum] : [],
          hand: [snatchRed, sinkBelowRed],
          arsenal: [snatchRed],
          deck: [snatchRed],
        },
        FAB_MANUAL_HARNESS,
      );
      game.as(dash).playAttack(palantirAeronoughtRed);
      const engine = new FleshAndBloodServerEngine(game.getRuntime());
      const actorId = game.as(bravo).id;
      const view = engine.getInteractionView(actorId);
      const action = view.actions.find((entry) => entry.id === "fab:control:defend");
      const input = action?.inputs[0];
      if (!action || input?.kind !== "entity-selection")
        throw new Error("Missing defense selection");
      const handId = game.as(bravo).cardsIn("hand", snatchRed)[0]!.instanceId;
      const equipmentIds = game
        .as(bravo)
        .cardsIn("head", maskOfMomentum)
        .map((card) => card.instanceId);
      const ids = input.candidates.map((candidate) => candidate.entity.instanceId);
      expect(ids).toEqual([handId, ...equipmentIds]);
      const context = { gameId: "required-equipment", sourceAuthority: "server" } as const;
      if (equipment) {
        const rejected = engine.submitInteraction(
          actorId,
          buildInteractionSubmission({ view, action, values: { defenders: [handId] } }),
          context,
        );
        expect(rejected.success).toBe(false);
        expect(engine.getStateID()).toBe(view.stateVersion);
      }
      const accepted = engine.submitInteraction(
        actorId,
        buildInteractionSubmission({ view, action, values: { defenders: ids } }),
        context,
      );
      expect(accepted.success).toBe(true);
      expect(
        engine.getInteractionView(actorId).actions.some((entry) => entry.id === action.id),
      ).toBe(false);
    },
  );
  it("rejects two hand defenders against dominate without consuming the declaration", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [machoGrandeBlue], resourcePoints: 7, deck: [snatchRed] },
      { hero: rhinar, hand: [snatchRed, snatchRed], deck: [snatchRed] },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).playAttack(machoGrandeBlue);
    const engine = new FleshAndBloodServerEngine(game.getRuntime());
    const actorId = game.as(rhinar).id;
    const view = engine.getInteractionView(actorId);
    const action = view.actions.find((entry) => entry.id === "fab:control:defend");
    const input = action?.inputs[0];
    if (!action || input?.kind !== "entity-selection") throw new Error("Missing defense selection");
    const ids = input.candidates.map((candidate) => candidate.entity.instanceId);
    expect(ids).toHaveLength(2);
    const context = { gameId: "defense-selection", sourceAuthority: "server" } as const;
    const rejected = engine.submitInteraction(
      actorId,
      buildInteractionSubmission({
        view,
        action,
        values: { defenders: ids },
      }),
      context,
    );
    expect(rejected.success).toBe(false);
    expect(engine.getStateID()).toBe(view.stateVersion);
    const accepted = engine.submitInteraction(
      actorId,
      buildInteractionSubmission({
        view,
        action,
        values: { defenders: ids.slice(0, 1) },
      }),
      context,
    );
    expect(accepted.success).toBe(true);
    expect(engine.getInteractionView(actorId).actions.some((entry) => entry.id === action.id)).toBe(
      false,
    );
  });
});
