import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { volticBoltRed } from "./voltic-bolt.ts";
import { pyroglyphicProtectionRed } from "./pyroglyphic-protection.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { goodDeedsDonTGoUnnoticedYellow } from "./good-deeds-don-t-go-unnoticed.ts";
import { snatchRed } from "./snatch.ts";
import { mageHunterArrowRed } from "./mage-hunter-arrow.ts";

/**
 * Mage Hunter Arrow (SUP257) — Ranger Arrow Attack, cost 1, 5{p}/3{d}.
 *
 * Printed: Instant - Destroy this: The next time you would be dealt arcane
 * damage this turn, prevent 3 of that damage. Activate this only while this
 * is face-up in your arsenal.
 * When this hits a Runeblade or Wizard hero, you may destroy an aura they
 * control.
 */

describe("Mage Hunter Arrow (SUP257) AAA", () => {
  it("happy: destroy this from face-up arsenal to prevent 3 of the next arcane damage", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: mageHunterArrowRed, state: { faceDown: false } }],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Kano = game.as(kano);

    game.helpers.passPriorityTo(Azalea);
    Azalea.activate(mageHunterArrowRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    Kano.play(volticBoltRed, { target: Azalea.id });
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Azalea, mageHunterArrowRed).toBeIn("graveyard");
    expectFabPlayer(Azalea).toHaveLife(18);
  });

  it("boundary: cannot activate from face-down arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: mageHunterArrowRed, state: { faceDown: true } }],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    expectFabUnplayable(
      () => Azalea.activate(mageHunterArrowRed),
      /activation condition is not satisfied|unavailable|cannot be paid/i,
    );
    expectFabCard(Azalea, mageHunterArrowRed).toBeIn("arsenal").toBeFaceDown();
  });

  it("timing: physical damage does not consume the next-arcane prevention", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [snatchRed, volticBoltRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: mageHunterArrowRed, state: { faceDown: false } }],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Kano = game.as(kano);

    game.helpers.passPriorityTo(Azalea);
    Azalea.activate(mageHunterArrowRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    Kano.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Azalea).toHaveLife(16);

    Kano.play(volticBoltRed, { target: Azalea.id });
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Azalea).toHaveLife(14);
  });

  it("happy: hitting a Wizard hero may destroy an aura they control", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [mageHunterArrowRed],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: kano,
        arena: [pyroglyphicProtectionRed],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Kano = game.as(kano);

    Azalea.playAttack(mageHunterArrowRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });
    game.untilIdle({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });

    expectFabPlayer(Kano).toHaveLife(15);
    expectFabCard(Kano, pyroglyphicProtectionRed).toBeIn("graveyard");
  });

  it("boundary: hitting a Mechanologist hero does not destroy an aura they control", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [mageHunterArrowRed],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        arena: [goodDeedsDonTGoUnnoticedYellow],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(mageHunterArrowRed, { from: "arsenal" });
    game.closeCombat({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });
    game.untilIdle({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Dash, goodDeedsDonTGoUnnoticedYellow).toBeIn("arena");
  });
});
