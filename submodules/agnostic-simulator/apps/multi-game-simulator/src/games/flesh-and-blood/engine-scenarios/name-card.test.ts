import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { describe, expect, it } from "vitest";

import { getFabEngineScenario } from "./index";

const NAME_CARD_SCENARIO_IDS = [
  "name-card-blessing-of-themis",
  "name-card-censor",
  "name-card-chains-of-eminence",
  "name-card-head-leads-the-tail",
  "name-card-imperial-edict",
  "name-card-leave-em-speechless",
  "name-card-null-time-zone",
  "name-card-phantasmal-symbiosis",
  "name-card-pick-a-card-any-card",
  "name-card-retrace-the-past",
  "name-card-shapeless-form",
  "name-card-shifting-winds-of-the-mystic-beast",
  "name-card-talisman-of-cremation",
  "name-card-hunter-or-hunted",
  "name-card-mask-of-many-faces",
  "name-card-embody-greatness",
] as const;

describe("FAB engine scenarios · name a card", () => {
  it.each(NAME_CARD_SCENARIO_IDS)(
    "%s reaches a real card-name decision and publishes the chosen name",
    (scenarioId) => {
      const scenario = getFabEngineScenario(scenarioId);
      const match = scenario?.boot();
      if (!scenario || !match) throw new Error(`Missing ${scenarioId}.`);

      expect(scenario.group).toBe("name-card");
      expect(scenario.botMode).toBe("off");
      const wait = match.runtime.waitState();
      if (
        wait.kind !== "decision" ||
        wait.decision.kind !== "effect-resolution" ||
        wait.decision.presentation?.kind !== "card-name"
      ) {
        throw new Error(`${scenarioId} did not stop at a semantic card-name decision.`);
      }
      expect(wait.decision.actorId).toBe(
        match[scenario.viewerId === "player-1" ? "player1Id" : "player2Id"],
      );
      expect(wait.decision.options.length).toBeGreaterThan(0);
      expect(wait.decision.options.every((option) => option.id.startsWith("fab-card-name:"))).toBe(
        true,
      );

      const chosen = wait.decision.options[0]!;
      const game = FabTestEngine.fromRuntime(match.runtime);
      game.answerDecision(wait.decision.actorId, {
        kind: "effect-resolution",
        optionId: chosen.id,
      });

      expect(game.renderedPlayerNarrative(wait.decision.actorId)).toContain(
        `You named ${chosen.label}.`,
      );
    },
  );

  it("keeps a looked opposing hand available only as an actor-private shortcut", () => {
    const scenario = getFabEngineScenario("name-card-pick-a-card-any-card");
    const match = scenario?.boot();
    if (!scenario || !match) throw new Error("Missing Pick a Card, Any Card scenario.");

    const actorWait = match.runtime.waitState();
    if (actorWait.kind !== "decision" || actorWait.decision.kind !== "effect-resolution") {
      throw new Error("Expected Pick a Card, Any Card naming decision.");
    }
    const suggestion = actorWait.decision.presentation?.suggestionGroups.find(
      (group) => group.id === "revealed-this-resolution",
    );
    expect(suggestion?.optionIds).toHaveLength(1);

    // The shared adapter publishes decision actions only to the actor. The
    // opposing seat cannot recover the looked hand from this engine decision.
    expect(actorWait.decision.actorId).toBe(match.player1Id);
    expect(scenario.viewerId).toBe("player-1");
  });
});
