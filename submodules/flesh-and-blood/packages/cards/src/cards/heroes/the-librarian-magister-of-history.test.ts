import { describe, expect, it } from "vitest";
import { expectFabCard, expectFabPlayer, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";
import { theLibrarianMagisterOfHistory } from "./the-librarian-magister-of-history.ts";

/**
 * The Librarian, Magister of History (JDG062) — Light Adjudicator Hero — 20hp.
 *
 * Printed: "You may have cards with Tome in their name of any class or talent
 * in your deck. Action - {t}, reveal a card with Tome in its name from your
 * inventory: Put it into your hand. Another target hero gets +1{i} until the
 * end of their next turn. Go again"
 *
 * Reveal-from-inventory is an activation cost that stamps `revealed-this-way`
 * onto the layer; "Put it into your hand" moves that binding.
 */

const opponentHero = dash;

describe("the-librarian-magister-of-history (JDG062) AAA", () => {
  it("happy: revealing a Tome taps the hero, gives another hero +1{i}, and go again refunds", () => {
    const game = FabTestEngine.start(
      {
        hero: theLibrarianMagisterOfHistory,
        hand: [],
        inventory: [tomeOfFyendalYellow],
        deck: 6,
        actionPoints: 2,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Librarian = game.as(theLibrarianMagisterOfHistory);
    const Opponent = game.as(opponentHero);
    const intellectBefore = Opponent.intellect();

    Librarian.activate(theLibrarianMagisterOfHistory);
    game.passBoth();

    expectFabCard(Librarian, tomeOfFyendalYellow).toBeIn("hand");
    expect(Librarian.zone("inventory")).not.toContain(tomeOfFyendalYellow.canonicalId);
    // The handle's intellect view includes the continuous +1{i} buff.
    expect(Opponent.intellect()).toBe(intellectBefore + 1);
    // −1 AP for the action ability, +1 from go again.
    expectFabPlayer(Librarian).toHaveAP(2);
    expectFabCard(Librarian, theLibrarianMagisterOfHistory).toBeTapped();
  });

  it("boundary: without a Tome in inventory the activation is illegal", () => {
    const game = FabTestEngine.start(
      { hero: theLibrarianMagisterOfHistory, deck: 6, actionPoints: 1 },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Librarian = game.as(theLibrarianMagisterOfHistory);

    Librarian.expectActivationRejected(theLibrarianMagisterOfHistory);
  });
});
