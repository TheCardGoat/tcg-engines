import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { snatchRed } from "../actions/snatch.ts";
import { channelLightningValleyYellow } from "./channel-lightning-valley.ts";

describe("Channel Lightning Valley (ROS077) AAA", () => {
  it("happy: the first damage to an opposing hero each turn draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [channelLightningValleyYellow, volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 5,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(channelLightningValleyYellow);
    game.helpers.resolveUntilIdle();
    Kano.play(volticBoltRed, { target: Dash.id });
    game.untilIdle();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Kano, snatchRed).toBeIn("hand");
  });

  it("boundary: a second damage event the same turn does not draw again", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [channelLightningValleyYellow, volticBoltRed, volticBoltRed],
        resourcePoints: 4,
        actionPoints: 2,
        deckTop: [snatchRed, snatchRed],
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(channelLightningValleyYellow);
    game.helpers.resolveUntilIdle();
    Kano.play(volticBoltRed, { target: Dash.id });
    game.untilIdle();
    Kano.play(volticBoltRed, { target: Dash.id });
    game.untilIdle();

    expectFabPlayer(Dash).toHaveLife(10);
    expectFabPlayer(Kano).toHaveHandCount(1);
  });

  it("timing: Channel Lightning destroys this at end phase with no Lightning in pitch", () => {
    const game = FabTestEngine.start(
      { hero: kano, hand: [channelLightningValleyYellow], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    Kano.play(channelLightningValleyYellow);
    game.helpers.resolveUntilIdle();
    Kano.endTurn();
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Kano, channelLightningValleyYellow).toBeIn("graveyard");
  });
});
