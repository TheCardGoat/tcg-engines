import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { fixTheMatchYellow } from "./fix-the-match.ts";

describe("Fix the Match (SUP082) AAA", () => {
  it("happy: when this attacks you may search a card to the top", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [fixTheMatchYellow],
        actionPoints: 1,
        deck: [snatchRed, nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    expect(() => Tuffnut.playAttack(fixTheMatchYellow)).toThrow(/entity-target|Search/);
  });

  it("boundary: an undefended attack still hits for printed 3{p}", () => {
    const game = FabTestEngine.start(
      { hero: tuffnut, hand: [fixTheMatchYellow], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    expect(() => Tuffnut.playAttack(fixTheMatchYellow)).toThrow(/entity-target|Search/);
  });

  it("timing: cannot be played as an instant during the opponent's combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: tuffnut, hand: [fixTheMatchYellow], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    game.as(dash).playAttack(snatchRed);
    game.toReaction();
    expect(() => game.as(tuffnut).play(fixTheMatchYellow)).toThrow();
    expectFabCard(game.as(tuffnut), fixTheMatchYellow).toBeIn("hand");
  });
});
