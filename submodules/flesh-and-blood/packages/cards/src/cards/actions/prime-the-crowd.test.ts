import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { primeTheCrowdRed } from "./prime-the-crowd.ts";

describe("Prime the Crowd (SUP236) AAA", () => {
  it("happy: next attack action card gets +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [primeTheCrowdRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(primeTheCrowdRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, primeTheCrowdRed).toBeIn("graveyard");

    Bravo.playAttack(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(8);
  });

  it("boundary: a later second attack action is not buffed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [primeTheCrowdRed, snatchRed, brutalAssaultBlue],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(primeTheCrowdRed);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(8);
    game.helpers.resolveRestOfCombat();

    Bravo.playAttack(brutalAssaultBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("timing: go again refunds the play AP", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [primeTheCrowdRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(primeTheCrowdRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveAP(1);
    expect(game.combat()).toBeNull();
  });
});
