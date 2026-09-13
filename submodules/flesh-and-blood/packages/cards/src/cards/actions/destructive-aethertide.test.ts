import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { destructiveAethertideBlue } from "./destructive-aethertide.ts";

describe("Destructive Aethertide (ROS166) AAA", () => {
  it("happy: deals 1 arcane without surge extras", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [destructiveAethertideBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(destructiveAethertideBlue, { targetInstanceId: Dash.ref(dash).instanceId });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabPlayer(Blaze).toHaveHandCount(0);
    expectFabCard(Blaze, destructiveAethertideBlue).toBeIn("graveyard");
  });

  it("boundary: dealing exactly 1 does not fire surge extras", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [destructiveAethertideBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(destructiveAethertideBlue, { targetInstanceId: Dash.ref(dash).instanceId });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabPlayer(Blaze).toHaveAP(0);
  });

  it("timing: after resolution the card is in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [destructiveAethertideBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(destructiveAethertideBlue, { targetInstanceId: Dash.ref(dash).instanceId });
    game.passBoth();

    expectFabCard(Blaze, destructiveAethertideBlue).toBeIn("graveyard");
  });
});
