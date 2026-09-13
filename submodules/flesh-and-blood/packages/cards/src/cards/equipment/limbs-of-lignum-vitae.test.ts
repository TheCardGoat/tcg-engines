import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { fertileGroundYellow } from "../instants/fertile-ground.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { limbsOfLignumVitae } from "./limbs-of-lignum-vitae.ts";

describe("Limbs of Lignum Vitae (PEN216) AAA", () => {
  it("happy: four Earth cards in banished raise the limbs to 2{d} while defending", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      {
        hero: dash,
        arms: [limbsOfLignumVitae],
        banished: [
          fertileGroundYellow,
          fertileGroundYellow,
          fertileGroundYellow,
          fertileGroundYellow,
        ],
        life: 20,
        deck: 6,
      },
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Blaze.playAttack(snatchRed);
    Dash.defendWith(limbsOfLignumVitae);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(18);
    expectFabCard(Dash, limbsOfLignumVitae).toBeIn("graveyard");
  });

  it("boundary: without the Earth count the limbs defend at printed 1{d}", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      {
        hero: dash,
        arms: [limbsOfLignumVitae],
        life: 20,
        deck: 6,
      },
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Blaze.playAttack(snatchRed);
    Dash.defendWith(limbsOfLignumVitae);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(17);
  });
});
