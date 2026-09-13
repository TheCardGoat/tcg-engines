import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { toeTheLineRed } from "./toe-the-line.ts";

/**
 * Toe the Line (AHA015) — Warrior Instant, cost 0.
 *
 * Printed: "The next time you would be dealt damage this turn, prevent 2 of
 * that damage. If you prevent damage this way, create a Flurry token."
 *
 * fab-rules Mode B handoff:
 *   citations: CR 6.4.10/6.4.10a (the prevention waits for the next damage
 *     event this turn), CR 6.4.10h ("If you prevent damage this way, create …"
 *     is an additional modification of that prevention, applied during damage
 *     application only when the prevented amount is greater than 0), CR 4.4
 *     (instants are playable in the reaction window).
 *   MODULE DEFECT RESOLVED (plan §5, W3-FIX3 2026-08-18): the Flurry follow-up
 *     was encoded as a resolution-time sequence conditional gated on the
 *     unhandled `prevented-damage-this-way` marker (fail-loud trapdoor on
 *     every play). Re-encoded onto the prevention step as a create-token
 *     additionalModification (CR 6.4.10h; authoring shape HVY140/HVY160/
 *     HVY180) — the engine fires it at damage time when preventedAmount > 0.
 *   testImplications:
 *     - Snatch (4{p}) unblocked after the instant resolves in the reaction
 *       window: 2 prevented (Hala is a 40-health hero: 40→38), exactly one
 *       Flurry token.
 *     - No damage event this turn: the follow-up never fires — no token.
 *     - The prevention is single-use: the second attack resolves fully and no
 *       second Flurry token appears.
 */

describe("Toe the Line (AHA015) AAA", () => {
  it("happy: next damage this turn is reduced by 2 and creates one Flurry token", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: halaBladesaintOfTheVow, hand: [toeTheLineRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Hala = game.as(halaBladesaintOfTheVow);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(dash).pass();
    Hala.play(toeTheLineRed);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    // Snatch's 4 damage: 2 prevented (CR 6.4.10), so 2 lands (Hala is a
    // 40-health hero) — and the prevented amount > 0 fired the Flurry
    // additionalModification (6.4.10h).
    expectFabPlayer(Hala).toHaveLife(38);
    expectFabPlayer(Hala).toHaveTokenCount("flurry", 1);
    expectFabCard(Hala, toeTheLineRed).toBeIn("graveyard");
  });

  it("boundary: no damage event this turn → the Flurry follow-up never fires", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        hand: [toeTheLineRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    // The play resolves cleanly: the prevention registers and waits for the
    // next damage event (CR 6.4.10/6.4.10a). The create-token follow-up rides
    // damage application, so without a damage event nothing is created.
    Hala.play(toeTheLineRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Hala, toeTheLineRed).toBeIn("graveyard");
    expectFabPlayer(Hala).toHaveTokenCount("flurry", 0);
  });

  it("timing: the prevention is single-use — the second attack resolves fully", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
      { hero: halaBladesaintOfTheVow, hand: [toeTheLineRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);
    const Dash = game.as(dash);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Hala.play(toeTheLineRed);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    // First Snatch: 2 of 4 prevented (40-health hero) — one Flurry token.
    expectFabPlayer(Hala).toHaveLife(38);
    expectFabPlayer(Hala).toHaveTokenCount("flurry", 1);

    // Second Snatch on the same turn: the waiting prevention is consumed, all
    // 4 land, and no second Flurry token is created.
    Dash.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Hala).toHaveLife(34);
    expectFabPlayer(Hala).toHaveTokenCount("flurry", 1);
  });
});
