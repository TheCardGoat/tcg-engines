import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { oscilioForkedContinuum } from "../heroes/oscilio-forked-continuum.ts";
import { sigilOfSolaceRed } from "../instants/sigil-of-solace.ts";
import { volzarMeteorStorm } from "./volzar-meteor-storm.ts";

describe("Volzar, Meteor Storm (OMN096) AAA", () => {
  it("happy: after an instant hits the graveyard, Amp 1 adds 1 to the next arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilioForkedContinuum,
        weapon1: [volzarMeteorStorm],
        hand: [sigilOfSolaceRed, volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilioForkedContinuum);

    Oscilio.play(sigilOfSolaceRed);
    game.passBoth();
    Oscilio.activate(volzarMeteorStorm);
    game.passBoth();
    expectFabCard(Oscilio, volzarMeteorStorm).toBeTapped();

    Oscilio.play(volticBoltRed, { target: game.as(dash).id });
    game.passBoth();

    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("boundary: cannot activate unless an instant was put into the graveyard this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilioForkedContinuum,
        weapon1: [volzarMeteorStorm],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(oscilioForkedContinuum).expectActivationRejected(volzarMeteorStorm);
  });
});
