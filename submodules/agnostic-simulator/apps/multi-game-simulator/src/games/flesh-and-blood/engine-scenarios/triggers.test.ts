import {
  commandForFabSubmission,
  projectFabInteraction,
} from "@tcg/flesh-and-blood-server-adapter";
import { buildInteractionSubmission } from "@tcg/protocol";
import { describe, expect, it } from "vitest";
import { getFabEngineScenario } from "./index";

describe("FAB engine scenarios · triggers", () => {
  it("submits adapter-labelled simultaneous ordering at the committed state version", () => {
    const match = getFabEngineScenario("trigger-decision-lab")?.boot();
    if (!match) throw new Error("Missing trigger decision lab scenario.");

    const initialWait = match.runtime.waitState();
    expect(initialWait.kind).toBe("decision");
    if (initialWait.kind !== "decision") return;
    expect(initialWait.decision).toMatchObject({
      kind: "ordering",
      stateVersion: match.runtime.getStateID(),
    });

    const projection = projectFabInteraction(match.runtime, match.player1Id);
    const action = projection.view.actions[0]!;
    const input = action.inputs[0];
    if (input?.kind !== "ordering") throw new Error("Expected trigger ordering input.");
    expect(input.candidates.map((candidate) => candidate.text?.key)).toEqual([
      "Snatch · Trigger Lab: trigger-lab-optional-draw",
      "Snatch · Trigger Lab: trigger-lab-destroy-aura",
    ]);

    const orderedIds = input.candidates.map((candidate) => candidate.entity.instanceId).reverse();
    const submission = buildInteractionSubmission({
      view: projection.view,
      action,
      values: { answer: orderedIds },
    });
    const command = commandForFabSubmission(match.runtime, match.player1Id, submission);
    expect(command).not.toBeNull();
    const result = match.runtime.dispatch(command!.move, match.player1Id, command!.payload);
    expect(result.accepted).toBe(true);
    const nextWait = match.runtime.waitState();
    expect(nextWait).toMatchObject({
      kind: "decision",
      decision: {
        kind: "entity-target",
        actorId: match.player1Id,
        min: 1,
        max: 1,
      },
    });
    if (nextWait.kind !== "decision" || nextWait.decision.kind !== "entity-target") return;
    expect(nextWait.decision.candidates).toHaveLength(2);
    expect(nextWait.decision.candidates.map((candidate) => candidate.label).sort()).toEqual([
      "Trigger Lab Aura",
      "Trigger Lab Aura Two",
    ]);
  });

  it("reaches a simultaneous two-source ordering decision after the hit", () => {
    const match = getFabEngineScenario("multiple-trigger-open")?.boot();
    if (!match) throw new Error("Missing multiple-trigger open scenario.");

    // This assertion intentionally examines the manual ordering branch;
    // override the fixture's user-facing auto-pass defaults for this one
    // rules-level scenario walk.
    match.engine.getState().automationPreferences = Object.fromEntries(
      [match.player1Id, match.player2Id].map((playerId) => [
        playerId,
        {
          priorityMode: "always-hold" as const,
          autoOrderTriggers: false,
          autoSelectSingletonTargets: false,
          playAndSkipHoldCardIds: [],
          opponentTriggerYieldCardIds: [],
          instantYieldCardIds: [],
        },
      ]),
    );

    // Play the Snatch · Multi-trigger attack as the active player and walk it
    // to the hit. The hero's "whenever an attack action card you control hits"
    // and the attack's own "when this hits" fire together (CR 6.6.6b).
    match.engine
      .as("fixture-multi-trigger-hero")
      .play("fixture-multi-trigger-hit-attack", { target: "player-2" });
    match.engine.passBoth(); // card layer -> attack
    match.engine.passBoth(); // attack -> defend
    match.engine.passBoth(); // defend -> reaction
    match.engine.passBoth(); // reaction -> damage -> simultaneous triggers

    const wait = match.runtime.waitState();
    expect(wait.kind).toBe("decision");
    if (wait.kind !== "decision") return;
    const decision = wait.decision;
    expect(decision.kind).toBe("ordering");
    if (decision.kind !== "ordering") return;

    // Two sources (hero + attack) produce one ordering decision. The pending
    // order is scan-dependent, so assert the set of ability labels.
    expect(new Set(decision.entries.map((entry) => entry.label))).toEqual(
      new Set([
        "Trigger Lab Hero: multi-trigger-hero-hit-draw",
        "Snatch · Multi-trigger: multi-trigger-attack-destroy-aura",
      ]),
    );
  });
});
