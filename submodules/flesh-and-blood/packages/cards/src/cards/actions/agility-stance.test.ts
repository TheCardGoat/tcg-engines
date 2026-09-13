import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { quicksilverDagger } from "../weapons/quicksilver-dagger.ts";
import { kassai } from "../heroes/kassai.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { agilityStanceYellow } from "./agility-stance.ts";

describe("Agility Stance (HNT125) AAA", () => {
  it("happy: at the start of your turn destroy this then dagger attacks get go again", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: kassai,
        arena: [agilityStanceYellow],
        weapon1: [quicksilverDagger],
        hand: [nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    game.as(dash).endTurn();
    game.untilIdle();
    expectFabCard(Kassai, agilityStanceYellow).toBeIn("graveyard");

    Kassai.activate(quicksilverDagger);
    game.answerDecision(Kassai.id, {
      kind: "payment",
      instanceIds: [Kassai.findCardInZone("hand", nimblismBlue)],
    });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveKeyword("go-again");
  });

  it("boundary: a Generic attack card does not get go again", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: kassai,
        arena: [agilityStanceYellow],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    game.as(dash).endTurn();
    game.untilIdle();
    Kassai.playAttack(snatchRed);
    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("timing: does not fire at the start of the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: kassai, arena: [agilityStanceYellow], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(kassai).endTurn();
    game.untilIdle();
    expectFabCard(game.as(kassai), agilityStanceYellow).toBeIn("arena");
  });
});
