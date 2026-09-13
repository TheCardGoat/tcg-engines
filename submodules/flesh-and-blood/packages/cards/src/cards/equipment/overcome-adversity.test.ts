import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { agility } from "../tokens/agility.ts";
import { snatchRed } from "../actions/snatch.ts";
import { overcomeAdversity } from "./overcome-adversity.ts";

describe("Overcome Adversity (HVY201) AAA", () => {
  it("happy: after the opponent destroyed an Agility this turn, you may defend", () => {
    const game = FabTestEngine.start(
      { hero: dash, legs: [overcomeAdversity], hand: [], life: 20, deck: 8 },
      { hero: bravo, hand: [snatchRed], arena: [agility], actionPoints: 1, deck: 8 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.endTurn();
    game.helpers.resolveUntilIdle();
    Bravo.attackWith(snatchRed);
    Dash.defendWith(overcomeAdversity);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(18);
    expectFabCard(Dash, overcomeAdversity).toBeIn("graveyard");
  });

  it("boundary: no Agility destroyed this turn — cannot defendWith", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, legs: [overcomeAdversity], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    const rejected = Bravo.expectBlockRejected(overcomeAdversity);
    expect(rejected.accepted).toBe(false);
    expectFabCard(Bravo, overcomeAdversity).toBeIn("legs");
  });

  it("timing: Blade Break destroys this after it does defend", () => {
    const game = FabTestEngine.start(
      { hero: dash, legs: [overcomeAdversity], hand: [], life: 20, deck: 8 },
      { hero: bravo, hand: [snatchRed], arena: [agility], actionPoints: 1, deck: 8 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.endTurn();
    game.helpers.resolveUntilIdle();
    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(overcomeAdversity);
    expectFabCard(Dash, overcomeAdversity).toBeIn("combatChain");
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, overcomeAdversity).toBeIn("graveyard");
    expectFabCard(Dash, overcomeAdversity).toHaveKeyword("blade-break");
  });
});
