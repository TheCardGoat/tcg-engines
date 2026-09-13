import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { snatchRed } from "../actions/snatch.ts";
import { thunderousRetortRed } from "./thunderous-retort.ts";

describe("Thunderous Retort AAA", () => {
  it("happy: your action-phase start destroys this then your next attack gets go again", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: briar,
        arena: [thunderousRetortRed],
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
    );
    const Briar = game.as(briar);

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabCard(Briar, thunderousRetortRed).toBeIn("graveyard");

    Briar.playAttack(snatchRed);
    expectCombat(game).toHaveKeyword("go-again");
  });

  it("boundary: attacking before your action-phase start does not get go again", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        arena: [thunderousRetortRed],
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Briar = game.as(briar);

    expectFabCard(Briar, thunderousRetortRed).toBeIn("arena");
    Briar.playAttack(snatchRed);
    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("timing: opponent action-phase start does not destroy this", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        arena: [thunderousRetortRed],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Briar = game.as(briar);

    Briar.endTurn();
    game.untilIdle();
    expectFabCard(Briar, thunderousRetortRed).toBeIn("arena");
  });
});
