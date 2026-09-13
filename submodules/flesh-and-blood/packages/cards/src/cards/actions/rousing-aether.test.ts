import { rousingAetherBlue } from "./rousing-aether.ts";
import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { volticBoltRed } from "./voltic-bolt.ts";
import { rousingAetherRed } from "./rousing-aether.ts";

/**
 * Rousing Aether (CRU171) — Wizard Action, cost 2, 4 arcane.
 *
 * Printed: Deal 4 arcane damage to target hero. The next card you play this
 * turn with an effect that deals arcane damage, instead deals that much plus 1.
 */

describe("Rousing Aether (CRU171) AAA", () => {
  it("happy: deals 4 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [rousingAetherRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(rousingAetherRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Blaze, rousingAetherRed).toBeIn("graveyard");
  });

  it("boundary: unpayable cost keeps the card in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [rousingAetherRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    expectFabUnplayable(() => Blaze.play(rousingAetherRed, { target: game.as(dash).id }));
    expectFabCard(Blaze, rousingAetherRed).toBeIn("hand");
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("timing: the next arcane card this turn deals plus 1", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [rousingAetherRed, volticBoltRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(rousingAetherRed, { target: Dash.id });
    game.passBoth();
    Blaze.play(volticBoltRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(10);
    expectFabCard(Blaze, volticBoltRed).toBeIn("graveyard");
  });

  it("happy: deals 2 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [rousingAetherBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(rousingAetherBlue, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(18);
    expectFabCard(Blaze, rousingAetherBlue).toBeIn("graveyard");
  });
});
