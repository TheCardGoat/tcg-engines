import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { headJabRed } from "./head-jab.ts";

describe("Head Jab (KSU011) family behavior AAA", () => {
  it("happy: a red Head Jab has 3 power and go again refunds its action point", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [headJabRed], actionPoints: 1, resourcePoints: 0, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(headJabRed);
    expectCombat(game).toHaveAttackPower(3).toHaveKeyword("go-again");
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(17);
    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabCard(Bravo, headJabRed).toBeIn("graveyard");
  });

  it("boundary: a fully defended Head Jab still refunds action points but deals no damage", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [headJabRed], actionPoints: 1, resourcePoints: 0, deck: 6 },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(headJabRed);
    game.as(dash).defendWith(brutalAssaultBlue);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(20);
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("timing: Head Jab cannot be played as an instant during the reaction step", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [brutalAssaultBlue, headJabRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(brutalAssaultBlue);
    game.toReaction("attacker");
    expectFabUnplayable(
      () => Dash.must.playReaction(headJabRed),
      /action card is not legal|arrow can only be played/i,
    );
    expectFabCard(Dash, headJabRed).toBeIn("hand");
  });
});
