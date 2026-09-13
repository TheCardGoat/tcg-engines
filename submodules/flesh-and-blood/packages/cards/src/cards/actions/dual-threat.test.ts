import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { dualThreatYellow } from "./dual-threat.ts";

describe("Dual Threat (HNT223) AAA", () => {
  it("happy: after a weapon attack, the next AAC this turn gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [cintariSaber],
        hand: [dualThreatYellow, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(cintariSaber);
    game.passBoth();
    game.closeCombat({ optionals: "decline" });

    Dash.play(dualThreatYellow);
    game.helpers.resolveUntilIdle();
    Dash.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: without a weapon attack this turn the next AAC stays at printed {p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [dualThreatYellow, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(dualThreatYellow);
    game.helpers.resolveUntilIdle();
    Dash.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the Action AP spent to play Dual Threat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [dualThreatYellow], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(dualThreatYellow);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveAP(1);
    expect(game.combat()).toBeNull();
  });
});
