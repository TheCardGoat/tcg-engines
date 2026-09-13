import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { commandAndConquerRed } from "./command-and-conquer.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { woundingBlowBlue } from "./wounding-blow.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { callForBackupRed } from "./call-for-backup.ts";

/**
 * Call for Backup (MPG126) — Generic Action Attack, 7{p}.
 *
 * Printed: When this defends, choose 2 attack action cards with different
 * names in your graveyard. An opponent chooses 1 of them. Banish that card
 * and put the other on top of your deck.
 */

describe("Call for Backup (MPG126) AAA", () => {
  it("happy: when this defends, opponent chooses which GY attack is banished", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        hand: [callForBackupRed],
        graveyard: [snatchRed, woundingBlowBlue, commandAndConquerRed],
        deck: [nimblismBlue],
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    Bravo.defendWith(callForBackupRed);
    // Attacker has priority after the defend event; both seats pass to
    // resolve the stacked trigger, then Bravo chooses 2 and Dash picks 1.
    game.passBoth();
    Bravo.targetRequired(snatchRed, woundingBlowBlue);
    Dash.targetRequired(snatchRed);

    expectFabCard(Bravo, snatchRed).toBeBanished();
    expect(Bravo.zone("deck").at(-1)).toBe(woundingBlowBlue.canonicalId);
    expectFabCard(Bravo, commandAndConquerRed).toBeIn("graveyard");
  });

  it("boundary: with fewer than 2 attack actions in the graveyard nothing is banished", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        hand: [callForBackupRed],
        graveyard: [snatchRed],
        deck: [nimblismBlue],
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    Bravo.defendWith(callForBackupRed);
    game.passBoth();
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Bravo, snatchRed).toBeIn("graveyard");
    expect(Bravo.zone("deck").at(-1)).toBe(nimblismBlue.canonicalId);
  });

  it("timing: as an attack this is 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [callForBackupRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(callForBackupRed);
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabCard(Bravo, callForBackupRed).toBeIn("graveyard");
  });
});
