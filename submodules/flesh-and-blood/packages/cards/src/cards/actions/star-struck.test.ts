import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { titanSFist } from "../weapons/titan-s-fist.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { starStruckYellow } from "./star-struck.ts";

/**
 * Star Struck (DTD203) — Bravo specialization Guardian AAC, 10{p}.
 *
 * Printed Crush: When this deals 4 or more damage to a hero, the only attacks
 * they may play or activate during their next turn are attacks with base {p}
 * greater than the damage dealt this way.
 *
 * Complementary restrict of Attack/Weapon with base {p} ≤ locked crush
 * damage. Restrict of the allow-list inverts. event-amount locks at CE
 * generation (CR 6.2.2b) — next-turn quote has no layer.
 */

describe("Star Struck (DTD203) AAA", () => {
  it("happy: unblocked crush locks attacks with base {p} ≤ the damage, not non-attack actions", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [starStruckYellow],
        resourcePoints: 7,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [snatchRed, nimblismBlue],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(starStruckYellow);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveLife(10);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });

    expectFabUnplayable(
      () => Dash.playAttack(snatchRed),
      /restricts this object from being played/,
    );
    Dash.play(nimblismBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
  });

  it("boundary: less than 4 damage does not lock their next-turn attacks", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [starStruckYellow],
        resourcePoints: 7,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [snatchRed, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(starStruckYellow);
    Dash.defendWith([nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue]);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveLife(18);

    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });

    Dash.playAttack(snatchRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
  });

  it("boundary: the next-turn lock rejects a low-base-power weapon activation", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [starStruckYellow],
        resourcePoints: 7,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        weapon1: [titanSFist],
        life: 20,
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(starStruckYellow);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });

    Dash.expectActivationRejected(titanSFist);
  });

  it("timing: the lock expires after their next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [starStruckYellow],
        resourcePoints: 7,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(starStruckYellow);
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });
    expectFabUnplayable(
      () => Dash.playAttack(snatchRed),
      /restricts this object from being played/,
    );

    Dash.endTurn();
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });

    Dash.playAttack(snatchRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
  });
});
