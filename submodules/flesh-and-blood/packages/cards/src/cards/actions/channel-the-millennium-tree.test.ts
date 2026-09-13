import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { volticBoltRed } from "./voltic-bolt.ts";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { nimblismBlue } from "./nimblism.ts";
import { channelTheMillenniumTreeRed } from "./channel-the-millennium-tree.ts";

describe("Channel the Millennium Tree (ROS033) AAA", () => {
  it("happy: entering the arena amps 3 and go again refunds the play AP", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [channelTheMillenniumTreeRed, volticBoltRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(channelTheMillenniumTreeRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Briar, channelTheMillenniumTreeRed).toBeIn("arena");
    expectFabPlayer(Briar).toHaveAP(1);

    Briar.play(volticBoltRed, { target: Dash.id });
    game.untilIdle();

    expectFabPlayer(Dash).toHaveLife(12);
  });

  it("boundary: Channel Earth destroys this at end phase with no Earth in pitch", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [channelTheMillenniumTreeRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(channelTheMillenniumTreeRed);
    game.helpers.resolveUntilIdle();
    Briar.endTurn();
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Briar, channelTheMillenniumTreeRed).toBeIn("graveyard");
  });

  it("timing: amp 3 at the beginning of your action phase applies to the next arcane", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: briar,
        arena: [channelTheMillenniumTreeRed],
        hand: [volticBoltRed, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Briar = game.as(briar);

    Dash.endTurn();
    game.untilIdle();
    Briar.must.pitch(nimblismBlue).play(volticBoltRed, { target: Dash.id });
    game.untilIdle();

    expectFabPlayer(Dash).toHaveLife(12);
  });
});
