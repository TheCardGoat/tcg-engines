import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { bravo } from "../heroes/bravo.ts";
import { cranialCrushBlue } from "../actions/cranial-crush.ts";
import { snatchRed } from "../actions/snatch.ts";
import { feignDeathYellow } from "./feign-death.ts";

/**
 * Feign Death (CRU125) — "Play Feign Death only if your hero has been dealt
 * damage this turn. The next time your hero would be dealt damage this turn,
 * prevent it."
 *
 * Mode B (fab-rules): CR 6.4.10b — prevention with an unspecified amount
 * prevents the event's full amount; the "only if" line is a play restriction
 * checked when the card is announced (CR 5.4.6); CR 6.4.10i — the one-off
 * prevention covers the next damage event only.
 */

describe("Feign Death (CRU125) AAA", () => {
  it("happy: after taking damage this turn, fully prevents the next damage event", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, cranialCrushBlue],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, life: 20, hand: [feignDeathYellow], resourcePoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Azalea = game.as(azalea);

    Bravo.attackWith(snatchRed);
    game.toReaction();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Azalea).toHaveLife(16); // 20 - 4, damage dealt this turn

    game.helpers.passPriorityTo(Azalea);
    Azalea.play(feignDeathYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    Bravo.attackWith(cranialCrushBlue);
    game.toReaction();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Azalea).toHaveLife(16); // 8 damage fully prevented
    expectFabCard(Azalea, feignDeathYellow).toBeIn("graveyard");
  });

  it("boundary: cannot be played if the hero has not been dealt damage this turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: azalea, life: 20, hand: [feignDeathYellow], resourcePoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    game.as(bravo).attackWith(snatchRed);
    game.toReaction();
    game.helpers.passPriorityTo(Azalea);

    expect(() => Azalea.play(feignDeathYellow)).toThrow(/play condition is not satisfied/);
  });

  it("boundary: the prevention is consumed by one event — a later attack lands in full", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed, snatchRed, snatchRed], actionPoints: 3, deck: 6 },
      { hero: azalea, life: 20, hand: [feignDeathYellow], resourcePoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Azalea = game.as(azalea);

    Bravo.attackWith(snatchRed);
    game.toReaction();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Azalea).toHaveLife(16); // 20 - 4

    game.helpers.passPriorityTo(Azalea);
    Azalea.play(feignDeathYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    Bravo.attackWith(snatchRed);
    game.toReaction();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Azalea).toHaveLife(16); // fully prevented once

    Bravo.attackWith(snatchRed);
    game.toReaction();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Azalea).toHaveLife(12); // 16 - 4, nothing left to prevent
  });
});
