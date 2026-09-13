import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { oscilio } from "../heroes/oscilio.ts";
import { dash } from "../heroes/dash.ts";
import { cloudCoverRed } from "../instants/cloud-cover.ts";
import { meteoricImpactRed } from "./meteoric-impact.ts";

describe("Meteoric Impact (OMN118) AAA", () => {
  it("happy: deals 3 arcane to the chosen hero when Starfall is false", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [meteoricImpactRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(meteoricImpactRed, { target: Dash });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Oscilio, meteoricImpactRed).toBeIn("graveyard");
    expectFabPlayer(Oscilio).toHaveAP(0);
  });

  it("boundary: Starfall replaces the 3 with 5 after an instant enters the graveyard this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [cloudCoverRed, meteoricImpactRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(cloudCoverRed);
    game.passBoth();
    expectFabCard(Oscilio, cloudCoverRed).toBeIn("graveyard");

    Oscilio.play(meteoricImpactRed, { target: Dash });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Oscilio, meteoricImpactRed).toBeIn("graveyard");
  });

  it("timing: an instant already in the graveyard from a prior turn is not Starfall", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [meteoricImpactRed],
        graveyard: [cloudCoverRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(meteoricImpactRed, { target: Dash });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(17);
  });
});
