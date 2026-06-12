import { describe, expect, it } from "vite-plus/test";
import { INTERACTION_PROTOCOL_VERSION, type InteractionSubmission } from "@tcg/protocol";
import type {
  LocalEngine,
  MatchState,
  MatchStaticResources,
  PendingChoicePrompt,
} from "@tcg/gundam-engine";
import { GundamServerEngine } from "./gundam-server-engine.js";

describe("GundamServerEngine interaction submission", () => {
  it("rejects invalid protocol values before native command dispatch", () => {
    const calls: unknown[] = [];
    const pendingChoice: PendingChoicePrompt = {
      kind: "targetSelection",
      effectId: "effect-1",
      controllerId: "p1",
      sourceCardId: "source-1",
      directiveIndex: 0,
      filter: { owner: "any" },
      minTargets: 1,
      maxTargets: 1,
      legalTargetIds: ["target-1"],
      prompt: "Choose a target.",
    };
    const engine = new GundamServerEngine(
      {
        getStateID: () => 5,
        getState: () =>
          ({
            ctx: { status: { gameEnded: false, activePlayer: "p1" } },
          }) as MatchState,
        getRuntime: () => ({
          getPendingChoice: () => pendingChoice,
        }),
        executeCommand: (command: unknown) => {
          calls.push(command);
          return { success: true };
        },
      } as unknown as LocalEngine,
      {} as MatchStaticResources,
    );
    const submission: InteractionSubmission = {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: 5,
      requestId: "gundam:5:resolveEffect:effect-1",
      actionId: "resolveEffect",
      values: {
        pendingEffectId: "effect-1",
        targets: ["target-2"],
      },
    };

    const result = engine.submitInteraction("p1", submission, {
      gameId: "g1",
      sourceAuthority: "server",
    });

    expect(result.success).toBe(false);
    expect((result as import("@tcg/shared/game-engine").DispatchFailure).errorCode).toBe(
      "invalid_interaction_submission",
    );
    expect(calls).toEqual([]);
  });
});
