import { describe, it } from "vitest";
import {
  expectFabPlayer,
  fabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cheaterSCharmYellow } from "../instants/cheater-s-charm.ts";
import { killjoyTheCrookedBlade } from "./killjoy-the-crooked-blade.ts";
import { cutpurseRapier } from "../weapons/cutpurse-rapier.ts";

/**
 * Killjoy, the Crooked Blade (SPW001) — Reviled Warrior Thief Hero - Young.
 *
 * Printed:
 *   You may attack any opposing hero.        (1v1-only product: this clause
 *   cannot manifest — gap attack/additional-hero-target-1v1)
 *   Whenever you steal a Gold, the crowd boos you.
 *   The first time the crowd boos you each turn, each hero with more {h} than
 *   you loses 1{h}.
 *
 * The steal-to-boo link is recorded as gap trigger/killjoy-steal-boo-never-
 * declares: the steal resolves and moves the Gold, but the move-zone
 * crowd-boos trigger never declares.
 */

describe("Killjoy, the Crooked Blade (SPW001) AAA", () => {
  it("happy: hitting a hero with Cutpurse Rapier steals a Gold they control", () => {
    const game = FabTestEngine.start(
      {
        hero: killjoyTheCrookedBlade,
        weapon1: [cutpurseRapier],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        life: 18,
        deck: 6,
      },
      { hero: dash, arena: [fabToken("gold")], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Killjoy = game.as(killjoyTheCrookedBlade);
    const Dash = game.as(dash);

    Killjoy.activateAttack(cutpurseRapier);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Killjoy).toHaveTokenCount("gold", 1);
    expectFabPlayer(Dash).toHaveTokenCount("gold", 0).toHaveLife(17); // 3{p} hit
  });

  it("happy: the crowd booing Killjoy drains each richer hero by 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: killjoyTheCrookedBlade,
        hand: [cheaterSCharmYellow],
        resourcePoints: 1,
        actionPoints: 1,
        life: 18,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Killjoy = game.as(killjoyTheCrookedBlade);
    const Dash = game.as(dash);

    Killjoy.play(cheaterSCharmYellow, { modeIndexes: [1] }); // the crowd boos you
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Killjoy).toHaveCrowdBooedThisTurn();
    expectFabPlayer(Dash).toHaveLife(19); // 20 > 18, loses 1{h}
    expectFabPlayer(Killjoy).toHaveLife(18);
  });

  it("boundary: only the first boo each turn drains the richer hero", () => {
    const game = FabTestEngine.start(
      {
        hero: killjoyTheCrookedBlade,
        hand: [cheaterSCharmYellow, cheaterSCharmYellow],
        resourcePoints: 1,
        actionPoints: 2,
        life: 18,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Killjoy = game.as(killjoyTheCrookedBlade);
    const Dash = game.as(dash);

    Killjoy.play(cheaterSCharmYellow, { modeIndexes: [1] });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveLife(19);

    Killjoy.play(cheaterSCharmYellow, { modeIndexes: [1] });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveLife(19); // second boo drains nobody
  });
});
