import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { snatchRed } from "../actions/snatch.ts";
import { robeOfResourcefulness } from "./robe-of-resourcefulness.ts";

describe("Robe of Resourcefulness (PEN108) AAA", () => {
  it("happy: Blade Break leaves the robe to the graveyard and grants {r}{r}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: blazeFiremind,
        hand: [],
        resourcePoints: 0,
        chest: [robeOfResourcefulness],
        life: 20,
        deck: 6,
      },
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Blaze.defendWith(robeOfResourcefulness);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Blaze, robeOfResourcefulness).toBeIn("graveyard");
    expectFabPlayer(Blaze).toHaveResourceCount(2);
    expectFabPlayer(Blaze).toHaveLife(16);
  });

  it("boundary: a robe that stays equipped grants nothing", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: blazeFiremind,
        hand: [],
        resourcePoints: 0,
        chest: [robeOfResourcefulness],
        life: 20,
        deck: 6,
      },
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Blaze.defendWith();
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Blaze, robeOfResourcefulness).toBeIn("chest");
    expectFabPlayer(Blaze).toHaveResourceCount(0);
    expectFabPlayer(Blaze).toHaveLife(16);
  });
});
