import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { weaveEarthBlue } from "../actions/weave-earth.ts";
import { briar, brutalAssaultBlue } from "../shared/test-recipients.ts";
import { leavenSheathRed } from "./leaven-sheath.ts";

/**
 * Leaven Sheath (PEN208) — Elemental Defense Reaction, cost 1.
 * Printed: Earth Bond — If an Earth card was pitched to play this, create
 * an Embodiment of Earth token.
 */

describe("Leaven Sheath (PEN208) AAA", () => {
  it("happy: pitching Earth creates an Embodiment of Earth", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], actionPoints: 1, deck: 6 },
      {
        hero: briar,
        hand: [leavenSheathRed, weaveEarthBlue],
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Briar = game.as(briar);

    Dash.playAttack(brutalAssaultBlue);
    game.toReaction("defender");
    Briar.play(leavenSheathRed, { pitch: [weaveEarthBlue] });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 1);
    expectFabCard(Briar, leavenSheathRed).toBeIn("graveyard");
  });

  it("boundary: without an Earth pitch, no Embodiment is created", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], actionPoints: 1, deck: 6 },
      {
        hero: briar,
        hand: [leavenSheathRed],
        resourcePoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Briar = game.as(briar);

    Dash.playAttack(brutalAssaultBlue);
    game.toReaction("defender");
    Briar.play(leavenSheathRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 0);
  });
});
