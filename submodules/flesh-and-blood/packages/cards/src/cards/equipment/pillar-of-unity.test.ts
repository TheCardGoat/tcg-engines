import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { pillarOfUnity } from "./pillar-of-unity.ts";

describe("Pillar of Unity (PEN047) AAA", () => {
  it("happy: defending together with a hand card grants +1{d} (4 − (1+1+2) leak)", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        legs: [pillarOfUnity],
        hand: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith([pillarOfUnity, nimblismBlue]);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabCard(Bravo, pillarOfUnity).toBeIn("legs");
  });

  it("boundary: defending with only Pillar does not grant the +1{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        legs: [pillarOfUnity],
        hand: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(pillarOfUnity);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveLife(17);
    expectFabCard(Bravo, nimblismBlue).toBeIn("hand");
  });

  it("timing: +1{d} applies during this combat so together-defend is d2 while the link is open", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        legs: [pillarOfUnity],
        hand: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith([pillarOfUnity, nimblismBlue]);
    game.passBoth();

    expectFabCard(Bravo, pillarOfUnity).toHaveDefense(2);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveLife(20);
  });
});
