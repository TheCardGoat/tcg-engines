import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { goreBelchingRed } from "./gore-belching.ts";

describe("Gore Belching (OUT186) AAA", () => {
  it("happy: banishing a revealed attack action subtracts that card's {p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [goreBelchingRed], deckTop: [snatchRed], actionPoints: 1 },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(goreBelchingRed, { stopAt: "on-attack" });
    Dash.accept();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: declining the reveal applies -7{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [goreBelchingRed], deckTop: [nimblismBlue], actionPoints: 1 },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(goreBelchingRed, { stopAt: "on-attack" });
    Dash.decline();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(0);
  });

  it("timing: the -X{p} is only on this attack", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [goreBelchingRed], deckTop: [snatchRed], actionPoints: 1 },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(goreBelchingRed, { stopAt: "on-attack" });
    Dash.accept();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat();
    expectFabCard(Dash, goreBelchingRed).toBeIn("graveyard");
  });
});
