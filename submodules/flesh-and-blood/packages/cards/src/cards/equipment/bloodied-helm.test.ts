import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { fai } from "../heroes/fai.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { bloodiedHelm } from "./bloodied-helm.ts";

/**
 * Bloodied Helm (SMP014) — Event Equipment - Head.
 * Printed: "You may equip this. / Instant - Destroy this: Put a card from
 * your arsenal on the bottom of your deck. If you do, draw a card."
 * The optional event-window "You may equip this" leg has no in-match runtime
 * (same engine verdict as Bloodied Shield SMP018); the operative clause is
 * the Instant ability.
 */

describe("Bloodied Helm (SMP014) AAA", () => {
  it("happy: destroying the helm buries the arsenal card and draws", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        head: [bloodiedHelm],
        arsenal: [snatchRed],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.activate(bloodiedHelm);
    game.helpers.resolveUntilIdle();

    expectFabCard(Fai, bloodiedHelm).toBeIn("graveyard");
    expect(Fai.cardsIn("deck", snatchRed)).toHaveLength(1);
    expectFabPlayer(Fai).toHaveHandCount(1);
  });

  it('boundary: with an empty arsenal nothing is buried so the "If you do" draw never happens', () => {
    const game = FabTestEngine.start(
      { hero: fai, head: [bloodiedHelm], hand: [], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.activate(bloodiedHelm);
    game.helpers.resolveUntilIdle();

    expectFabCard(Fai, bloodiedHelm).toBeIn("graveyard");
    expectFabPlayer(Fai).toHaveHandCount(0);
  });

  it("timing: the Instant answers during the opponent's combat chain", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: fai,
        head: [bloodiedHelm],
        arsenal: [snatchRed],
        hand: [],
        life: 20,
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Fai = game.as(fai);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Fai.defendWith();
    game.toReaction("defender");
    Fai.activate(bloodiedHelm);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expectFabCard(Fai, bloodiedHelm).toBeIn("graveyard");
    expectFabPlayer(Fai).toHaveHandCount(1);
    expectFabPlayer(Fai).toHaveLife(16);
  });
});
