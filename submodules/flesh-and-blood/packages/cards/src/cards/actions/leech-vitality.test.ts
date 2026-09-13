import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { leechVitalityRed } from "./leech-vitality.ts";

/**
 * Leech Vitality (OMN093) — Runeblade Action, cost 1, go again.
 *
 * Printed: The next attack action card you play this turn gets +3{p} and
 * "Whenever this deals damage to a hero, gain 1{h}."
 */

describe("Leech Vitality (OMN093) AAA", () => {
  it("happy: the next attack action gets +3{p} and gaining 1{h} when it damages a hero", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [leechVitalityRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.play(leechVitalityRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Viserai).toHaveAP(1);
    expectFabCard(Viserai, leechVitalityRed).toBeIn("graveyard");

    Viserai.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(13);
    expectFabPlayer(Viserai).toHaveLife(21);
  });

  it("boundary: a second attack action this turn does not get +3{p} or the life gain", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [leechVitalityRed, snatchRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);
    const snatches = Viserai.cardsIn("hand", snatchRed);

    Viserai.play(leechVitalityRed);
    game.helpers.resolveUntilIdle();

    Viserai.attackWith(snatches[0]!);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Viserai).toHaveLife(21);

    Viserai.attackWith(snatches[1]!);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(9);
    expectFabPlayer(Viserai).toHaveLife(21);
  });

  it("timing: Leech Vitality itself does not gain life; the granted trigger fires on the next attack's damage", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [leechVitalityRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(leechVitalityRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Viserai).toHaveLife(20);

    Viserai.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(7);
    expectFabPlayer(Viserai).toHaveLife(20);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(Viserai).toHaveLife(21);
  });
});
