import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { readTheRipplesRed } from "./read-the-ripples.ts";

describe("Read the Ripples (UPR176) AAA", () => {
  it("happy: at your end phase this is destroyed then you draw a card", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        arena: [readTheRipplesRed],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    Kano.endTurn();
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Kano, readTheRipplesRed).toBeIn("graveyard");
  });

  it("boundary: this does not trigger on the opponent's end phase", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: kano,
        arena: [readTheRipplesRed],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabCard(Kano, readTheRipplesRed).toBeIn("arena");
  });

  it("timing: Opt on play keeps the looked card on top under listed ordering", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [readTheRipplesRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    Kano.play(readTheRipplesRed);
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Kano, readTheRipplesRed).toBeIn("arena");
  });
});
