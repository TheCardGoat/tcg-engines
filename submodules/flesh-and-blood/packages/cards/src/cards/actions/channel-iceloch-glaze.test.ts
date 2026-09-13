import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { jarlVetreiI } from "../heroes/jarl-vetrei-i.ts";
import { dash } from "../heroes/dash.ts";
import { frostbite } from "../tokens/frostbite.ts";
import { snatchRed } from "./snatch.ts";
import { channelIcelochGlazeBlue } from "./channel-iceloch-glaze.ts";

describe("Channel Iceloch Glaze (PEN229) AAA", () => {
  it("happy: enters the arena with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: jarlVetreiI,
        hand: [channelIcelochGlazeBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arsenal: [snatchRed], arena: [frostbite], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);

    Jarl.play(channelIcelochGlazeBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Jarl, channelIcelochGlazeBlue).toBeIn("arena");
    expectFabPlayer(Jarl).toHaveAP(1);
  });

  it("happy: opponent's arsenal is frozen while they control a Frostbite", () => {
    const game = FabTestEngine.start(
      {
        hero: jarlVetreiI,
        hand: [channelIcelochGlazeBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arsenal: [snatchRed], arena: [frostbite], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);
    const Dash = game.as(dash);

    Jarl.play(channelIcelochGlazeBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, snatchRed).toBeFrozen();
  });

  it("boundary: arsenal is not frozen when they control no Frostbite or frozen permanent", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [channelIcelochGlazeBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: jarlVetreiI, arsenal: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Jarl = game.as(jarlVetreiI);

    Dash.play(channelIcelochGlazeBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Jarl, snatchRed).notToBeFrozen();
  });

  it("timing: Channel Ice destroys the aura at end phase with no Ice in pitch", () => {
    const game = FabTestEngine.start(
      {
        hero: jarlVetreiI,
        hand: [channelIcelochGlazeBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);

    Jarl.play(channelIcelochGlazeBlue);
    game.helpers.resolveUntilIdle();
    Jarl.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Jarl, channelIcelochGlazeBlue).toBeIn("graveyard");
  });
});
