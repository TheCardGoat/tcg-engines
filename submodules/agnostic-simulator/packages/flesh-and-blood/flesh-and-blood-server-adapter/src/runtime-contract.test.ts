import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { catalogIds } from "@tcg/flesh-and-blood-engine/automation";
import { toFabCardDefinition } from "@tcg/flesh-and-blood-engine/simulator";
import { fleshAndBloodStructuredCardsByCanonicalId } from "@tcg/flesh-and-blood-cards";
import { buildInteractionSubmission } from "@tcg/protocol";
import { FleshAndBloodServerEngine } from "./server-engine.ts";

const pilferTheTombBlue = fleshAndBloodStructuredCardsByCanonicalId.get("pQjcMbpRPhTG8DkHftnK9")!;
const sigilOfSolaceRed = fleshAndBloodStructuredCardsByCanonicalId.get("kzW8BKdWcm9LwtTCTdqRK")!;

function serverEngine() {
  const fixture = FabTestEngine.create({
    player1: { hand: [], deck: 8, actionPoints: 1 },
    player2: { hand: [], deck: 8, actionPoints: 1 },
  });
  return new FleshAndBloodServerEngine(fixture.getRuntime());
}

describe("FAB server adapter runtime contract", () => {
  it("maps a barrier-free priority pass to server-managed undo eligibility", () => {
    const engine = serverEngine();
    const result = engine.dispatch(
      "pass",
      "player-1",
      {},
      { gameId: "runtime-contract-pass", sourceAuthority: "server" },
    );

    expect(result).toMatchObject({ success: true, stateID: 1, undoable: true });
    if (!result.success) throw new Error(result.error);
    expect(result.analyticsFactBatchRecords).toEqual([
      expect.objectContaining({
        gameSlug: "flesh-and-blood",
        schemaVersion: 2,
        stateVersion: 1,
        facts: expect.any(Array),
      }),
    ]);
  });

  it("maps an information-exposing End Phase draw to an undo barrier", () => {
    const engine = serverEngine();
    const result = engine.dispatch(
      "end-turn",
      "player-1",
      {},
      { gameId: "runtime-contract-draw", sourceAuthority: "server" },
    );

    expect(result).toMatchObject({ success: true, stateID: 1, undoable: false });
    if (!result.success) throw new Error(result.error);
    expect(result.animationPlan).toMatchObject({
      version: 2,
      steps: expect.arrayContaining([
        expect.objectContaining({
          type: "entityTransfer",
          sourceFace: "hidden",
          destinationFace: "hidden",
          audioCue: "card.draw",
        }),
        expect.objectContaining({ type: "phaseChange", variant: "turn" }),
      ]),
    });
    const hiddenDraws = result.animationPlan?.steps.filter(
      (step) => step.type === "entityTransfer" && step.destinationFace === "hidden",
    );
    // Turn 1 refills both empty hands to intellect, but each player's refill
    // is one visual draw rather than four repeated card-transfer animations.
    expect(hiddenDraws).toHaveLength(2);
    expect(hiddenDraws?.map((step) => step.type === "entityTransfer" && step.quantity)).toEqual([
      4, 4,
    ]);
    expect(
      hiddenDraws?.every(
        (step) => step.type === "entityTransfer" && !step.entity.id.startsWith("fab-hidden:"),
      ),
    ).toBe(true);
    const serializedPlan = JSON.stringify(result.animationPlan);
    expect(serializedPlan).not.toContain("canonicalId");
    expect(serializedPlan).not.toContain("Runtime Contract Card");
    expect(serializedPlan).not.toContain("committedEvents");
  });

  it("returns a rules reversal without persistence side effects", () => {
    const fixture = FabTestEngine.create(
      {
        cardDefinitions: {
          [pilferTheTombBlue.canonicalId]: toFabCardDefinition(pilferTheTombBlue),
          [sigilOfSolaceRed.canonicalId]: toFabCardDefinition(sigilOfSolaceRed),
        },
        player1: {
          heroCardId: catalogIds.rhinar,
          hand: [pilferTheTombBlue.canonicalId],
          deck: 8,
          actionPoints: 1,
        },
        player2: {
          heroCardId: catalogIds.bravo,
          graveyard: [sigilOfSolaceRed.canonicalId],
          deck: 8,
        },
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const engine = new FleshAndBloodServerEngine(fixture.getRuntime());
    const handBefore = [
      ...fixture.getRuntime().getState().containers.zonesByPlayerId["player-1"]!.hand,
    ];
    const pilferId = handBefore[0]!;
    const context = { gameId: "runtime-contract-reversal", sourceAuthority: "server" } as const;

    expect(
      engine.dispatch("begin-play", "player-1", { instanceId: pilferId }, context),
    ).toMatchObject({
      success: true,
    });
    const modesView = engine.getInteractionView("player-1");
    const modesAction = modesView.actions[0]!;
    const modesInput = modesAction.inputs[0]!;
    if (modesInput.kind !== "option-selection") throw new Error("Expected mode selection.");
    const modesResult = engine.submitInteraction(
      "player-1",
      buildInteractionSubmission({
        view: modesView,
        action: modesAction,
        values: { answer: modesInput.options.map((option) => option.id) },
      }),
      context,
    );
    expect(modesResult.success).toBe(true);

    const targetView = engine.getInteractionView("player-1");
    const targetAction = targetView.actions[0]!;
    const targetInput = targetAction.inputs[0]!;
    if (targetInput.kind !== "entity-selection") throw new Error("Expected target selection.");
    const reversal = engine.submitInteraction(
      "player-1",
      buildInteractionSubmission({
        view: targetView,
        action: targetAction,
        values: { answer: [targetInput.candidates[0]!.entity.instanceId] },
      }),
      context,
    );

    expect(reversal).toMatchObject({
      success: true,
      outcome: {
        kind: "rules-action-reversed",
        action: "play-card",
        reason: { code: "required_targets_unavailable" },
      },
      animationPlan: null,
      undoable: false,
    });
    if (!reversal.success) throw new Error(reversal.error);
    expect(reversal.acceptedMoveRecord).toBeUndefined();
    expect(reversal.engineLogRecords).toBeUndefined();
    expect(reversal.analyticsFactBatchRecords).toEqual([
      expect.objectContaining({
        gameSlug: "flesh-and-blood",
        schemaVersion: 2,
        stateVersion: reversal.stateID,
        facts: [],
      }),
    ]);
    expect(fixture.getRuntime().getState().containers.zonesByPlayerId["player-1"]!.hand).toEqual(
      handBefore,
    );
    expect(fixture.getRuntime().waitState().kind).toBe("priority");
  });
});
