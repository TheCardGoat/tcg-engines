import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { volzarTheLightningRod } from "../weapons/volzar-the-lightning-rod.ts";
import { cloudCoverRed } from "./cloud-cover.ts";
import { constellaUpliftYellow } from "./constella-uplift.ts";

describe("Constella Uplift (OMN132) AAA", () => {
  it("happy: untaps a staff you control", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [constellaUpliftYellow],
        weapon1: [{ card: volzarTheLightningRod, state: { tapped: true } }],
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    expectFabCard(Oscilio, volzarTheLightningRod).toBeTapped();
    Oscilio.play(constellaUpliftYellow);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Oscilio, volzarTheLightningRod).toBeReady();
    expectFabCard(Oscilio, constellaUpliftYellow).toBeIn("graveyard");
  });

  it("boundary: without an instant already in the graveyard this turn, Starfall deals no damage", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [constellaUpliftYellow],
        weapon1: [{ card: volzarTheLightningRod, state: { tapped: true } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(constellaUpliftYellow);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Oscilio).toHaveAP(1);
  });

  it("Starfall deals 1 arcane after an instant is put into the graveyard this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [cloudCoverRed, constellaUpliftYellow],
        weapon1: [{ card: volzarTheLightningRod, state: { tapped: true } }],
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

    Oscilio.play(constellaUpliftYellow, { target: Dash });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Oscilio, volzarTheLightningRod).toBeReady();
    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Oscilio, constellaUpliftYellow).toBeIn("graveyard");
  });
});
