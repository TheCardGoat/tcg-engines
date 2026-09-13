import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { lunartidePlundererYellow } from "../actions/lunartide-plunderer.ts";
import { snatchRed } from "../actions/snatch.ts";
import { blindingBeamRed } from "./blinding-beam.ts";

describe("Blinding Beam (MON084/085/086) AAA", () => {
  it("happy: targeting a Shadow attack reduces cost and gives -3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [lunartidePlundererYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: boltyn, hand: [blindingBeamRed], resourcePoints: 1, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: chane },
    );
    const Chane = game.as(chane);
    const Boltyn = game.as(boltyn);

    Chane.playAttack(lunartidePlundererYellow);
    game.advanceCombatTo("reaction");
    Chane.pass();
    Boltyn.play(blindingBeamRed, {
      targetInstanceId: Chane.cardIn("combatChain", lunartidePlundererYellow).instanceId,
    });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(3);
    expectFabPlayer(Boltyn).toHaveResourceCount(1);
    expectFabCard(Boltyn, blindingBeamRed).toBeIn("graveyard");
  });

  it("boundary: a Generic attack pays the printed cost", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [snatchRed, blindingBeamRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Boltyn.playAttack(snatchRed);
    Dash.pass();
    Boltyn.play(blindingBeamRed, {
      targetInstanceId: Boltyn.cardIn("combatChain", snatchRed).instanceId,
    });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(1);
    expectFabPlayer(Boltyn).toHaveResourceCount(0);
  });

  it("timing: without resources a Generic target remains unplayable", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [snatchRed, blindingBeamRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Boltyn.playAttack(snatchRed);
    Dash.pass();
    expectFabUnplayable(() => Boltyn.play(blindingBeamRed));
    expectFabCard(Boltyn, blindingBeamRed).toBeIn("hand");
  });
});
