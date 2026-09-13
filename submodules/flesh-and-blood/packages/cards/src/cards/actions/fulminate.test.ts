import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { briar } from "../shared/test-recipients.ts";
import { lightningPressRed } from "../instants/lightning-press.ts";
import { weaveEarthRed } from "./weave-earth.ts";
import { fulminateYellow } from "./fulminate.ts";

/**
 * Fulminate (ELE091) — Elemental Action, cost 2, 2{d}, go again.
 *
 * Printed: "Earth and/or Lightning Fusion. If Fulminate was fused with an
 * Earth card, attack action cards you control gain +3{p} this turn. If
 * Fulminate was fused with a Lightning card, attack action cards you control
 * gain go again this turn. Go again"
 */

describe("Fulminate (ELE091) AAA", () => {
  it("happy: fusing an Earth card gives your later attack action +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [fulminateYellow, weaveEarthRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(fulminateYellow, { fuse: true, fuseCards: [weaveEarthRed] });
    game.helpers.resolveUntilIdle();
    expectFabCard(Briar, fulminateYellow).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveAP(1);

    Briar.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: unfused, a later attack action stays printed", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [fulminateYellow, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(fulminateYellow);
    game.helpers.resolveUntilIdle();
    Briar.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("happy: fusing a Lightning card gives a later attack action go again", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [fulminateYellow, lightningPressRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(fulminateYellow, { fuse: true, fuseCards: [lightningPressRed] });
    game.helpers.resolveUntilIdle();
    Briar.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveKeyword("go-again");
  });

  it("timing: defends for its printed 2{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: briar,
        hand: [fulminateYellow],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Briar = game.as(briar);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Briar.defendWith(fulminateYellow);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Briar, fulminateYellow).toBeIn("graveyard");
    expectFabPlayer(Briar).toHaveLife(18);
  });
});
