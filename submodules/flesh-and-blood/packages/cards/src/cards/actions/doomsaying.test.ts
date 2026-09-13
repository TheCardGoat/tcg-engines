import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { doomsayingRed } from "./doomsaying.ts";

describe("Doomsaying (PEN097) AAA", () => {
  it("happy: at your end phase a doom counter is added then this aura is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [doomsayingRed],
        hand: [],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.untilIdle();

    expectFabCard(Bravo, doomsayingRed).toBeIn("graveyard");
  });

  it("boundary: this does not trigger on the opponent's end phase", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: bravo,
        arena: [doomsayingRed],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabCard(Bravo, doomsayingRed).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("timing: go again refunds AP when this is played as an action", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [doomsayingRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(doomsayingRed);
    game.untilIdle();

    expectFabCard(Bravo, doomsayingRed).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveAP(1);
  });
});
