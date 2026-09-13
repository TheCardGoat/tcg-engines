import { describe, expect, test } from "vite-plus/test";
import { defOf } from "@tcg/cyberpunk-engine";
import { buildCyberpunkInteractionView } from "@tcg/cyberpunk-server-adapter/interaction-protocol";
import { getScenario, P1 } from "./fixtures/scenarios";
import { getProgramSpatialTargets } from "./programTargets";

describe("getProgramSpatialTargets", () => {
  test("does not collapse a Program that can select two Units into the single-target shortcut", () => {
    const engine = getScenario("progBonnieAndClyde").build();
    const state = engine.getState();
    const program = engine.getCardsInZone("hand", P1)[0];
    expect(program).toBeDefined();

    const interactionView = buildCyberpunkInteractionView({
      actorId: P1,
      stateVersion: state.ctx.stateID,
      prompt: engine.getPrompt(P1),
    });

    expect(
      getProgramSpatialTargets(
        {
          matchState: state,
          side: "player",
          interactionView,
        },
        program!.instanceId,
      ),
    ).toEqual([]);
  });

  test("does not pre-highlight a chained if-you-do target before its first choice", () => {
    const engine = getScenario("retailScrapedReleaseAug2026Qa").build();
    const state = engine.getState();
    const program = engine
      .getCardsInZone("hand", P1)
      .find((card) => defOf(card).displayName === "Unlikely Bond");
    expect(program).toBeDefined();

    const interactionView = buildCyberpunkInteractionView({
      actorId: P1,
      stateVersion: state.ctx.stateID,
      prompt: engine.getPrompt(P1),
    });

    expect(
      getProgramSpatialTargets(
        {
          matchState: state,
          side: "player",
          interactionView,
        },
        program!.instanceId,
      ),
    ).toEqual([]);
  });
});
