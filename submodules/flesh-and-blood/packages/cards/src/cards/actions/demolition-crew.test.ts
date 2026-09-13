import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { demolitionCrewRed } from "./demolition-crew.ts";

describe("Demolition Crew family AAA", () => {
  it("happy: revealing a cost-2+ card gives dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [demolitionCrewRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: 20, deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(demolitionCrewRed);
    expectCombat(game).toHaveAttackPower(6).toHaveKeyword("dominate");
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(game.as(bravo)).toHaveLife(14);
    expectFabCard(Dash, demolitionCrewRed).toBeIn("graveyard");
  });
  it("boundary: a hand without a cost-2+ card cannot pay", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [demolitionCrewRed, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
    );
    expect(() => game.as(dash).playAttack(demolitionCrewRed)).toThrow();
    expectFabCard(game.as(dash), demolitionCrewRed).toBeIn("hand");
  });
  it("timing: dominate rejects two defenders", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [demolitionCrewRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [snatchRed, nimblismBlue], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);
    game.as(dash).playAttack(demolitionCrewRed);
    Bravo.expectBlockRejected([snatchRed, nimblismBlue]);
    Bravo.defendWith(snatchRed);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Bravo).toHaveLife(16);
  });
});
