import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import {
  rallyTheShadowHordeRed,
  rallyTheShadowHordeYellow,
  rallyTheShadowHordeBlue,
} from "./rally-the-shadow-horde.ts";

/**
 * Rally the Shadow Horde — Shadow Action - Attack, cost 3.
 *
 * Printed: Once per Turn Instant - Banish a card from your hand: This gets
 * +2{d}. Activate this only while this card is defending. Blood Debt
 */

describe.each([
  ["Red", rallyTheShadowHordeRed],
  ["Yellow", rallyTheShadowHordeYellow],
  ["Blue", rallyTheShadowHordeBlue],
] as const)("Rally the Shadow Horde %s AAA", (_color, card) => {
  it("happy: while defending, banishing a card from hand gives this +2 defense", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: chane,
        hand: [card, nimblismBlue],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    game.as(dash).playAttack(snatchRed);
    Chane.defendWith(card);
    game.toReaction("defender");
    Chane.activate(card);
    game.passBoth();
    game.advanceUntil({ stopAt: "reaction", optionals: "throw" });

    expectFabCard(Chane, card).toHaveDefense(4);
    expectFabCard(Chane, nimblismBlue).toBeBanished();
    game.closeCombat({ optionals: "throw" });
    expectFabPlayer(Chane).toHaveLife(20);
    expectFabCard(Chane, card).toBeIn("graveyard").toHaveDefense(2);
    expectCombat(game).toBeClosed();
  });

  it("boundary: cannot activate while this is not defending", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [card, nimblismBlue],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, hand: [], deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue] },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.expectActivationRejected(card);
    expectFabCard(Chane, card).toBeIn("hand");
    expectFabCard(Chane, nimblismBlue).toBeIn("hand");
  });
});
