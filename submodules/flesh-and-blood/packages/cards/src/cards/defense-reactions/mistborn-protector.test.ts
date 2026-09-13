import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zenTamerOfPurpose } from "../heroes/zen-tamer-of-purpose.ts";
import { snatchRed } from "../actions/snatch.ts";
import { mistbornProtectorBlue } from "./mistborn-protector.ts";

/**
 * Mistborn Protector (PEN271) — Mystic Defense Reaction, cost 0, 2{d}.
 * Printed: "While this is defending, if you've created a card this turn,
 * this gets +1{d}."
 *
 * Zen Tamer of Purpose is the seated defender: his instant tap ability
 * creates a Crouching Tiger in the reaction window, arming the
 * created-this-turn rider for the same combat.
 */

describe("Mistborn Protector (PEN271) AAA", () => {
  it("happy: after creating a card this turn, this defends for 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: zenTamerOfPurpose, hand: [mistbornProtectorBlue], chiPoints: 3, life: 20, deck: 2 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Zen = game.as(zenTamerOfPurpose);

    Dash.playAttack(snatchRed);
    game.toReaction("defender");
    Zen.must.playReaction(mistbornProtectorBlue);
    game.passBoth();
    Dash.pass();
    // Creating the tiger this turn arms the +1{d} rider before damage math.
    Zen.activate(zenTamerOfPurpose);
    game.passBoth();
    expectFabCard(Zen, mistbornProtectorBlue).toHaveDefense(3);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Zen).toHaveLife(19); // 4{p} vs 3{d}
  });

  it("boundary: without creating a card this turn, this defends for printed 2{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: zenTamerOfPurpose, hand: [mistbornProtectorBlue], chiPoints: 3, life: 20, deck: 2 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Zen = game.as(zenTamerOfPurpose);

    Dash.playAttack(snatchRed);
    game.toReaction("defender");
    Zen.must.playReaction(mistbornProtectorBlue);
    game.passBoth();
    expectFabCard(Zen, mistbornProtectorBlue).toHaveDefense(2);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Zen).toHaveLife(18);
  });
});
