import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { durendal } from "../weapons/durendal.ts";
import { downswingRed } from "./downswing.ts";

/**
 * Downswing, Red (MPW043) — Warrior Attack Reaction, cost 0, 3{d}.
 *
 * Printed: "Target sword attack gets +1{p} and wagers with the defending
 * hero. The winner loses 1{h}."
 */

describe("Downswing (MPW043) AAA", () => {
  it("happy: the targeted sword gets +1{p} and wagers", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [durendal],
        hand: [downswingRed],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.activateAttack(durendal);
    game.toReaction();
    Kassai.must.playReaction(downswingRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Kassai, downswingRed).toBeIn("graveyard");
  });

  it("boundary: a Generic attack action is not a legal sword attack (silent no-op)", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [downswingRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.must.playAttack(snatchRed);
    game.toReaction();
    expectFabUnplayable(() => Kassai.must.playReaction(downswingRed));

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Kassai, downswingRed).toBeIn("hand");
  });

  it("timing: still defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: kassai, hand: [downswingRed], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Kassai = game.as(kassai);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Kassai.defendWith([downswingRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Kassai).toHaveLife(19);
    expectFabCard(Kassai, downswingRed).toBeIn("graveyard");
  });
});
