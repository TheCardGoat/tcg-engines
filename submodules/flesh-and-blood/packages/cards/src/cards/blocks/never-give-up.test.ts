import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { cheersBlue } from "../actions/cheers.ts";
import { helmOfTheAdored } from "../equipment/helm-of-the-adored.ts";
import { neverGiveUpYellow } from "./never-give-up.ts";

/**
 * Never Give Up (APS015) — Revered Block yellow 3{d}.
 *
 * Printed Instant (GY): {r}{r}, put this on the bottom of your deck: Target
 * defending action card gets +3{d} this chain link. Activate only while it is
 * in your graveyard, you have less {h} than each hero, and you've been cheered
 * this turn.
 */

describe("Never Give Up (APS015) AAA", () => {
  it("happy: after a cheer and less {h}, a defending action gets +3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        life: 20,
        deck: 6,
      },
      {
        hero: tuffnut,
        head: [helmOfTheAdored],
        hand: [brutalAssaultBlue],
        graveyard: [neverGiveUpYellow],
        resourcePoints: 2,
        life: 15,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Tuffnut = game.as(tuffnut);

    Dash.playAttack(snatchRed);
    Tuffnut.defendWith(helmOfTheAdored);
    game.closeCombat({ ordering: "listed" });

    Dash.playAttack(snatchRed);
    Tuffnut.defendWith(brutalAssaultBlue);
    Dash.pass();
    Tuffnut.activate(neverGiveUpYellow);
    Tuffnut.target(brutalAssaultBlue);
    game.passBoth();

    expectFabCard(Tuffnut, brutalAssaultBlue).toBeIn("combatChain");
    expectFabCard(Tuffnut, brutalAssaultBlue).toHaveDefense(6);
    expect(Tuffnut.cardsIn("graveyard", neverGiveUpYellow)).toHaveLength(0);
  });

  it("boundary: without a cheer this turn the GY Instant is rejected", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: tuffnut,
        hand: [snatchRed],
        graveyard: [neverGiveUpYellow],
        resourcePoints: 2,
        life: 15,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Tuffnut = game.as(tuffnut);

    Dash.playAttack(snatchRed);
    Tuffnut.defendWith(snatchRed);
    Tuffnut.expectActivationRejected(neverGiveUpYellow);
    expectFabCard(Tuffnut, neverGiveUpYellow).toBeIn("graveyard");
  });

  it("boundary: equal {h} does not open the GY Instant", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [cheersBlue, snatchRed],
        graveyard: [neverGiveUpYellow],
        resourcePoints: 2,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Tuffnut = game.as(tuffnut);

    Tuffnut.play(cheersBlue);
    game.untilIdle({ ordering: "listed" });
    Tuffnut.endTurn();
    game.untilIdle({ ordering: "listed" });
    Dash.playAttack(snatchRed);
    Tuffnut.defendWith(snatchRed);
    Tuffnut.expectActivationRejected(neverGiveUpYellow);
    expectCombat(game).toHaveAttackPower(4);
    expectFabPlayer(Tuffnut).toHaveLife(20);
  });
});
