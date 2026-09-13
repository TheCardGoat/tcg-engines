import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { jarlVetreiI } from "../heroes/jarl-vetrei-i.ts";
import { dash } from "../heroes/dash.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { snatchRed } from "./snatch.ts";
import { channelLakeFrigidBlue } from "./channel-lake-frigid.ts";

describe("Channel Lake Frigid (ELE146) AAA", () => {
  it("happy: opposing cards cost an additional {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: jarlVetreiI,
        hand: [channelLakeFrigidBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);
    const Dash = game.as(dash);

    Jarl.play(channelLakeFrigidBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Jarl, channelLakeFrigidBlue).toBeIn("arena");
    expectFabPlayer(Jarl).toHaveAP(1);
    expect(() => Dash.attackWith(snatchRed)).toThrow();
  });

  it("boundary: the controller's own cards are not taxed", () => {
    const game = FabTestEngine.start(
      {
        hero: jarlVetreiI,
        hand: [channelLakeFrigidBlue, autumnSTouchBlue],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);

    Jarl.play(channelLakeFrigidBlue);
    game.helpers.resolveUntilIdle();
    Jarl.attackWith(autumnSTouchBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(5);
  });

  it("timing: Channel Ice destroys the aura at end phase with no Ice in pitch", () => {
    const game = FabTestEngine.start(
      {
        hero: jarlVetreiI,
        hand: [channelLakeFrigidBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);

    Jarl.play(channelLakeFrigidBlue);
    game.helpers.resolveUntilIdle();
    Jarl.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Jarl, channelLakeFrigidBlue).toBeIn("graveyard");
  });
});
