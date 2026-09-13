import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { snatchRed } from "../actions/snatch.ts";
import { razorReflexRed } from "./razor-reflex.ts";

const modeId = (card: typeof razorReflexRed, mode: "weapon" | "attackAction") =>
  `${card.canonicalId}:chooseMode:${mode}`;

describe("Razor Reflex family AAA", () => {
  it("happy: the weapon mode gives a sword attack +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [razorReflexRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activateAttack(cintariSaber);
    game.toReaction("attacker");
    Kassai.must.playReaction(razorReflexRed, { modeIds: [modeId(razorReflexRed, "weapon")] });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Kassai, razorReflexRed).toBeIn("graveyard");
  });

  it("boundary: the attack-action mode cannot target a cost-2 attack", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [razorReflexRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.playAttack(brutalAssaultBlue);
    game.toReaction("attacker");
    expectFabUnplayable(() =>
      Kassai.must.playReaction(razorReflexRed, {
        modeIds: [modeId(razorReflexRed, "attackAction")],
      }),
    );
    expectFabCard(Kassai, razorReflexRed).toBeIn("hand");
  });

  it("timing: a hit after the attack-action mode grants Go again", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [razorReflexRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.playAttack(snatchRed);
    game.toReaction("attacker");
    Kassai.must.playReaction(razorReflexRed, {
      modeIds: [modeId(razorReflexRed, "attackAction")],
    });
    game.passBoth();
    expectCombat(game).toHaveAttackPower(7);

    game.untilIdle({ entityTargets: "minimum", ordering: "listed" });
    expectFabPlayer(Kassai).toHaveAP(1);
  });
});
