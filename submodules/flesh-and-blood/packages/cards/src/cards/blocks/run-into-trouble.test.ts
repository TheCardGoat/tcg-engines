import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { kassai } from "../heroes/kassai.ts";
import { agility } from "../tokens/agility.ts";
import { runIntoTroubleRed } from "./run-into-trouble.ts";

/**
 * Run into Trouble (HVY161) — Brute / Warrior Block, 3{d}.
 * Printed: When this defends, if you control an Agility token, deal damage to
 * the attacking hero.
 */

describe("Run into Trouble (HVY161) AAA", () => {
  it("happy: defending while you control Agility deals 1 to the attacking hero", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: kassai,
        arena: [agility],
        hand: [runIntoTroubleRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Kassai = game.as(kassai);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Kassai.defendWith(runIntoTroubleRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Kassai, runIntoTroubleRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("boundary: defending without Agility does not ping the attacking hero", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: kassai,
        hand: [runIntoTroubleRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Kassai = game.as(kassai);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Kassai.defendWith(runIntoTroubleRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Kassai).toHaveLife(19);
  });
});
