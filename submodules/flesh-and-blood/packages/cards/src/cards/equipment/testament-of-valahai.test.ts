import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { testamentOfValahai } from "./testament-of-valahai.ts";

const surge = () => fabToken("seismic-surge");

describe("Testament of Valahai (MPG004) AAA", () => {
  it("happy: three Seismic Surge tokens give +2{d} (d1 → d3)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon2: [testamentOfValahai],
        arena: [surge(), surge(), surge()],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabCard(game.as(bravo), testamentOfValahai).toHaveDefense(3);
  });

  it("boundary: zero Seismic Surges leaves printed d1", () => {
    const game = FabTestEngine.start(
      { hero: bravo, weapon2: [testamentOfValahai], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabCard(game.as(bravo), testamentOfValahai).toHaveDefense(1);
  });

  it("timing: six Seismic Surges instead give +4{d} (d1 → d5)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon2: [testamentOfValahai],
        arena: [surge(), surge(), surge(), surge(), surge(), surge()],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabCard(game.as(bravo), testamentOfValahai).toHaveDefense(5);
  });
});
