import { describe, expect, it } from "vite-plus/test";
import { EngineInteractionView, InteractionSubmission } from "@tcg/protocol";
import type { MatchState, MatchStaticResources, PendingChoicePrompt } from "@tcg/gundam-engine";
import { buildGundamInteractionView, gundamSubmissionToPayload } from "./interaction-protocol.js";

describe("Gundam interaction protocol adapter", () => {
  it("projects pending target choices into resolveEffect protocol actions", () => {
    const pendingChoice: PendingChoicePrompt = {
      kind: "targetSelection",
      effectId: "effect-1",
      controllerId: "p1",
      sourceCardId: "source-1",
      directiveIndex: 0,
      filter: { owner: "any" },
      minTargets: 1,
      maxTargets: 2,
      legalTargetIds: ["target-1", "target-2"],
      prompt: "Choose up to 2 targets.",
    };

    const parsed = EngineInteractionView.parse(
      buildGundamInteractionView({
        actorId: "p1",
        stateVersion: 9,
        state: minimalState(),
        staticResources: minimalStaticResources(),
        pendingChoice,
      }),
    );

    expect(parsed.status).toBe("choosing");
    expect(parsed.actions[0]).toMatchObject({ id: "resolveEffect", intent: "choose-targets" });
    expect(parsed.actions[0]?.inputs).toMatchObject([
      { kind: "option-selection", id: "pendingEffectId" },
      { kind: "entity-selection", id: "targets", min: 1, max: 2 },
    ]);
  });

  it("translates a deploy-card interaction into the engine's cardId payload", () => {
    const submission = InteractionSubmission.parse({
      protocolVersion: 1,
      stateVersion: 5,
      requestId: "gundam:5:deployUnit",
      actionId: "deployUnit",
      values: { cardId: "unit-1" },
    });

    expect(gundamSubmissionToPayload(submission)).toEqual({
      moveType: "deployUnit",
      payload: { cardId: "unit-1" },
    });
  });

  it("translates pending effect answers into resolveEffect args", () => {
    const submission = InteractionSubmission.parse({
      protocolVersion: 1,
      stateVersion: 5,
      requestId: "gundam:5:resolveEffect:effect-1",
      actionId: "resolveEffect",
      values: {
        pendingEffectId: "effect-1",
        targets: ["target-1"],
        "optionalAnswers.0": true,
        "chooseOneAnswers.1": 2,
        "deckLookAnswers.2.toTop": ["card-1"],
        "deckLookAnswers.2.tutorCardId": "card-2",
      },
    });

    expect(gundamSubmissionToPayload(submission)).toEqual({
      moveType: "resolveEffect",
      payload: {
        pendingEffectId: "effect-1",
        targets: ["target-1"],
        optionalAnswers: { 0: true },
        chooseOneAnswers: { 1: 2 },
        deckLookAnswers: { 2: { toTop: ["card-1"], tutorCardId: "card-2" } },
      },
    });
  });
});

function minimalState(): MatchState {
  return {
    ctx: {
      status: {
        gameEnded: false,
        activePlayer: "p1",
      },
    },
  } as MatchState;
}

function minimalStaticResources(): MatchStaticResources {
  return {} as MatchStaticResources;
}
