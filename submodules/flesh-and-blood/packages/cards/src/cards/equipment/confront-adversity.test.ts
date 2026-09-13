import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { vigor } from "../tokens/vigor.ts";
import { snatchRed } from "../actions/snatch.ts";
import { confrontAdversity } from "./confront-adversity.ts";

describe("Confront Adversity (HVY199) AAA", () => {
  it("happy: after the opponent destroyed a Vigor this turn, you may defend", () => {
    const game = FabTestEngine.start(
      { hero: dash, chest: [confrontAdversity], hand: [], life: 20, deck: 8 },
      { hero: bravo, hand: [snatchRed], arena: [vigor], actionPoints: 1, deck: 8 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.endTurn();
    game.helpers.resolveUntilIdle();
    Bravo.attackWith(snatchRed);
    Dash.defendWith(confrontAdversity);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(18);
    expectFabCard(Dash, confrontAdversity).toBeIn("graveyard");
  });

  it("boundary: no Vigor destroyed this turn — cannot defendWith", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, chest: [confrontAdversity], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    const rejected = Bravo.expectBlockRejected(confrontAdversity);
    expect(rejected.accepted).toBe(false);
    expectFabCard(Bravo, confrontAdversity).toBeIn("chest");
  });

  it("timing: Blade Break destroys this after it does defend", () => {
    const game = FabTestEngine.start(
      { hero: dash, chest: [confrontAdversity], hand: [], life: 20, deck: 8 },
      { hero: bravo, hand: [snatchRed], arena: [vigor], actionPoints: 1, deck: 8 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.endTurn();
    game.helpers.resolveUntilIdle();
    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(confrontAdversity);
    expectFabCard(Dash, confrontAdversity).toBeIn("combatChain");
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, confrontAdversity).toBeIn("graveyard");
    expectFabCard(Dash, confrontAdversity).toHaveKeyword("blade-break");
  });
});
