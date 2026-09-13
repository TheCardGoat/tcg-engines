import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { solforgeGauntlet } from "./solforge-gauntlet.ts";

describe("Solforge Gauntlet (PEN179) AAA", () => {
  it("happy: defending sends the gauntlet to the soul when the chain closes", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      { hero: dash, hand: [], arms: [solforgeGauntlet], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Blaze.playAttack(snatchRed);
    Dash.defendWith(solforgeGauntlet);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Dash, solforgeGauntlet).toBeIn("soul");
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: a gauntlet that never defends stays equipped", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      { hero: dash, hand: [], arms: [solforgeGauntlet], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Blaze.playAttack(snatchRed);
    Dash.defendWith();
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Dash, solforgeGauntlet).toBeIn("arms");
    expectFabPlayer(Dash).toHaveLife(16);
  });
});
