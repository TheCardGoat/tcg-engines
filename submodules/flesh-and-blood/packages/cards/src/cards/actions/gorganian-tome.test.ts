import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { gorganianTome } from "./gorganian-tome.ts";

describe("Gorganian Tome (CRU181) AAA", () => {
  it("happy: draws 1 when no Tomes are in graveyards", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [gorganianTome], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(gorganianTome);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabCard(Dash, gorganianTome).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: draws 2 when one Tome is already in a graveyard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [gorganianTome], graveyard: [gorganianTome], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(gorganianTome);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveHandCount(2);
  });

  it("timing: go again refunds the action point spent to play the Tome", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [gorganianTome], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(gorganianTome);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveAP(1);
    expectFabCard(Dash, gorganianTome).toBeIn("graveyard");
  });
});
