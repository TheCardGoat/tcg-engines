import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { toughness } from "../tokens/toughness.ts";
import { snatchRed } from "./snatch.ts";
import { alphaRampageRed } from "./alpha-rampage.ts";
import { nimblismBlue } from "./nimblism.ts";
import { noHeroStandsAloneYellow } from "./no-hero-stands-alone.ts";

describe("No Hero Stands Alone (SUP020) AAA", () => {
  it("happy: controlling a Toughness this turn gives this +3{d} and ambush in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [noHeroStandsAloneYellow],
        arena: [toughness],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Tuffnut = game.as(tuffnut);

    expectFabCard(Tuffnut, noHeroStandsAloneYellow).toHaveKeyword("ambush");
    expectFabCard(Tuffnut, noHeroStandsAloneYellow).toHaveDefense(3);
  });

  it("boundary: without a Toughness token this turn, this has no ambush in hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: tuffnut, hand: [noHeroStandsAloneYellow], deck: 6 },
    );
    const Tuffnut = game.as(tuffnut);

    expectFabCard(Tuffnut, noHeroStandsAloneYellow).notToHaveKeyword("ambush");
    expectFabCard(Tuffnut, noHeroStandsAloneYellow).toHaveDefense(0);
  });

  it("timing: a Toughness carried into the opponent's turn gives this ambush and +4{d} from arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        arsenal: [noHeroStandsAloneYellow],
        arena: [toughness],
        actionPoints: 1,
        deckTop: [alphaRampageRed],
      },
      { hero: dash, hand: [snatchRed], life: 20, deckTop: [nimblismBlue] },
      { autoPassPriority: false },
    );
    const Tuffnut = game.as(tuffnut);
    const Dash = game.as(dash);

    Tuffnut.endTurn();
    game.passBoth();
    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 0);

    Dash.playAttack(snatchRed);
    Tuffnut.defendWith(noHeroStandsAloneYellow);

    expectFabCard(Tuffnut, noHeroStandsAloneYellow).toHaveKeyword("ambush");
    expectFabCard(Tuffnut, noHeroStandsAloneYellow).toHaveDefense(4);

    game.untilIdle({ optionals: "accept", entityTargets: "pause" });
    Tuffnut.targetRequired(noHeroStandsAloneYellow, { identity: "source" });
    game.passBoth();

    expectFabCard(Tuffnut, noHeroStandsAloneYellow).toHavePower(3);
    expectFabCard(Tuffnut, noHeroStandsAloneYellow).toHaveDefense(1);
  });
});
