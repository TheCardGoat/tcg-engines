import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { timesnapPotionBlue } from "./timesnap-potion.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { drinkingBuddyRed } from "./drinking-buddy.ts";

describe("Drinking Buddy (LSS023) AAA", () => {
  it("happy: both heroes putting a Potion into the arena grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [drinkingBuddyRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [timesnapPotionBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: bravo,
        hand: [],
        life: 20,
        deck: [timesnapPotionBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(drinkingBuddyRed, { stopAt: "on-attack" });
    expectCombat(game).toHaveAttackPower(6);
    game.untilIdle({ optionals: "accept", entityTargets: "maximum" });

    expectFabCard(Dash, timesnapPotionBlue).toBeIn("arena");
    expectFabCard(game.as(bravo), timesnapPotionBlue).toBeIn("arena");
    expectFabPlayer(game.as(bravo)).toHaveLife(14);
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: a miss deals no damage", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [drinkingBuddyRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [nimblismBlue, nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(drinkingBuddyRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", optionals: "decline", entityTargets: "minimum" });
    Bravo.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("timing: declining both searches does not grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [drinkingBuddyRed, brutalAssaultBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(drinkingBuddyRed, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveAP(0);
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("hand");
  });
});
