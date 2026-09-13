import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { jarlVetreiI } from "../heroes/jarl-vetrei-i.ts";
import { dash } from "../heroes/dash.ts";
import { channelTheBleakExpanseBlue } from "./channel-the-bleak-expanse.ts";

describe("Channel the Bleak Expanse (UPR138) AAA", () => {
  it("happy: at your end phase this is destroyed when you decline the Ice pitch payment", () => {
    const game = FabTestEngine.start(
      {
        hero: jarlVetreiI,
        arena: [channelTheBleakExpanseBlue],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);

    Jarl.endTurn();
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Jarl, channelTheBleakExpanseBlue).toBeIn("graveyard");
  });

  it("boundary: this does not trigger on the opponent's end phase", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: jarlVetreiI,
        arena: [channelTheBleakExpanseBlue],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabCard(Jarl, channelTheBleakExpanseBlue).toBeIn("arena");
  });

  it("timing: Channel Ice adds a flow counter before the unless-destroy", () => {
    const game = FabTestEngine.start(
      {
        hero: jarlVetreiI,
        arena: [channelTheBleakExpanseBlue],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);

    Jarl.endTurn();
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Jarl, channelTheBleakExpanseBlue).toBeIn("graveyard");
  });
});
