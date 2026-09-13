import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { oystenHeartOfGoldYellow } from "./oysten-heart-of-gold.ts";
import { rustyHarpoonBlue } from "./rusty-harpoon.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { dropTheAnchorRed } from "./drop-the-anchor.ts";

/**
 * Drop the Anchor (SEA100) — Ranger Action, cost 0, go again.
 *
 * Printed: Your next arrow attack this turn gets +3{p} and "When this hits a
 * hero, {t} them and all allies they control." Go again
 */

describe("Drop the Anchor (SEA100) AAA", () => {
  it("happy: the next arrow gets +3{p} and a hero hit taps that hero and their allies", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [dropTheAnchorRed],
        weapon1: [deathDealer],
        arsenal: [{ card: rustyHarpoonBlue, state: { faceDown: true } }],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        arena: [oystenHeartOfGoldYellow],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(dropTheAnchorRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Azalea).toHaveAP(1);

    Azalea.attackWith(rustyHarpoonBlue, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, dash).toBeTapped();
    expectFabCard(Dash, oystenHeartOfGoldYellow).toBeTapped();
  });

  it("boundary: a non-arrow attack gets no +3{p} and does not tap the defending hero", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [dropTheAnchorRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        arena: [oystenHeartOfGoldYellow],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(dropTheAnchorRed);
    game.helpers.resolveUntilIdle();

    Azalea.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, dash).toBeReady();
    expectFabCard(Dash, oystenHeartOfGoldYellow).toBeReady();
  });

  it("timing: the defending hero and ally are not tapped until the arrow hits", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [dropTheAnchorRed],
        weapon1: [deathDealer],
        arsenal: [{ card: rustyHarpoonBlue, state: { faceDown: true } }],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        arena: [oystenHeartOfGoldYellow],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(dropTheAnchorRed);
    game.helpers.resolveUntilIdle();
    Azalea.attackWith(rustyHarpoonBlue, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Dash, dash).toBeReady();
    expectFabCard(Dash, oystenHeartOfGoldYellow).toBeReady();

    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabCard(Dash, dash).toBeTapped();
    expectFabCard(Dash, oystenHeartOfGoldYellow).toBeTapped();
  });
});
