import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { riftedTormentRed } from "../actions/rifted-torment.ts";
import { snatchRed } from "../actions/snatch.ts";
import { breakOfDawnRed } from "./break-of-dawn.ts";

describe("Break of Dawn (DTD100/101/102) AAA", () => {
  it("happy: the red family member prevents 4 of the next Shadow source damage", () => {
    const game = FabTestEngine.start(
      { hero: chane, hand: [riftedTormentRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [breakOfDawnRed], resourcePoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(chane).playAttack(riftedTormentRed);
    Dash.defendWith();
    game.toReaction();
    game.helpers.passPriorityTo(Dash);
    Dash.play(breakOfDawnRed);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Dash, breakOfDawnRed).toBeIn("graveyard");
  });

  it("boundary: non-Shadow damage does not consume the prevention", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [snatchRed, riftedTormentRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [breakOfDawnRed], resourcePoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.playAttack(snatchRed);
    Dash.defendWith();
    game.toReaction();
    game.helpers.passPriorityTo(Dash);
    Dash.play(breakOfDawnRed);
    game.passBoth();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(16);

    Chane.playAttack(riftedTormentRed);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("timing: a second Shadow damage event is not prevented", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [riftedTormentRed, riftedTormentRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [breakOfDawnRed], resourcePoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);
    const attacks = Chane.cardsIn("hand", riftedTormentRed);

    Chane.playAttack(attacks[0]!);
    Dash.defendWith();
    game.toReaction();
    game.helpers.passPriorityTo(Dash);
    Dash.play(breakOfDawnRed);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    Chane.playAttack(attacks[1]!);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(16);
  });
});
