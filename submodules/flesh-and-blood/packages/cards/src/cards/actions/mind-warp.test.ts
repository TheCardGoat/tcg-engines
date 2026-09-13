import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { mindWarpYellow } from "./mind-warp.ts";

describe("Mind Warp (DYN194) AAA", () => {
  it("happy: deals 2 arcane without surge extras", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [mindWarpYellow], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(mindWarpYellow, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(18);
    expectFabPlayer(Blaze).toHaveHandCount(0);
    expectFabCard(Blaze, mindWarpYellow).toBeIn("graveyard");
  });

  it("boundary: dealing exactly 2 does not fire surge extras", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [mindWarpYellow], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(mindWarpYellow, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(18);
    expectFabPlayer(Blaze).toHaveAP(0);
  });

  it("timing: after resolution the card is in the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [mindWarpYellow], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(mindWarpYellow, { target: game.as(dash).id });
    game.passBoth();

    expectFabCard(Blaze, mindWarpYellow).toBeIn("graveyard");
  });
});
