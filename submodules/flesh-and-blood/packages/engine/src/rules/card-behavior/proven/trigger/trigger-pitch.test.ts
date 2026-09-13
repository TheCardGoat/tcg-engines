/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: trigger:pitch
 * Representative card: packages/cards/src/cards/resources/eye-of-ophidia.ts
 * Canonical id: N77hdGp96fNQnzc79hqN9
 *
 * Arrange: import the representative real card and establish a legal,
 * player-reachable match state with the required heroes, zones, resources,
 * targets, counters, and opponent responses.
 * Act: dispatch only production FabTestEngine moves (play, pitch, defend,
 * resolve prompts, pass priority, and end the relevant phase).
 * Assert: verify player-visible outcomes such as life, zones, AP/resources,
 * combat state, prompts, legality error codes, or game result. Include the
 * negative/boundary case and any timing or interaction case before completion.
 */
import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "../../../../index.ts";
import { bravo, dash, heartOfFyendal, nimbleStrikeRed } from "../../../fixtures.ts";
import { createFabLoopGuard } from "@tcg/flesh-and-blood-types";

/** Resolve triggered layers created by a pitch trigger, then pass. */
function resolvePendingTriggers(game: FabTestEngine): void {
  const triggerGuard = createFabLoopGuard({ label: "trigger-pitch: resolve pending triggers" });
  while (true) {
    triggerGuard.tick();
    const decision = game.getState().decision;
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "ordering", orderedIds: decision.entries.map((e) => e.id) },
        },
      });
      continue;
    }
    if (decision || game.getState().rulesStack.at(-1)?.kind !== "triggered") return;
    game.passBoth();
  }
}

describe("trigger: pitch", () => {
  it("Arrange/Act/Assert: Heart of Fyendal gains life when pitched while behind", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 10,
        hand: [heartOfFyendal, nimbleStrikeRed],
        deck: 4,
        resourcePoints: 0,
      },
      { hero: dash, life: 15, deck: 4 },
      // Walks priority/pitch timing by hand — pitch triggers need manual resolution.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    game.as(bravo).play(nimbleStrikeRed, { target: game.as(dash).id, pitch: [heartOfFyendal] });
    resolvePendingTriggers(game);

    expectFabPlayer(game.as(bravo)).toHaveLife(11);
    expectFabCard(game.as(bravo), heartOfFyendal).toBeIn("pitch");
  });

  it("Arrange/Act/Assert: Heart of Fyendal does not gain life while ahead", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 15,
        hand: [heartOfFyendal, nimbleStrikeRed],
        deck: 4,
        resourcePoints: 0,
      },
      { hero: dash, life: 10, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    game.as(bravo).play(nimbleStrikeRed, { target: game.as(dash).id, pitch: [heartOfFyendal] });

    expectFabPlayer(game.as(bravo)).toHaveLife(15);
  });
});
