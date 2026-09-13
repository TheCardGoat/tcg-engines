import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { sigilOfGravespawningBlue } from "./sigil-of-gravespawning.ts";
import { glyphPowerSpellRed } from "./glyph-power-spell.ts";

/**
 * Glyph Power Spell (PEN113) — Wizard Action, cost 2, 4 arcane.
 * Printed: Deal 4 arcane damage to any target. If you control a card with
 * Sigil in its name, instead deal 6 arcane damage.
 */

describe("Glyph Power Spell (PEN113) AAA", () => {
  it("happy: deals 4 arcane to the targeted hero", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [glyphPowerSpellRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(glyphPowerSpellRed, { target: Dash.id });
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Kano, glyphPowerSpellRed).toBeIn("graveyard");
  });

  it("timing: a controlled Sigil instead deals 6 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [glyphPowerSpellRed],
        arena: [sigilOfGravespawningBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(glyphPowerSpellRed, { target: Dash.id });
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabCard(Kano, glyphPowerSpellRed).toBeIn("graveyard");
    expectFabCard(Kano, sigilOfGravespawningBlue).toBeIn("arena");
  });

  it("boundary: arcane is an effect packet; no combat chain opens", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [glyphPowerSpellRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    Kano.play(glyphPowerSpellRed, { target: game.as(dash).id });
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Kano).toHaveAP(0);
  });
});
