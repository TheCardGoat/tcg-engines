import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kayoUnderhandedCheat } from "../heroes/kayo-underhanded-cheat.ts";
import { rapturousApplauseYellow } from "./rapturous-applause.ts";
import { snatchRed } from "./snatch.ts";
import { fightDirtyRed } from "./fight-dirty.ts";

describe("Fight Dirty (SUP089) AAA", () => {
  it("happy: defended by a Revered action gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoUnderhandedCheat,
        hand: [fightDirtyRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [rapturousApplauseYellow], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoUnderhandedCheat);
    const Dash = game.as(dash);

    Kayo.playAttack(fightDirtyRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(rapturousApplauseYellow);
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: a Generic action defender does not add {p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoUnderhandedCheat,
        hand: [fightDirtyRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoUnderhandedCheat);
    const Dash = game.as(dash);

    Kayo.playAttack(fightDirtyRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(snatchRed);
    expectCombat(game).toHaveAttackPower(7);
  });
});
