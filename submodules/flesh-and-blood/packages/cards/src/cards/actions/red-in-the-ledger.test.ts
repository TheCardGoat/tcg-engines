import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { energyPotionBlue } from "./energy-potion.ts";
import { snagBlue } from "../instants/snag.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { chorusOfTheAmphitheaterRed } from "./chorus-of-the-amphitheater.ts";
import { nimblismBlue } from "./nimblism.ts";
import { ragingOnslaughtYellow } from "./raging-onslaught.ts";
import { snatchRed } from "./snatch.ts";
import { redInTheLedgerRed } from "./red-in-the-ledger.ts";

/**
 * Red in the Ledger (ARC043) — Azalea Specialization Arrow 5{p}.
 *
 * Printed: If Red in the Ledger hits a hero, they can't play or activate
 * more than 1 action during their next turn.
 *
 * Restrict play + activate of Action, `limit.count: 1`, subject
 * `attack-target`, duration `until-end-of-their-next-turn`. Play and
 * activate share this-turn Action history so the cap is one combined
 * public action, not one of each.
 */

describe("Red in the Ledger (ARC043) AAA", () => {
  it("happy: a hit caps the defending hero at one Action play or activation next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: redInTheLedgerRed, state: { faceDown: false } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [energyPotionBlue, snatchRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.attackWith(redInTheLedgerRed, { from: "arsenal" });
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(15);
    Azalea.endTurn();
    game.helpers.resolveUntilIdle();

    Dash.play(energyPotionBlue);
    game.untilIdle();
    expectFabCard(Dash, energyPotionBlue).toBeIn("arena");

    expectFabUnplayable(
      () => Dash.playAttack(snatchRed),
      /restricts this object from being played/,
    );
    expectFabCard(Dash, snatchRed).toBeIn("hand");
  });

  it("boundary: a missed hit does not cap their next-turn Actions", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: redInTheLedgerRed, state: { faceDown: false } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [ragingOnslaughtYellow, snatchRed, snatchRed],
        arena: [energyPotionBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.attackWith(redInTheLedgerRed, { from: "arsenal" });
    Dash.defendWith(ragingOnslaughtYellow, snatchRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(20);
    Azalea.endTurn();
    game.helpers.resolveUntilIdle();

    Dash.activate(energyPotionBlue);
    game.untilIdle();
    const followUp = Dash.cardsIn("hand", snatchRed)[0]!;
    Dash.playAttack(followUp);
    expectFabCard(Dash, followUp).toBeIn("combatChain");
  });

  it("timing: Instant plays are still legal after the Action cap is spent", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: redInTheLedgerRed, state: { faceDown: false } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [snagBlue],
        arena: [energyPotionBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.attackWith(redInTheLedgerRed, { from: "arsenal" });
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    Azalea.endTurn();
    game.helpers.resolveUntilIdle();

    Dash.activate(energyPotionBlue);
    game.untilIdle();
    Dash.play(snagBlue);
    game.untilIdle();
    expectFabCard(Dash, snagBlue).toBeIn("graveyard");
  });

  it("happy: a weapon attack ability spends the shared Action cap", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: redInTheLedgerRed, state: { faceDown: false } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        weapon1: [cintariSaber],
        hand: [nimblismBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.attackWith(redInTheLedgerRed, { from: "arsenal" });
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    Azalea.endTurn();
    game.helpers.resolveUntilIdle();

    Dash.activate(cintariSaber);
    game.helpers.resolveUntilIdle({ paymentCanonicalId: nimblismBlue.canonicalId });
    expectFabUnplayable(
      () => Dash.playAttack(snatchRed),
      /restricts this object from being played/,
    );
  });

  it("boundary: an Instant ability on an Action card does not spend the Action cap", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: redInTheLedgerRed, state: { faceDown: false } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [chorusOfTheAmphitheaterRed, snatchRed],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.attackWith(redInTheLedgerRed, { from: "arsenal" });
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    Azalea.endTurn();
    game.helpers.resolveUntilIdle();

    Dash.activate(chorusOfTheAmphitheaterRed);
    game.untilIdle();
    Dash.playAttack(snatchRed);
    expectFabCard(Dash, snatchRed).toBeIn("combatChain");
  });
});
