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
import { headlinerHelm } from "./headliner-helm.ts";

describe("Headliner Helm (HVY202) AAA", () => {
  it("happy: opponent with greater {h} sets this to 1{d}; defend then Blade Break", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      { hero: bravo, life: 15, head: [headlinerHelm], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, headlinerHelm).toHaveDefense(1);
    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(headlinerHelm);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(12);
    expectFabCard(Bravo, headlinerHelm).toBeIn("graveyard");
  });

  it("boundary: equal life sets this to 0{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, head: [headlinerHelm], life: 20, hand: [], deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabCard(game.as(bravo), headlinerHelm).toHaveDefense(0);
    expectFabCard(game.as(bravo), headlinerHelm).toHaveKeyword("blade-break");
  });

  it("timing: Blade Break destroys this after it defends at 0{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      { hero: bravo, life: 20, head: [headlinerHelm], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(headlinerHelm);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabCard(Bravo, headlinerHelm).toBeIn("graveyard");
  });
});
