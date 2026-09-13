import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { valdaBrightaxe } from "../heroes/valda-brightaxe.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { putEmInTheirPlaceRed } from "./put-em-in-their-place.ts";

describe("Put 'Em In Their Place (MPG018) AAA", () => {
  it("happy: crush discards their hand then draws that many", () => {
    const game = FabTestEngine.start(
      {
        hero: valdaBrightaxe,
        hand: [putEmInTheirPlaceRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Valda = game.as(valdaBrightaxe);
    const Dash = game.as(dash);

    Valda.attackWith(putEmInTheirPlaceRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(10);
    expectFabPlayer(Dash).toHaveHandCount(2);
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
  });

  it("boundary: less than 4 damage does not discard their hand", () => {
    const game = FabTestEngine.start(
      {
        hero: valdaBrightaxe,
        hand: [putEmInTheirPlaceRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Valda = game.as(valdaBrightaxe);
    const Dash = game.as(dash);

    Valda.attackWith(putEmInTheirPlaceRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(18);
    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabCard(Dash, snatchRed).toBeIn("hand");
  });
});
