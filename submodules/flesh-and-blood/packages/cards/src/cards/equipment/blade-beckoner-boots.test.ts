import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { snatchRed } from "../actions/snatch.ts";
import { bladeBeckonerBoots } from "./blade-beckoner-boots.ts";

describe("Blade Beckoner Boots (HNT219) AAA", () => {
  it("happy: defending a weapon attack is d2; Guardwell leaves −2 counters", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, legs: [bladeBeckonerBoots], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(kassaiOfTheGoldenSand).activate(cintariSaber);
    game.advanceCombatTo("defend");
    Dash.defendWith(bladeBeckonerBoots);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Dash, bladeBeckonerBoots).toBeIn("legs");
    expectFabCard(Dash, bladeBeckonerBoots).toHaveDefenseCounters(-2);
  });

  it("boundary: defending an attack action is base d1; Guardwell leaves −1", () => {
    const game = FabTestEngine.start(
      { hero: kassaiOfTheGoldenSand, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, legs: [bladeBeckonerBoots], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(kassaiOfTheGoldenSand).attackWith(snatchRed);
    Dash.defendWith(bladeBeckonerBoots);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Dash, bladeBeckonerBoots).toBeIn("legs");
    expectFabCard(Dash, bladeBeckonerBoots).toHaveDefenseCounters(-1);
  });

  it("timing: Guardwell keeps the boots equipped after they defend", () => {
    const game = FabTestEngine.start(
      { hero: kassaiOfTheGoldenSand, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, legs: [bladeBeckonerBoots], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(kassaiOfTheGoldenSand).attackWith(snatchRed);
    Dash.defendWith(bladeBeckonerBoots);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, bladeBeckonerBoots).toHaveKeyword("guardwell");
    expectFabCard(Dash, bladeBeckonerBoots).toBeIn("legs");
  });
});
