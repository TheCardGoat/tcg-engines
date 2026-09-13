import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { sinkBelowRed } from "../defense-reactions/sink-below.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { duelistGauntlets } from "./duelist-gauntlets.ts";

/**
 * Duelist Gauntlets — Warrior Arms d1 Battleworn.
 *
 * Printed: Attack Reaction - {r}, destroy this: Target sword attack gets
 * "Reaction cards get -1{d} while defending this."
 */

describe("Duelist Gauntlets AAA", () => {
  it("happy: a defending Sink Below Red is 3{d} instead of 4{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        arms: [duelistGauntlets],
        weapon1: [cintariSaber],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [sinkBelowRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);
    const Dash = game.as(dash);

    Kassai.activate(cintariSaber);
    game.toReaction("attacker");
    Kassai.activate(duelistGauntlets);
    game.passBoth();
    expectFabCard(Kassai, duelistGauntlets).toBeIn("graveyard");

    game.toReaction("defender");
    Dash.must.playReaction(sinkBelowRed);
    game.passBoth();
    expectFabCard(Dash, sinkBelowRed).toHaveDefense(3);
    game.closeCombat({ optionals: "decline" });
    // Cintari 2 vs 3{d} → no damage.
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: without the gauntlets Sink Below Red still defends for 4{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [sinkBelowRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(kassaiOfTheGoldenSand).activate(cintariSaber);
    game.toReaction("defender");
    Dash.must.playReaction(sinkBelowRed);
    game.passBoth();
    expectFabCard(Dash, sinkBelowRed).toHaveDefense(4);
    expectCombat(game).toHaveAttackPower(2);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
