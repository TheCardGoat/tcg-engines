import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { arcanicCrackleBlue } from "../actions/arcanic-crackle.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { silkenSlippers } from "./silken-slippers.ts";

/**
 * Silken Slippers (PEN126) — Illusionist Equipment - Legs, ward(1).
 * Printed: "When this is destroyed, create a Agility token."
 * Destroy path: CR 8.3.20 — "If you would be dealt damage, destroy this
 * to prevent N of that damage." Ward covers ANY damage (unlike Spellvoid /
 * Arcane Barrier, which say "arcane"); the source destroy is correct.
 */

describe("Silken Shroud (PEN123) AAA", () => {
  it("happy: ward-negating an arcane hit destroys this and creates a Agility", () => {
    const game = FabTestEngine.start(
      { hero: chane, hand: [arcanicCrackleBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], legs: [silkenSlippers], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(arcanicCrackleBlue, { stopAt: "on-attack" });
    Chane.target(game.as(dash));
    game.helpers.resolveRestOfCombat();

    expectFabCard(game.as(dash), silkenSlippers).toBeIn("graveyard");
    expectFabPlayer(game.as(dash)).toHaveTokenCount("agility", 1);
    expectFabPlayer(game.as(dash)).toHaveLife(19);
  });

  it("boundary: ward also negates a non-arcane hit (CR 8.3.20 — any damage)", () => {
    const game = FabTestEngine.start(
      { hero: chane, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], legs: [silkenSlippers], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();

    // CR 8.3.20 has no arcane qualifier (Spellvoid / Arcane Barrier do):
    // a plain combat hit still triggers the destroy-and-prevent.
    expectFabCard(game.as(dash), silkenSlippers).toBeIn("graveyard");
    expectFabPlayer(game.as(dash)).toHaveTokenCount("agility", 1);
  });

  it("timing: a fully blocked arcane attack still trips the ward destroy", () => {
    const game = FabTestEngine.start(
      { hero: chane, hand: [arcanicCrackleBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue], legs: [silkenSlippers], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(arcanicCrackleBlue, { stopAt: "on-attack" });
    Chane.target(game.as(dash));
    game.advanceUntil({ stopAt: "defend", optionals: "accept" });
    game.as(dash).defendWith([nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabCard(game.as(dash), silkenSlippers).toBeIn("graveyard");
    expectFabPlayer(game.as(dash)).toHaveTokenCount("agility", 1);
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });
});
