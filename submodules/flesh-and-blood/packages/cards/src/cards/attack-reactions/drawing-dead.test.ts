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
import { drawingDeadYellow } from "./drawing-dead.ts";

/**
 * Drawing Dead, Yellow (MPW044) — Warrior Attack Reaction, cost 0, 3{d}.
 *
 * Printed: "Target sword attack gets +1{p} and wagers with the defending
 * hero. The winner discards a card."
 */

describe("Drawing Dead (MPW044) AAA", () => {
  it("happy: the targeted sword gets +1{p} and wagers", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [durendal],
        hand: [drawingDeadYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.activateAttack(durendal);
    game.toReaction();
    Kassai.must.playReaction(drawingDeadYellow);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Kassai, drawingDeadYellow).toBeIn("graveyard");
  });

  it("boundary: a Generic attack action is not a legal sword attack (silent no-op)", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [drawingDeadYellow, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.must.playAttack(snatchRed);
    game.toReaction();
    expectFabUnplayable(() => Kassai.must.playReaction(drawingDeadYellow));

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Kassai, drawingDeadYellow).toBeIn("hand");
  });

  it("timing: still defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: kassai, hand: [drawingDeadYellow], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Kassai = game.as(kassai);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Kassai.defendWith([drawingDeadYellow]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Kassai).toHaveLife(19);
    expectFabCard(Kassai, drawingDeadYellow).toBeIn("graveyard");
  });
});
