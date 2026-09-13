import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { snatchRed } from "../actions/snatch.ts";
import { sigilOfSufferingRed } from "./sigil-of-suffering.ts";

/**
 * Sigil of Suffering Red (ELE227) — Runeblade Defense Reaction.
 *
 * Printed: Deal 1 arcane damage to the attacking hero.
 * If you have dealt arcane damage this turn, Sigil of Suffering gains +1{d}.
 */

describe("sigilOfSuffering family AAA", () => {
  it("happy: deals 1 arcane to the attacker and the +1 defense fully blocks Snatch", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: briar, hand: [sigilOfSufferingRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Briar = game.as(briar);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Briar.play(sigilOfSufferingRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabPlayer(Briar).toHaveLife(20);
    expectFabCard(Briar, sigilOfSufferingRed).toBeIn("graveyard");
  });

  it("boundary: cannot play Sigil of Suffering outside the reaction step", () => {
    const game = FabTestEngine.start(
      { hero: briar, hand: [sigilOfSufferingRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabUnplayable(
      () => game.as(briar).play(sigilOfSufferingRed),
      /not legal in the current reaction step/i,
    );
  });
});
