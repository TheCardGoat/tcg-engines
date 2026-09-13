import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { glovesOfAzureWaves } from "./gloves-of-azure-waves.ts";

describe("Gloves of Azure Waves (PEN167) AAA", () => {
  it("happy: two blue pitches give +3{d} and the granted Blade Break recycles them", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: blazeFiremind,
        hand: [],
        pitch: [nimblismBlue, nimblismBlue],
        arms: [glovesOfAzureWaves],
        life: 20,
        deck: 6,
      },
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Blaze.defendWith(glovesOfAzureWaves);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Blaze).toHaveLife(19);
    // The granted Blade Break destroys the defending gloves at chain close.
    expectFabCard(Blaze, glovesOfAzureWaves).toBeIn("graveyard");
  });

  it("boundary: with fewer than two blue pitches the gloves defend at printed 0{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: blazeFiremind,
        hand: [],
        pitch: [nimblismBlue],
        arms: [glovesOfAzureWaves],
        life: 20,
        deck: 6,
      },
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Blaze.defendWith(glovesOfAzureWaves);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Blaze).toHaveLife(16);
    // No granted Blade Break: the gloves stay equipped.
    expectFabCard(Blaze, glovesOfAzureWaves).toBeIn("arms");
  });
});
