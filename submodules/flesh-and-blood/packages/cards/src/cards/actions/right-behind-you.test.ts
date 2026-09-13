import { describe, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { rightBehindYouRed } from "./right-behind-you.ts";

describe("Right Behind You (SUP233) AAA", () => {
  it("happy: unblocked attack deals printed 7", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [rightBehindYouRed], resourcePoints: 3, deck: 6 },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(rightBehindYouRed);
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(bravo)).toHaveLife(13);
    expectFabCard(Dash, rightBehindYouRed).toBeIn("graveyard");
  });

  it("boundary: defending alone does not get +1{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      { hero: bravo, hand: [rightBehindYouRed], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(rightBehindYouRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(18);
  });

  it("timing: defending together with another hand card gets +1{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: bravo,
        hand: [rightBehindYouRed, nimblismBlue],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
      },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(rightBehindYouRed, nimblismBlue);
    game.advanceUntil({ stopAt: "idle", optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveLife(20);
  });
});
