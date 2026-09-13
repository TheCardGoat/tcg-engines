import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { bravo } from "../heroes/bravo.ts";
import { amethystTiara } from "./amethyst-tiara.ts";

/**
 * Amethyst Tiara (DYN171) — Runeblade Head d1 Blade Break.
 *
 * Printed: Instant - Destroy Amethyst Tiara: Runechants you control have
 * spellvoid 1 this turn.
 *
 * Spell Fray Gloves spellvoid idiom with a seeded Runechant token:
 * Bravo destroys the tiara in response to Voltic Bolt so the grant is live
 * when the bolt resolves the same turn.
 */

describe("Amethyst Tiara (DYN171) AAA", () => {
  it("happy: destroy the head so the Runechant's spellvoid prevents 1 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        life: 20,
        head: [amethystTiara],
        arena: [fabToken("runechant")],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Blaze = game.as(blazeFiremind);

    Blaze.play(volticBoltRed, { target: Bravo.id });
    // Bravo holds priority in response: the grant must be live at resolution.
    Blaze.pass();
    Bravo.activate(amethystTiara);
    game.passBoth();
    game.passBoth();
    const choice = Bravo.expectDecision("option");
    Bravo.chooseOptions(choice.options[0]!.id);

    expectFabCard(Bravo, amethystTiara).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabPlayer(Bravo).toHaveTokenCount("runechant", 0);
  });

  it("boundary: without the head the Runechant has no spellvoid", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        life: 20,
        arena: [fabToken("runechant")],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(blazeFiremind).play(volticBoltRed, { target: Bravo.id });
    game.passBoth();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveLife(15);
    expectFabPlayer(Bravo).toHaveTokenCount("runechant", 1);
  });

  it("timing: spellvoid expires with the turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [amethystTiara],
        arena: [fabToken("runechant")],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(amethystTiara);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, amethystTiara).toBeIn("graveyard");
    // The surviving Runechant never gained durable spellvoid.
    expectFabPlayer(Bravo).toHaveTokenCount("runechant", 1);
  });
});
