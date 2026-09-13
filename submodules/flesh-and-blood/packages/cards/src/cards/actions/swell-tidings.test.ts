import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { swellTidingsRed } from "./swell-tidings.ts";

describe("Swell Tidings (DYN195) AAA", () => {
  it("happy: deals 5 arcane without surge extras", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [swellTidingsRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(swellTidingsRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabPlayer(Blaze).toHaveHandCount(0);
    expectFabCard(Blaze, swellTidingsRed).toBeIn("graveyard");
    expectFabPlayer(Blaze).toHaveTokenCount("ponder", 0);
  });

  it("boundary: unpayable cost keeps the card in hand", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [swellTidingsRed], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    expectFabUnplayable(() => Blaze.play(swellTidingsRed, { target: game.as(dash).id }));
    expectFabCard(Blaze, swellTidingsRed).toBeIn("hand");
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("timing: after resolution the card is in the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [swellTidingsRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(swellTidingsRed, { target: game.as(dash).id });
    game.passBoth();

    expectFabCard(Blaze, swellTidingsRed).toBeIn("graveyard");
  });
});
