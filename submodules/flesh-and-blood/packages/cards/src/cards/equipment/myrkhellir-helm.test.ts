import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { gold } from "../tokens/gold.ts";
import { snatchRed } from "../actions/snatch.ts";
import { myrkhellirHelm } from "./myrkhellir-helm.ts";

describe("Myrkhellir Helm (PEN315) AAA", () => {
  it("happy: controlling a Gold gives this +1{d}; Temper leaves it seated after defending", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, head: [myrkhellirHelm], arena: [gold], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, myrkhellirHelm).toHaveDefense(2);
    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(myrkhellirHelm);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabCard(Bravo, myrkhellirHelm).toBeIn("head");
    expectFabCard(Bravo, myrkhellirHelm).toHaveDefenseCounters(-1);
  });

  it("boundary: no Gold — Temper destroys the d1 helm after it defends", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, head: [myrkhellirHelm], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, myrkhellirHelm).toHaveDefense(1);
    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(myrkhellirHelm);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(17);
    expectFabCard(Bravo, myrkhellirHelm).toBeIn("graveyard");
    expectFabCard(Bravo, myrkhellirHelm).toHaveKeyword("temper");
  });

  it("timing: destroy this so the next Gold draw this turn is 2 cards", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [myrkhellirHelm],
        arena: [gold],
        actionPoints: 2,
        resourcePoints: 4,
        hand: [],
        deck: 8,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(myrkhellirHelm);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, myrkhellirHelm).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(2);

    Bravo.activate(gold);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveHandCount(2);
  });
});
