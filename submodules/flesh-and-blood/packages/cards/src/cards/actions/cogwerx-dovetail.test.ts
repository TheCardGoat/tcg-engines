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
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { goldenCog } from "../tokens/golden-cog.ts";
import { cogwerxDovetailRed } from "./cogwerx-dovetail.ts";

describe("Cogwerx Dovetail (SEA011) AAA", () => {
  it("happy: hitting a hero untaps all cogs you control", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cogwerxDovetailRed],
        arena: [{ card: goldenCog, state: { tapped: true } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(cogwerxDovetailRed);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Dash, goldenCog).toBeReady();
    expectFabPlayer(game.as(bravo)).toHaveLife(15);
  });

  it("boundary: a miss does not untap your cogs", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cogwerxDovetailRed],
        arena: [{ card: goldenCog, state: { tapped: true } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [brutalAssaultBlue, brutalAssaultBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(cogwerxDovetailRed);
    Bravo.defendWith(brutalAssaultBlue, brutalAssaultBlue);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Dash, goldenCog).toBeTapped();
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("timing: thrice-per-turn tap-a-cog may grant +1{p} while the chain is open", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cogwerxDovetailRed],
        arena: [goldenCog],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(cogwerxDovetailRed, { stopAt: "defend" });
    Bravo.pass();
    Dash.activate(cogwerxDovetailRed);
    Dash.target(goldenCog);
    game.passBoth();
    Dash.choose("option-0");
    game.passBoth();

    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Dash, goldenCog).toBeTapped();
  });
});
