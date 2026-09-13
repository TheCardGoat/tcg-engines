import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { sinkBelowRed } from "../defense-reactions/sink-below.ts";
import { heartOfIce } from "./heart-of-ice.ts";

describe("Heart of Ice (ELE144) AAA", () => {
  it("happy: Action {r} spends a resource, grants go again, and opposing cards cost +1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [heartOfIce],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [sinkBelowRed], resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    expectFabCard(Bravo, heartOfIce).toHaveKeyword("blade-break");

    Bravo.activate(heartOfIce);
    game.passBoth();

    expectFabPlayer(Bravo).toHaveResourceCount(0);
    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabCard(Bravo, heartOfIce).toHaveKeyword("arcane-barrier");

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("reaction");

    // Printed cost-up applies when the opponent plays — Sink Below is {r}0,
    // so 0 remaining resources must be insufficient after the +1{r}.
    expect(() => Dash.must.playReaction(sinkBelowRed)).toThrow();
  });

  it("boundary: once per turn — a second activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [heartOfIce],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(heartOfIce);
    Bravo.expectActivationRejected(heartOfIce);
  });

  it("timing: Blade Break destroys Heart of Ice after it defends", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, chest: [heartOfIce], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(heartOfIce);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Bravo, heartOfIce).toBeIn("graveyard");
  });
});
