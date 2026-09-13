import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { swabbieYellow } from "./swabbie.ts";

/**
 * Swabbie (SEA079) — Pirate Necromancer Ally, 7{p} 3{h}.
 *
 * Printed: Action - {r}{r}, {t}: Attack
 */

describe("Swabbie (SEA079) AAA", () => {
  it("happy: activateAttack opens combat at printed 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [swabbieYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );

    game.as(bravo).activateAttack(swabbieYellow);

    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: insufficient resources cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [swabbieYellow],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).expectActivationRejected(swabbieYellow);
    expectCombat(game).toBeClosed();
  });

  it("timing: the tapped ally cannot attack again this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [swabbieYellow],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(swabbieYellow);
    game.closeCombat({ optionals: "decline" });
    expectFabCard(Bravo, swabbieYellow).toBeTapped();
    Bravo.expectActivationRejected(swabbieYellow);
  });
});
