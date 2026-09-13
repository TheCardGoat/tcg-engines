import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { sinspeakerGloombladeRed } from "../actions/sinspeaker-gloomblade.ts";
import { runechantOfWrathYellow as runechantOfWrath } from "./runechant-of-wrath.ts";

/**
 * Runechant of Wrath (IAR157) — Runeblade Instant Aura.
 *
 * Printed: When an attack usurps this, it gets overpower.
 */

describe("Runechant of Wrath (IAR157) AAA", () => {
  it("happy: the usurping attack gains overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [sinspeakerGloombladeRed],
        arena: [runechantOfWrath],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: chane },
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(sinspeakerGloombladeRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Chane, runechantOfWrath).toBeIn("graveyard");
    expectFabCard(Chane, sinspeakerGloombladeRed).toHaveKeyword("overpower");
  });

  it("boundary: usurping an opponent's Runechant still grants overpower", () => {
    const game = FabTestEngine.start(
      { hero: chane, hand: [sinspeakerGloombladeRed], actionPoints: 1, deck: 6 },
      { hero: dash, arena: [runechantOfWrath], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: chane },
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.playAttack(sinspeakerGloombladeRed);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabCard(Chane, sinspeakerGloombladeRed).toHaveKeyword("overpower");
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("timing: overpower expires at the end of the turn", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [sinspeakerGloombladeRed],
        arena: [runechantOfWrath],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: chane },
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(sinspeakerGloombladeRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });
    expectFabCard(Chane, sinspeakerGloombladeRed).toHaveKeyword("overpower");

    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Chane.endTurn();
    game.helpers.untilIdle();
    expectFabCard(Chane, sinspeakerGloombladeRed).notToHaveKeyword("overpower");
  });
});
