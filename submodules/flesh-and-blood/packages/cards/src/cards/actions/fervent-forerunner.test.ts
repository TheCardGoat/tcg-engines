import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";

import { ferventForerunnerRed } from "./fervent-forerunner.ts";

describe("Fervent Forerunner family AAA", () => {
  it("happy: the attack has opt 2 and hits for printed 3", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [ferventForerunnerRed], actionPoints: 1, deck: 6 },
      { hero: bravo, deck: 6 },
    );
    game.as(dash).attackWith(ferventForerunnerRed);
    expectCombat(game).toHaveAttackPower(3).toHaveKeyword("opt");
  });
  it("boundary: an attack from hand does not gain arsenal go again", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [ferventForerunnerRed], actionPoints: 1, deck: 6 },
      { hero: bravo, deck: 6 },
    );
    game.as(dash).attackWith(ferventForerunnerRed);
    expectFabPlayer(game.as(dash)).toHaveAP(0);
  });
  it("timing: an arsenal play gains go again", () => {
    const game = FabTestEngine.start(
      { hero: dash, arsenal: [ferventForerunnerRed], actionPoints: 1, deck: 6 },
      { hero: bravo, deck: 6 },
    );
    game.as(dash).attackWith(ferventForerunnerRed, { from: "arsenal" });
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveAP(1);
  });
});
