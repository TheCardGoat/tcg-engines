import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { echoflashYellow } from "./echoflash.ts";

describe("Echoflash (OMN099) AAA", () => {
  it("happy: deals 1 arcane to the targeted hero on resolution", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [echoflashYellow], resourcePoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6, hand: [] },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(echoflashYellow, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Oscilio, echoflashYellow).toBeIn("graveyard");
  });

  it("boundary: the unpaid cost-1 instant cannot be played", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [echoflashYellow], resourcePoints: 0, deck: 6 },
      { hero: dash, life: 20, deck: 6, hand: [] },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    expect(() => Oscilio.play(echoflashYellow, { target: game.as(dash).id })).toThrow();
    expectFabCard(Oscilio, echoflashYellow).toBeIn("hand");
  });

  it("timing: when put into the graveyard the hero deals 1 more arcane", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [echoflashYellow], resourcePoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6, hand: [] },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(echoflashYellow, { target: Dash.id });
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(19);
    Oscilio.chooseTargetPlayers(Dash);
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(18);
    expectFabCard(Oscilio, echoflashYellow).toBeIn("graveyard");
  });
});
