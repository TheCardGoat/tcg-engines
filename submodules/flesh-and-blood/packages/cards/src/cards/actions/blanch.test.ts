import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { blanchRed } from "./blanch.ts";

describe("Blanch family AAA", () => {
  it("happy: a hit removes the defending hero's colors", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [blanchRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    expectFabCard(Dash, nimblismBlue).toHaveColor("Blue");
    Bravo.playAttack(blanchRed);
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(13);
    expectFabCard(Dash, nimblismBlue).toHaveColor(null);
  });
  it("boundary: a full block is a miss and colors remain", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [blanchRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, snatchRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.playAttack(blanchRed);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Dash, snatchRed).toHaveColor("Red");
  });
  it("timing: colors return at end of next turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [blanchRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.playAttack(blanchRed);
    game.closeCombat();
    Bravo.endTurn();
    Dash.endTurn();
    expectFabCard(Dash, nimblismBlue).toHaveColor("Blue");
  });
});
