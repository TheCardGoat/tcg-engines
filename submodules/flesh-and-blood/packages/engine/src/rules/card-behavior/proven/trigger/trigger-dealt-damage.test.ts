/**
 * GENERATED AAA PLAN — do not mark complete without production proof.
 * Behavior: trigger:dealt-damage
 * Representative card: packages/cards/src/cards/actions/boulder-drop.ts
 * Canonical id: tJftFH7gQMpj7cQtCdQ76
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
import { FabTestEngine, expectFabCard, expectFabPlayer } from "../../../../index.ts";
import { boulderDropRed } from "../../../../../../cards/src/cards/actions/boulder-drop.ts";
import { bravo, dash, nimblismRed, snatchRed } from "../../../fixtures.ts";

describe("trigger: dealt-damage", () => {
  it("AAA: Boulder Drop dealing 4+ forces the damaged hero to top-deck a hand card (CR 6.6.4, 7.5.5)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [boulderDropRed], deck: 6 },
      { hero: dash, life: 40, hand: [snatchRed], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(dash);

    // Act: undefended 7-power hit fires the 4+-damage comparison trigger.
    game.as(bravo).attackWith(boulderDropRed);
    game.helpers.resolveRestOfCombat();

    // Assert: the forced single-candidate selection top-decked the hand card.
    expectFabPlayer(Defender).toHaveLife(33);
    expectFabPlayer(Defender).toHaveHandCount(0);
    expect(Defender.zone("deck").length).toBe(7);
    // Deck sits outside the default ref scope; capture the instance directly.
    const topdecked = Defender.cardIn("deck", snatchRed);
    expectFabCard(Defender, topdecked).toBeIn("deck");
  });

  it("AAA boundary: damage below the 4 threshold does not fire the trigger", () => {
    // Use plain defense-2 actions (no hit-draw) so boundary state stays clean.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [boulderDropRed], deck: 6 },
      { hero: dash, life: 40, hand: [nimblismRed, nimblismRed, nimblismRed], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(dash);

    // 3 x defense-2 blocks reduce 7 power to 1 damage — under the threshold.
    game.as(bravo).attackWith(boulderDropRed);
    Defender.blockWith([nimblismRed, nimblismRed, nimblismRed]);
    // Answer any ordering decisions that arise while closing combat.
    for (let i = 0; i < 12; i += 1) {
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
      if (
        !game.getState().combat?.open &&
        game.getState().rulesStack.length === 0 &&
        !game.getState().decision
      )
        break;
      try {
        game.passBoth();
      } catch {
        break;
      }
    }

    expectFabPlayer(Defender).toHaveLife(39);
    expectFabPlayer(Defender).toHaveHandCount(0);
    expect(Defender.zone("deck").length).toBe(6);
    expect(Defender.zone("graveyard").length).toBe(3);
  });
});
