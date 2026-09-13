import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { roninRenegadeBlue } from "./ronin-renegade.ts";
import { spreadingFlamesRed } from "./spreading-flames.ts";

describe("Spreading Flames (UPR049) AAA", () => {
  it("happy: with 4 Draconic links, base 3{p} is less than 4 and this is 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [roninRenegadeBlue, roninRenegadeBlue, roninRenegadeBlue, spreadingFlamesRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(roninRenegadeBlue);
    game.advanceCombatTo("resolution");
    Fai.playAttack(roninRenegadeBlue);
    game.advanceCombatTo("resolution");
    Fai.playAttack(roninRenegadeBlue);
    game.advanceCombatTo("resolution");
    Fai.playAttack(spreadingFlamesRed);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: as the first Draconic link, base 3{p} is not less than 1 and stays 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [spreadingFlamesRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(spreadingFlamesRed);

    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [spreadingFlamesRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(spreadingFlamesRed);
    game.closeCombat();

    expectFabPlayer(Fai).toHaveAP(1);
  });
});
