import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { rapidReflexYellow } from "../attack-reactions/rapid-reflex.ts";
import { snatchRed } from "../actions/snatch.ts";
import { bloodrotTrapRed } from "./bloodrot-trap.ts";

describe("Bloodrot Trap (ARA019) family behavior AAA", () => {
  it("happy: defending after the attacking hero played a reaction creates Bloodrot Pox under them", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, rapidReflexYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [bloodrotTrapRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(snatchRed);
    game.toReaction("attacker");
    Bravo.play(rapidReflexYellow);

    expectFabPlayer(Bravo).toHaveTokenCount("bloodrot-pox", 0);
    game.toReaction("defender");
    Dash.must.playReaction(bloodrotTrapRed);
    game.passBoth();
    game.passBoth();

    expectFabCard(Dash, bloodrotTrapRed).toBeIn("combatChain");
    expectFabPlayer(Bravo).toHaveTokenCount("bloodrot-pox", 1);
  });

  it("boundary: defending with no attacking-hero reaction this link creates no Bloodrot Pox", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [bloodrotTrapRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(snatchRed);
    game.toReaction("defender");
    Dash.must.playReaction(bloodrotTrapRed);
    game.passBoth();

    expectFabCard(Dash, bloodrotTrapRed).toBeIn("combatChain");
    expectFabPlayer(game.as(bravo)).toHaveTokenCount("bloodrot-pox", 0);
    expectFabPlayer(Dash).toHaveTokenCount("bloodrot-pox", 0);
  });
});
