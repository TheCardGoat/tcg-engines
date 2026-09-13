import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { heraldOfJudgmentYellow } from "../actions/herald-of-judgment.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { luminarisAngelSGlow } from "./luminaris-angel-s-glow.ts";

describe("Luminaris, Angel's Glow (HVY254) AAA", () => {
  it("boundary: without a yellow in pitch the Herald does not get go again", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        weapon1: [luminarisAngelSGlow],
        hand: [heraldOfJudgmentYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    Prism.playAttack(heraldOfJudgmentYellow);
    expectCombat(game).notToHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Prism).toHaveAP(0);
  });

  it("boundary: a non-Herald attack does not receive the grant", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        weapon1: [luminarisAngelSGlow],
        hand: [snatchRed, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    Prism.playAttack(snatchRed, { pitch: [nimblismBlue] });
    expectCombat(game).notToHaveKeyword("go-again");
  });
});
