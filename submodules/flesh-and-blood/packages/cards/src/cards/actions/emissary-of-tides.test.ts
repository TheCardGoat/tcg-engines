import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { nimblismBlue } from "./nimblism.ts";
import { emissaryOfTidesRed } from "./emissary-of-tides.ts";

describe("Emissary of Tides (MST198) AAA", () => {
  it("happy: putting a hand card to the bottom grants +2{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [emissaryOfTidesRed, nimblismBlue], actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(emissaryOfTidesRed, { stopAt: "on-attack" });
    Dash.accept();
    Dash.target(nimblismBlue);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: declining the put leaves printed 4{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [emissaryOfTidesRed, nimblismBlue], actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(emissaryOfTidesRed, { stopAt: "on-attack" });
    Dash.decline();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the +2{p} is only on this attack", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [emissaryOfTidesRed, nimblismBlue], actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(emissaryOfTidesRed, { stopAt: "on-attack" });
    Dash.accept();
    Dash.target(nimblismBlue);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();
    expectFabCard(Dash, emissaryOfTidesRed).toBeIn("graveyard");
  });
});
