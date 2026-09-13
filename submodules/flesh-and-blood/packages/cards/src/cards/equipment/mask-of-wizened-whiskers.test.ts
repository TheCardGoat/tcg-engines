import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { katsu } from "../heroes/katsu.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { blackoutKickBlue } from "../actions/blackout-kick.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { maskOfWizenedWhiskers } from "./mask-of-wizened-whiskers.ts";

/**
 * Mask of Wizened Whiskers — Ninja Head d1 Blade Break.
 *
 * Printed: "When this defends, put a card with combo from your graveyard on
 * the bottom of your deck. Blade Break"
 */

describe("Mask of Wizened Whiskers AAA", () => {
  it("happy: when the mask defends, a combo card returns from graveyard to deck", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        head: [maskOfWizenedWhiskers],
        graveyard: [blackoutKickBlue],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    const comboRef = Katsu.cardIn("graveyard", blackoutKickBlue);

    Dash.playAttack(snatchRed);
    Katsu.defendWith(maskOfWizenedWhiskers);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Katsu, comboRef).toBeIn("deck");
    // Blade Break consumed the mask after it defended.
    expectFabCard(Katsu, maskOfWizenedWhiskers).toBeIn("graveyard");
  });

  it("boundary: with no combo card in the graveyard, nothing is put on the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        head: [maskOfWizenedWhiskers],
        graveyard: [nimblismBlue], // no combo keyword
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Katsu.defendWith(maskOfWizenedWhiskers);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Katsu, Katsu.cardIn("graveyard", nimblismBlue)).toBeIn("graveyard");
    expect(Katsu.zone("graveyard")).toHaveLength(2); // nimblism + the broken mask
  });
});
