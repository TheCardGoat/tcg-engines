import { describe, it } from "vitest";
import {
  expectFabCard,
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { sinspeakerGloombladeRed } from "../actions/sinspeaker-gloomblade.ts";
import { runechantOfPrideYellow } from "./runechant-of-pride.ts";

/**
 * Runechant of Pride Yellow (IAR155) — Runeblade Instant Aura.
 *
 * Printed: When an attack usurps this, it gets +1{p}.
 */

describe("Runechant of Pride (IAR155) AAA", () => {
  it("happy: the usurping attack gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [sinspeakerGloombladeRed],
        arena: [runechantOfPrideYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: chane },
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(sinspeakerGloombladeRed);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Chane, runechantOfPrideYellow).toBeIn("graveyard");
    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: usurping an opponent's Runechant still gives the attack +1{p}", () => {
    const game = FabTestEngine.start(
      { hero: chane, hand: [sinspeakerGloombladeRed], actionPoints: 1, deck: 6 },
      { hero: dash, arena: [runechantOfPrideYellow], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: chane },
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.playAttack(sinspeakerGloombladeRed);
    expectFabCard(Chane, sinspeakerGloombladeRed).toHavePower(5);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("timing: the +1{p} expires at the end of the turn", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [sinspeakerGloombladeRed],
        arena: [runechantOfPrideYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: chane },
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(sinspeakerGloombladeRed);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(5);

    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Chane.endTurn();
    game.helpers.untilIdle();
    expectFabCard(Chane, sinspeakerGloombladeRed).toHavePower(2);
  });
});
