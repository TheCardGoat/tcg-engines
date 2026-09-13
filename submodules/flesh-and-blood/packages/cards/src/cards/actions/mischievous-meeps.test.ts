import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { rustedRelicBlue } from "./rusted-relic.ts";
import { nimblismBlue } from "./nimblism.ts";
import { mischievousMeepsRed } from "./mischievous-meeps.ts";

describe("Mischievous Meeps (DTD227) AAA", () => {
  it("happy: hit steals an opposing item with cost 2 or less", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [mischievousMeepsRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], arena: [rustedRelicBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(mischievousMeepsRed);
    expectCombat(game).toHaveAttackPower(2);
    game.closeCombat({ optionals: "accept", entityTargets: "minimum" });

    expectFabPlayer(game.as(bravo)).toHaveLife(18);
    expectFabCard(Dash, rustedRelicBlue).toBeIn("arena");
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: a miss does not steal or draw", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [mischievousMeepsRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [nimblismBlue], arena: [rustedRelicBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(mischievousMeepsRed);
    Bravo.defendWith(nimblismBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabCard(Bravo, rustedRelicBlue).toBeIn("arena");
    expectFabPlayer(Dash).toHaveHandCount(0);
  });

  it("timing: with no legal item, a hit draws a card instead", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [mischievousMeepsRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(mischievousMeepsRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(bravo)).toHaveLife(18);
    expectFabPlayer(Dash).toHaveHandCount(1);
  });
});
