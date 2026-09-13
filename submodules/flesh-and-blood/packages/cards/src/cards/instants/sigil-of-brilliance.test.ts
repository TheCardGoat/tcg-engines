import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { snatchRed } from "../actions/snatch.ts";
import { sigilOfBrillianceYellow } from "./sigil-of-brilliance.ts";

describe("Sigil of Brilliance (ROS022) AAA", () => {
  it("happy: at the start of your action phase it destroys itself and draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [sigilOfBrillianceYellow],
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(sigilOfBrillianceYellow);
    game.passBoth();
    expectFabCard(Oscilio, sigilOfBrillianceYellow).toBeIn("arena");

    Oscilio.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Oscilio, sigilOfBrillianceYellow).toBeIn("graveyard");
    expect(Oscilio.zone("hand")).toContain(snatchRed.canonicalId);
  });

  it("timing: leave-arena draw is the card gained when the action-phase destroy resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [sigilOfBrillianceYellow],
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(sigilOfBrillianceYellow);
    game.passBoth();
    expect(Oscilio.zone("hand")).toHaveLength(0);

    Oscilio.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Oscilio, sigilOfBrillianceYellow).toBeIn("graveyard");
    expect(Oscilio.zone("hand")).toContain(snatchRed.canonicalId);
  });

  it("boundary: the opposing hero's action phase does not destroy the sigil", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [sigilOfBrillianceYellow], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.play(sigilOfBrillianceYellow);
    game.passBoth();
    Oscilio.endTurn();

    expectFabCard(Oscilio, sigilOfBrillianceYellow).toBeIn("arena");
  });
});
