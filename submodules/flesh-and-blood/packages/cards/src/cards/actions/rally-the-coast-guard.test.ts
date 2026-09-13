import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import {
  rallyTheCoastGuardBlue,
  rallyTheCoastGuardRed,
  rallyTheCoastGuardYellow,
} from "./rally-the-coast-guard.ts";

describe("rally-the-coast-guard family AAA", () => {
  it.each([
    [rallyTheCoastGuardRed, 7, 13],
    [rallyTheCoastGuardYellow, 6, 14],
    [rallyTheCoastGuardBlue, 5, 15],
  ])("happy: unblocked attack deals printed %i", (card, power, life) => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [card], resourcePoints: 3, deck: 6 },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(card);
    expectCombat(game).toHaveAttackPower(power);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(bravo)).toHaveLife(life);
    expectFabCard(Dash, card).toBeIn("graveyard");
  });

  it("boundary: insufficient resources cannot play the attack", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [rallyTheCoastGuardRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
    );

    expect(() => game.as(dash).playAttack(rallyTheCoastGuardRed)).toThrow();
    expectFabCard(game.as(dash), rallyTheCoastGuardRed).toBeIn("hand");
  });

  it("timing: defending with it reduces an attack by printed 2", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      { hero: bravo, hand: [rallyTheCoastGuardRed], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(rallyTheCoastGuardRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabCard(Bravo, rallyTheCoastGuardRed).toBeIn("graveyard");
  });

  it("interaction: while defending, discard a card to give it +3 defense", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: bravo,
        hand: [rallyTheCoastGuardRed, snatchRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(rallyTheCoastGuardRed);
    game.helpers.passPriorityTo(Bravo);
    Bravo.activate(rallyTheCoastGuardRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, rallyTheCoastGuardRed).toHaveDefense(5);
    expectFabCard(Bravo, snatchRed).toBeIn("graveyard");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(20);
  });
});
