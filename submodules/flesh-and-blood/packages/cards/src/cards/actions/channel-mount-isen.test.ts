import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { jarlVetreiI } from "../heroes/jarl-vetrei-i.ts";
import { dash } from "../heroes/dash.ts";
import { channelMountIsenBlue } from "./channel-mount-isen.ts";

/**
 * Channel Mount Isen (AJV017) — Ice Action Aura. Go again.
 * Printed: At the start of each hero's turn, they lose {h} equal to the number
 * of Frostbites in their equipment zones. Channel Ice — end phase flow then
 * unless-destroy.
 */

describe("Channel Mount Isen (AJV017) AAA", () => {
  it("happy: start of turn lose {h} equal to Frostbites you control", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: jarlVetreiI,
        arena: [channelMountIsenBlue, fabToken("frostbite")],
        hand: [],
        life: 40,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabPlayer(game.as(jarlVetreiI)).toHaveLife(39);
  });

  it("boundary: with no Frostbites, start of turn loses no life", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: jarlVetreiI,
        arena: [channelMountIsenBlue],
        hand: [],
        life: 40,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabPlayer(game.as(jarlVetreiI)).toHaveLife(40);
  });

  it("timing: Channel Ice destroys this at your end phase when you decline the Ice pitch", () => {
    const game = FabTestEngine.start(
      {
        hero: jarlVetreiI,
        arena: [channelMountIsenBlue],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);

    Jarl.endTurn();
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Jarl, channelMountIsenBlue).toBeIn("graveyard");
  });
});
