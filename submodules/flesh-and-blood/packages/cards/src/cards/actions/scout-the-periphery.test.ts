import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { scoutThePeripheryRed } from "./scout-the-periphery.ts";

/**
 * Scout the Periphery (AZL020) — "Look at the top card of target hero's deck.
 * The next attack action card you play from arsenal this turn gets +3{p}.
 * Go again" (red).
 *
 * The target hero is declared when the card is played (CR 1.8.5); the deck
 * top is a non-target subject scoped to that hero (CR 1.8.5c), so resolution
 * opens no card choice and never discloses the other deck's top (CR 8.5.11).
 */

describe("Scout the Periphery Red (AZL020) AAA", () => {
  it("happy: an attack from arsenal gets +3 power", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [scoutThePeripheryRed], arsenal: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(scoutThePeripheryRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();
    Dash.playAttack(snatchRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(7);
    expectFabCard(Dash, scoutThePeripheryRed).toBeIn("graveyard");
  });

  it("boundary: an attack from hand is not buffed", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [scoutThePeripheryRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    Dash.play(scoutThePeripheryRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();
    Dash.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("target: the hero is declared when played and only that deck top is looked at", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [scoutThePeripheryRed],
        actionPoints: 1,
        deckTop: [nimblismBlue],
        deck: 3,
      },
      { hero: bravo, hand: [], deckTop: [snatchRed], deck: 3 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);
    const scoutId = Dash.cardIn("hand", scoutThePeripheryRed).instanceId;

    // Playing without a declared hero opens the hero declaration, whose
    // candidates are the two heroes — never deck cards.
    game.exec({ move: "begin-play", actorId: Dash.id, payload: { instanceId: scoutId } });
    const decision = game.getState().decision;
    expect(decision).toMatchObject({ kind: "entity-target" });
    if (decision?.kind !== "entity-target") throw new Error("expected an entity-target decision");
    expect(decision.candidates).toHaveLength(2);
    for (const candidate of decision.candidates) {
      expect(candidate.target).toMatchObject({ kind: "player" });
    }

    // Declare the opposing hero: resolution looks at exactly that deck top.
    game.exec({
      move: "answer-decision",
      actorId: decision.actorId,
      payload: {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "entity-target", instanceIds: [Bravo.id] },
      },
    });
    game.helpers.resolveUntilIdle();

    const looks = game.committedEvents().filter((event) => event.name === "look");
    expect(looks).toHaveLength(1);
    expect(looks[0]!.data.object.canonicalId).toBe(snatchRed.canonicalId);
    expect(Dash.zone("deck").at(-1)).toBe(nimblismBlue.canonicalId);
  });
});
