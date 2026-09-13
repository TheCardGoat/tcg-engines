import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { dash } from "../heroes/dash.ts";
import { sigilOfLightningBlue } from "./sigil-of-lightning.ts";
import { emergingPowerRed } from "../actions/emerging-power.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { shatterSorceryBlue } from "./shatter-sorcery.ts";

describe("Shatter Sorcery (PEN330) AAA", () => {
  it("happy: destroys a Sigil aura and prevents 1 of Voltic Bolt's 5", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [sigilOfLightningBlue, shatterSorceryBlue, volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(sigilOfLightningBlue);
    game.passBoth();
    expectFabCard(Blaze, sigilOfLightningBlue).toBeIn("arena");

    Blaze.play(shatterSorceryBlue, {
      modeIndexes: [0, 1],
      target: Dash.id,
    });
    game.helpers.resolveUntilIdle();

    expectFabCard(Blaze, sigilOfLightningBlue).toBeIn("graveyard");
    expectFabCard(Blaze, shatterSorceryBlue).toBeIn("graveyard");

    Blaze.play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("boundary: a non-Sigil aura is not a legal a1 target", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [shatterSorceryBlue],
        arena: [emergingPowerRed],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    expect(() => Blaze.play(shatterSorceryBlue, { modeIndexes: [0] })).toThrow();
    expectFabCard(Blaze, emergingPowerRed).toBeIn("arena");
    expectFabCard(Blaze, shatterSorceryBlue).toBeIn("hand");
  });

  it("timing: prevent is this-turn and only 1", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [shatterSorceryBlue, volticBoltRed, volticBoltRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(shatterSorceryBlue, { modeIndexes: [1], target: Dash.id });
    game.passBoth();

    const bolts = Blaze.cardsIn("hand", volticBoltRed);
    Blaze.play(bolts[0]!, { target: Dash.id });
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(16);

    Blaze.play(bolts[1]!, { target: Dash.id });
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(11);
  });
});
