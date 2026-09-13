/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: trigger:deal-damage
 * Representative card: packages/cards/src/cards/actions/talisman-of-warfare.ts
 * Canonical id: prmFpdjrdCqD9hDmHTfPK
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
import { describe, expect, it } from "vitest";
import { talismanOfWarfareYellow } from "../../../../../../cards/src/cards/actions/talisman-of-warfare.ts";
import { dustRunnerOutlawBlue } from "../../../../../../cards/src/cards/actions/dust-runner-outlaw.ts";
import { FabTestEngine, expectFabCard } from "../../../../index.ts";
import { bravo, dash, heartOfFyendal, snatchRed } from "../../../fixtures.ts";

describe("trigger: deal-damage", () => {
  it("AAA: Talisman of Warfare fires on exactly 2 damage to a hero, destroying itself and all arsenals (EVR193)", () => {
    // CR 6.6.3: dustRunnerOutlawBlue has power 2 — exactly matching the
    // comparison guard on Talisman of Warfare's deal-damage trigger.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [talismanOfWarfareYellow],
        hand: [dustRunnerOutlawBlue],
        deck: 6,
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, arsenal: [heartOfFyendal], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    // CR 7.5.2: Act with an undefended 2-damage hit.
    game.as(bravo).attackWith(dustRunnerOutlawBlue);
    for (let i = 0; i < 20; i += 1) {
      const decision = game.getState().decision;
      if (decision?.kind === "ordering" && decision.entries.length > 0) {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: {
              kind: "ordering",
              orderedIds: decision.entries.map((e) => e.id),
            },
          },
        });
        continue;
      }
      if (decision?.kind === "entity-target" && decision.candidates.length > 0) {
        game.exec({
          move: "answer-decision",
          actorId: decision.actorId,
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: {
              kind: "entity-target",
              instanceIds: decision.candidates.slice(0, decision.max ?? 1).map((c) => c.instanceId),
            },
          },
        });
        continue;
      }
      if (!game.getState().combat?.open && game.getState().rulesStack.length === 0 && !decision)
        break;
      try {
        game.passBoth();
      } catch {
        break;
      }
    }

    // Assert — Talisman fired on exactly 2 damage: self destroyed and arsenals emptied.
    expect(game.as(bravo).zone("arena").includes(talismanOfWarfareYellow.canonicalId)).toBe(false);
    expect(game.as(dash).zone("arsenal").length).toBe(0);
  });

  it("Arrange/Act/Assert: damage other than exactly 2 does not fire Talisman of Warfare", () => {
    // CR 6.6.3: Arrange the same permanent but a 4-power real attack.
    const game = FabTestEngine.start(
      { hero: bravo, arena: [talismanOfWarfareYellow], hand: [snatchRed], deck: 6 },
      { hero: dash, arsenal: [heartOfFyendal], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    // CR 7.5.2: Act with an undefended 4-damage hit.
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    // CR 6.6.3: Assert the comparison condition prevented the trigger.
    expectFabCard(game.as(bravo), talismanOfWarfareYellow).toBeIn("arena");
    expectFabCard(game.as(dash), heartOfFyendal).toBeIn("arsenal");
  });
});
