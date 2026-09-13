import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { snatchRed } from "./snatch.ts";
import { might } from "../tokens/might.ts";
import { vigor } from "../tokens/vigor.ts";
import { cuttingRetortRed } from "./cutting-retort.ts";

describe("Cutting Retort (SUP215) AAA", () => {
  it("happy: paying 2{r} destroys two differently named aura tokens and this gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cuttingRetortRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: azalea, arena: [might, vigor], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Azalea = game.as(azalea);

    Dash.playAttack(cuttingRetortRed, { stopAt: "on-attack" });
    Dash.accept();
    Dash.chooseNumeric(2);
    Dash.target(might, vigor);
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(6);
    expectFabPlayer(Azalea).toHaveTokenCount("might", 0);
    expectFabPlayer(Azalea).toHaveTokenCount("vigor", 0);
  });

  it("happy (no pay): attacks at printed 4{p} when there is no {r} to pay", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [cuttingRetortRed], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    game.as(dash).playAttack(cuttingRetortRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: declining the pay-to-destroy optional leaves printed 4{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [cuttingRetortRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(cuttingRetortRed, { stopAt: "on-attack" });
    Dash.decline();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: printed 4{p} is only on this attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [cuttingRetortRed],
        arsenal: [snatchRed],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(cuttingRetortRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabCard(Dash, cuttingRetortRed).toBeIn("graveyard");
    Dash.playAttack(snatchRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(4);
  });
});
