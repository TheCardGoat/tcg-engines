import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { lungingPressBlue } from "../attack-reactions/lunging-press.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { chainOfBrutalityRed } from "./chain-of-brutality.ts";

describe("Chain of Brutality (PEN297) AAA", () => {
  it("happy: 6 or more {p} refunds AP and sets the next AAC to 6 base {p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [chainOfBrutalityRed, lungingPressBlue, lungingPressBlue, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 40, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const presses = Bravo.cardsIn("hand", lungingPressBlue);
    Bravo.playAttack(chainOfBrutalityRed);
    game.advanceCombatTo("reaction");
    Bravo.must.playReaction(presses[0]!);
    game.passBoth();
    Bravo.must.playReaction(presses[1]!);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    Bravo.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: printed 2{p} does not set the next attack to 6 base", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [chainOfBrutalityRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    Bravo.playAttack(chainOfBrutalityRed);
    expectCombat(game).toHaveAttackPower(2);
    game.closeCombat();
    Bravo.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again from 6{p} refunds AP after this attack", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [chainOfBrutalityRed, lungingPressBlue, lungingPressBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const presses = Bravo.cardsIn("hand", lungingPressBlue);
    Bravo.playAttack(chainOfBrutalityRed);
    game.advanceCombatTo("reaction");
    Bravo.must.playReaction(presses[0]!);
    game.passBoth();
    Bravo.must.playReaction(presses[1]!);
    game.passBoth();
    game.closeCombat();
    expectFabPlayer(Bravo).toHaveAP(1);
  });
});
