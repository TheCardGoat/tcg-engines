import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { headJabRed } from "../actions/head-jab.ts";
import { katsu } from "../heroes/katsu.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { snatchRed } from "../actions/snatch.ts";
import { dyedSilkSleeves } from "./dyed-silk-sleeves.ts";

describe("Dyed Silk Sleeves (PEN032) AAA", () => {
  it("happy: burning the dagger pumps the Ninja attack, and a hit keeps the sleeves", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [headJabRed],
        weapon1: [nerveScalpel],
        arms: [dyedSilkSleeves],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: blazeFiremind, hand: [], life: 20, deck: 6 },
    );
    const Katsu = game.as(katsu);
    const Blaze = game.as(blazeFiremind);

    Katsu.playAttack(headJabRed);
    Blaze.defendWith();
    game.toReaction("attacker");
    Katsu.activate(dyedSilkSleeves);
    Katsu.target(nerveScalpel);
    game.passBoth();

    expectFabCard(Katsu, nerveScalpel).toBeIn("graveyard");
    expectFabCard(Katsu, dyedSilkSleeves).toBeIn("arms");
    expectFabPlayer(Blaze).toHaveLife(16);
  });

  it("boundary: a miss destroys the sleeves at chain-link resolve", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [headJabRed],
        weapon1: [nerveScalpel],
        arms: [dyedSilkSleeves],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: blazeFiremind,
        hand: [brutalAssaultBlue, snatchRed],
        life: 20,
        deck: 6,
      },
    );
    const Katsu = game.as(katsu);
    const Blaze = game.as(blazeFiremind);

    Katsu.playAttack(headJabRed);
    Blaze.defendWith(brutalAssaultBlue, snatchRed);
    game.toReaction("attacker");
    Katsu.activate(dyedSilkSleeves);
    Katsu.target(nerveScalpel);
    game.passBoth();

    expectFabPlayer(Blaze).toHaveLife(20);
    expectFabCard(Katsu, dyedSilkSleeves).toBeIn("graveyard");
    expectFabCard(Katsu, nerveScalpel).toBeIn("graveyard");
  });
});
