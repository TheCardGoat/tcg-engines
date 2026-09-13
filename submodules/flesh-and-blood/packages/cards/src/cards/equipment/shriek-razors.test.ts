import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { arakni } from "../heroes/arakni.ts";
import { dash } from "../heroes/dash.ts";
import { markThePreyRed } from "../actions/mark-the-prey.ts";
import { snatchRed } from "../actions/snatch.ts";
import { silver } from "../tokens/silver.ts";
import { shriekRazors } from "./shriek-razors.ts";

/**
 * Shriek Razors (EVO235) — Assassin Arms d1, Battleworn.
 *
 * Printed: "While this is in your graveyard, at the start of your turn, you may
 * destroy 2 Silvers you control. If you do, equip this. / Attack Reaction -
 * {r}{r}, destroy this: Target attack action card defending an Assassin attack
 * gets -1{d}. / Battleworn"
 */

describe("Shriek Razors (EVO235) AAA", () => {
  it("happy: at the start of your turn, destroying 2 Silvers equips this from the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6, intellect: 0 },
      {
        hero: arakni,
        graveyard: [shriekRazors],
        arena: [silver, silver],
        deck: 6,
        intellect: 0,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept", entityTargets: "maximum" });

    expectFabCard(Arakni, shriekRazors).toBeIn("arms");
    expect(Arakni.cardsIn("arena", silver)).toHaveLength(0);
  });

  it("boundary: with fewer than two Silvers the razors stay in the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6, intellect: 0 },
      {
        hero: arakni,
        graveyard: [shriekRazors],
        arena: [silver],
        deck: 6,
        intellect: 0,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Arakni, shriekRazors).toBeIn("graveyard");
    expect(Arakni.cardsIn("arena", silver)).toHaveLength(1);
  });

  it("interaction: the attack reaction strips 1{d} from the AAC defending an Assassin attack", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        arms: [shriekRazors],
        hand: [markThePreyRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.playAttack(markThePreyRed);
    Dash.defendWith(snatchRed);
    game.toReaction("attacker");
    Arakni.activate(shriekRazors);
    Arakni.target(snatchRed);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expectFabCard(Arakni, shriekRazors).toBeIn("graveyard");
    // 3{p} vs snatch 2{d} reduced to 1{d} → 2 damage instead of 1.
    expectFabPlayer(Dash).toHaveLife(18);
  });
});
