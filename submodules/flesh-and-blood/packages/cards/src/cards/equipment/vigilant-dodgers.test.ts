import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { cogwerxBlunderbuss } from "../weapons/cogwerx-blunderbuss.ts";
import { vigilantDodgers } from "./vigilant-dodgers.ts";

/**
 * Vigilant Dodgers (MPW139) — Generic Equipment - Legs.
 *
 * Printed: Instant - Destroy this: Prevent the next 1 damage that would be
 * dealt to you this turn. Activate this only if a weapon has attacked this
 * turn.
 */

describe("Vigilant Dodgers (MPW139) AAA", () => {
  it("happy: after a weapon attack, destroying this prevents the next 1 damage", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon1: [cogwerxBlunderbuss],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        legs: [vigilantDodgers],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    // A weapon attack this turn satisfies the activation condition.
    Dash.activateAttack(cogwerxBlunderbuss);
    Bravo.defendWith();
    game.toReaction("defender");
    Bravo.activate(vigilantDodgers);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // 2{p} blunderbuss minus the prevented 1 = 1 damage.
    expectFabPlayer(Bravo).toHaveLife(19);
    expectFabCard(Bravo, vigilantDodgers).toBeIn("graveyard");
  });

  it("boundary: with no weapon attack this turn the Instant cannot be activated", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: bravo,
        legs: [vigilantDodgers],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.expectActivationRejected(vigilantDodgers);
    expectFabCard(Bravo, vigilantDodgers).toBeIn("legs");
  });
});
