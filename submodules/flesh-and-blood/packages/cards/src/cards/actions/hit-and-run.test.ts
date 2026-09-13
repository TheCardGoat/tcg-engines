import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { hitAndRunRed } from "./hit-and-run.ts";

describe("hit-and-run family AAA", () => {
  it("happy: after a weapon attack, the next attack this turn gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        hand: [hitAndRunRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.activate(dawnblade);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dori.play(hitAndRunRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Dori, hitAndRunRed).toBeIn("graveyard");

    Dori.attackWith(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: without a prior weapon attack, the next attack does not gain +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        hand: [hitAndRunRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(hitAndRunRed);
    game.helpers.resolveUntilIdle();
    Dori.attackWith(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the next weapon attack this turn gains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        hand: [hitAndRunRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(hitAndRunRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dori).toHaveAP(1);

    Dori.activate(dawnblade);
    game.passBoth();
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Dori).toHaveAP(1);
  });
});
