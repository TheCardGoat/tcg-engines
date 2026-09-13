import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { urgentDeliveryRed } from "./urgent-delivery.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { goldwingTurbineRed } from "./goldwing-turbine.ts";

/**
 * Goldwing Turbine (SEA036) — Mechanologist Action, cost 2, 3{d}.
 *
 * Printed: "Your next Mechanologist attack this turn gets +3{p}.
 * Create a Golden Cog token."
 *
 * Seat Teklovossen (not Dash) so a start-game item placement cannot steal a
 * deck copy. Urgent Delivery is the Mechanologist recipient (base 4).
 */

describe("Goldwing Turbine (SEA036) AAA", () => {
  it("happy: creates a Golden Cog and the next Mechanologist attack gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [goldwingTurbineRed, urgentDeliveryRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(goldwingTurbineRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Teklo).toHaveTokenCount("golden-cog", 1);
    expectFabCard(Teklo, goldwingTurbineRed).toBeIn("graveyard");

    Teklo.must.playAttack(urgentDeliveryRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: a Generic attack gets no +3{p} and does not consume the latch", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [goldwingTurbineRed, brutalAssaultBlue, urgentDeliveryRed],
        resourcePoints: 4,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(goldwingTurbineRed);
    game.helpers.resolveUntilIdle();

    Teklo.must.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);

    game.advanceCombatTo("resolution");
    Teklo.must.playAttack(urgentDeliveryRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
  });

  it("timing: the +3{p} is consumed by the first Mechanologist attack", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [goldwingTurbineRed, urgentDeliveryRed, urgentDeliveryRed],
        resourcePoints: 2,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const deliveries = Teklo.cardsIn("hand", urgentDeliveryRed);

    Teklo.play(goldwingTurbineRed);
    game.helpers.resolveUntilIdle();

    Teklo.must.playAttack(deliveries[0]!);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat({ optionals: "decline" });

    Teklo.must.playAttack(deliveries[1]!);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });
});
