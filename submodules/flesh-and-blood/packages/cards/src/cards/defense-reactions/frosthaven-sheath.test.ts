import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { weaveIceBlue } from "../actions/weave-ice.ts";
import { briar, brutalAssaultBlue } from "../shared/test-recipients.ts";
import { frosthavenSheathRed } from "./frosthaven-sheath.ts";

/**
 * Frosthaven Sheath (PEN207) — Elemental Defense Reaction, cost 1.
 * Printed: Ice Bond — If an Ice card was pitched to play this, create a
 * Frostbite token under the attacking hero's control.
 */

describe("Frosthaven Sheath (PEN207) AAA", () => {
  it("happy: pitching Ice creates a Frostbite under the attacking hero", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], actionPoints: 1, deck: 6 },
      {
        hero: briar,
        hand: [frosthavenSheathRed, weaveIceBlue],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Briar = game.as(briar);

    Dash.playAttack(brutalAssaultBlue);
    game.toReaction("defender");
    Briar.play(frosthavenSheathRed, { pitch: [weaveIceBlue] });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 1);
    expectFabPlayer(Briar).toHaveTokenCount("frostbite", 0);
    expectFabCard(Briar, frosthavenSheathRed).toBeIn("graveyard");
  });

  it("boundary: without an Ice pitch, no Frostbite is created", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], actionPoints: 1, deck: 6 },
      {
        hero: briar,
        hand: [frosthavenSheathRed],
        resourcePoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Briar = game.as(briar);

    Dash.playAttack(brutalAssaultBlue);
    game.toReaction("defender");
    Briar.play(frosthavenSheathRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 0);
  });
});
