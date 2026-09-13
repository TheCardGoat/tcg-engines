import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { might } from "../tokens/might.ts";
import { snatchRed } from "../actions/snatch.ts";
import { embraceAdversity } from "./embrace-adversity.ts";

describe("Embrace Adversity (HVY200) AAA", () => {
  it("happy: after the opponent destroyed a Might this turn, you may defend", () => {
    const game = FabTestEngine.start(
      { hero: dash, arms: [embraceAdversity], hand: [], life: 20, deck: 8 },
      { hero: bravo, hand: [snatchRed], arena: [might], actionPoints: 1, deck: 8 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.endTurn();
    game.helpers.resolveUntilIdle();
    Bravo.attackWith(snatchRed);
    Dash.defendWith(embraceAdversity);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Dash, embraceAdversity).toBeIn("graveyard");
  });

  it("boundary: no Might destroyed this turn — cannot defendWith", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, arms: [embraceAdversity], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    const rejected = Bravo.expectBlockRejected(embraceAdversity);
    expect(rejected.accepted).toBe(false);
    expectFabCard(Bravo, embraceAdversity).toBeIn("arms");
  });

  it("timing: Blade Break destroys this after it does defend", () => {
    const game = FabTestEngine.start(
      { hero: dash, arms: [embraceAdversity], hand: [], life: 20, deck: 8 },
      { hero: bravo, hand: [snatchRed], arena: [might], actionPoints: 1, deck: 8 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.endTurn();
    game.helpers.resolveUntilIdle();
    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(embraceAdversity);
    expectFabCard(Dash, embraceAdversity).toBeIn("combatChain");
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, embraceAdversity).toBeIn("graveyard");
    expectFabCard(Dash, embraceAdversity).toHaveKeyword("blade-break");
  });
});
