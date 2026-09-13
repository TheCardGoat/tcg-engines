import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { tradeInRed } from "./trade-in.ts";

describe("Trade In (FAI021) AAA", () => {
  it("happy: on attack, discard a card to draw a card", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [tradeInRed, nimblismBlue],
        actionPoints: 1,
        deckTop: [snatchRed],
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(tradeInRed);
    game.passBoth();
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: nimblismBlue.canonicalId,
    });

    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expectFabCard(Dash, snatchRed).toBeIn("hand");
    expectFabPlayer(game.as(bravo)).toHaveLife(17);
  });

  it("boundary: declining the discard draws nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [tradeInRed, nimblismBlue],
        actionPoints: 1,
        deckTop: [snatchRed],
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(tradeInRed);
    game.passBoth();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
    expectFabPlayer(Dash).toHaveAP(0);
  });

  it("timing: played from arsenal it gains go again; from hand it does not", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arsenal: [tradeInRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(tradeInRed, { from: "arsenal" });
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveAP(1);
  });
});
