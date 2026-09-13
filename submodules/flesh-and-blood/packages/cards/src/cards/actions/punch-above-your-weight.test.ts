import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { punchAboveYourWeightRed } from "./punch-above-your-weight.ts";

describe("Punch Above Your Weight (SUP224) AAA", () => {
  it("happy: pay {r}{r}{r} when this attacks to gain +5{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [punchAboveYourWeightRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(punchAboveYourWeightRed, { stopAt: "on-attack" });
    Dash.accept();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: declining the payment leaves printed 2{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [punchAboveYourWeightRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(punchAboveYourWeightRed, { stopAt: "on-attack" });
    Dash.decline();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(2);
  });

  it("timing: the +5{p} is only on this attack", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [punchAboveYourWeightRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(punchAboveYourWeightRed, { stopAt: "on-attack" });
    Dash.accept();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();
    expectFabCard(Dash, punchAboveYourWeightRed).toBeIn("graveyard");
  });
});
