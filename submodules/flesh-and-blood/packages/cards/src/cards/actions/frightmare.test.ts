import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { coalescenceMirageRed } from "./coalescence-mirage.ts";
import { prism } from "../heroes/prism.ts";
import { regurgitatingSlogRed } from "./regurgitating-slog.ts";
import { frightmareRed } from "./frightmare.ts";

/**
 * Frightmare, Red (UPR153) — Illusionist Attack Action, cost 3, 13{p}, Phantasm.
 *
 * Printed: Play only if an Illusionist attack action card you control has been
 * destroyed by phantasm this turn.
 */

describe("Frightmare (UPR153) AAA", () => {
  it("after phantasm destroys an Illusionist AAC you control, Frightmare is playable", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [coalescenceMirageRed, frightmareRed],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [regurgitatingSlogRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(coalescenceMirageRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(regurgitatingSlogRed);
    game.untilIdle();

    expectFabCard(Prism, coalescenceMirageRed).toBeIn("graveyard");
    Prism.playAttack(frightmareRed);
    expectCombat(game).toHaveAttackPower(13);
  });

  it("boundary: cannot play Frightmare without a phantasm destroy this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [frightmareRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabUnplayable(
      () => game.as(prism).playAttack(frightmareRed),
      /play condition is not satisfied/,
    );
    expectFabCard(game.as(prism), frightmareRed).toBeIn("hand");
  });

  it("timing: seating this in hand does not open combat", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [frightmareRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabCard(game.as(prism), frightmareRed).toBeIn("hand");
    expectCombat(game).toBeClosed();
  });
});
