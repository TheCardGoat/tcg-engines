import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { cloudCoverRed } from "./cloud-cover.ts";
import { constellaContemplationYellow } from "./constella-contemplation.ts";

describe("Constella Contemplation (OMN130) AAA", () => {
  it("happy: creates a Ponder token", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [constellaContemplationYellow], deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.play(constellaContemplationYellow);
    game.passBoth();

    expect(Oscilio.zone("arena")).toContain("token:ponder");
    expectFabCard(Oscilio, constellaContemplationYellow).toBeIn("graveyard");
  });

  it("boundary: without an instant already in the graveyard this turn, Starfall deals no damage", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [constellaContemplationYellow], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(constellaContemplationYellow);
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Oscilio).toHaveAP(1);
  });

  it("Starfall deals 1 arcane after an instant is put into the graveyard this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [cloudCoverRed, constellaContemplationYellow],
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

    Oscilio.play(constellaContemplationYellow, { target: Dash });
    game.passBoth();

    expect(Oscilio.zone("arena")).toContain("token:ponder");
    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Oscilio, constellaContemplationYellow).toBeIn("graveyard");
  });
});
