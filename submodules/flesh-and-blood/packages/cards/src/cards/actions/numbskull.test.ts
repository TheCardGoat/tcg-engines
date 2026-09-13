import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { pummelYellow } from "../attack-reactions/pummel.ts";
import { snatchRed } from "./snatch.ts";
import { seismicShelterBlue } from "./seismic-shelter.ts";
import { gentleBreezeRed } from "./gentle-breeze.ts";
import { numbskullRed } from "./numbskull.ts";

/**
 * Numbskull (DTD201) — Brute Attack 6{p}/3{d}.
 *
 * Printed: While this is in any zone, its {r} cost to play, {p}, and {d}
 * can't be modified.
 *
 * Self-targeted while-static (CR 5.4.7) + restrict be-modified. Pummel's
 * +{p} and Seismic Shelter's defending +{d} are the printed-result probes.
 */

describe("Numbskull (DTD201) AAA", () => {
  it("happy: Pummel does not raise this 6{p} attack", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [numbskullRed, pummelYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(numbskullRed);
    game.toReaction("attacker");
    Rhinar.must.playReaction(pummelYellow, {
      modeIds: [`${pummelYellow.canonicalId}:chooseMode:hitHero`],
    });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(6);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("boundary: Pummel does raise a normal cost-2+ attack", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [brutalAssaultBlue, pummelYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(brutalAssaultBlue);
    game.toReaction("attacker");
    Rhinar.must.playReaction(pummelYellow, {
      modeIds: [`${pummelYellow.canonicalId}:chooseMode:hitHero`],
    });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: an effect cannot set this attack's base power", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [gentleBreezeRed, numbskullRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(gentleBreezeRed);
    game.advanceCombatTo("resolution");
    Rhinar.playAttack(numbskullRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(6);
  });

  it("timing: defending +{d} from Seismic Shelter does not raise this 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: rhinar,
        arena: [seismicShelterBlue, fabToken("seismic-surge")],
        hand: [numbskullRed],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Rhinar = game.as(rhinar);

    Dash.playAttack(snatchRed);
    Rhinar.defendWith(numbskullRed);
    game.passBoth();

    expectFabCard(Rhinar, numbskullRed).toHaveDefense(3);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Rhinar).toHaveLife(19);
  });
});
