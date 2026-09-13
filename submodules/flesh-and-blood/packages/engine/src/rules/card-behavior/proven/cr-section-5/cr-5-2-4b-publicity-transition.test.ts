/**
 * CR 5.2.4b — when a player activates an ability of a private source, the
 * source becomes public until the activated-layer resolves or ceases to exist.
 * "When an object becomes public this way, it does not trigger any abilities
 * and cannot be replaced by any replacement effects."
 *
 * The engine never routes the hand→stack visibility change through the trigger
 * or replacement engines, so this is a pin on that invariant: activating
 * Vigorous Windup (HVY186) — an Instant "Discard this" ability functional
 * while the card is private in its owner's hand — produces ONLY the
 * activated-layer on the stack and commits no triggered-layer and no
 * replacement event for the publicity transition.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../index.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { vigorousWindupRed } from "../../../../../../cards/src/cards/actions/vigorous-windup.ts";

describe("CR 5.2.4b — a private source becoming public during activation fires no triggers/replacements", () => {
  it("activating Vigorous Windup from hand emits only the activated-layer (no triggered-layer, no replacement event)", () => {
    // Dash is the turn player (player 1) and holds priority in her action
    // phase, so she may activate her hand's instant ability directly.
    const game = FabTestEngine.start(
      { hero: dash, life: 15, hand: [vigorousWindupRed], deck: 6 },
      { hero: bravo, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    // Dash activates the private (hand) source's instant ability.
    game.as(dash).activate(vigorousWindupRed);

    // The hand→stack visibility change must not generate a triggered-layer.
    const stack = game.getState().rulesStack;
    expect(stack).toHaveLength(1);
    expect(stack.at(-1)).toMatchObject({ kind: "activated" });

    // No committed event names a publicity/visibility trigger or replacement.
    const publicityLike = game
      .committedEvents()
      .filter((event) => /public|private|reveal|face|visibility/i.test(event.name));
    expect(publicityLike).toEqual([]);
  });
});
