import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { sigilOfShelterBlue } from "./sigil-of-shelter.ts";
import { sigilOfShelterYellow } from "./sigil-of-shelter.ts";

/**
 * Sigil of Shelter (TER026) — Instant.
 *
 * Printed: The next time you would be dealt damage this turn, prevent 1 of that damage.
 */

describe("Sigil of Shelter (TER026) AAA", () => {
  it("happy: the shield prevents 1 of the incoming 4-power swing", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: kano,
        hand: [sigilOfShelterBlue],
        resourcePoints: 2,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Seat = game.as(kano);

    Bravo.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Bravo.pass();
    Seat.play(sigilOfShelterBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Seat).toHaveLife(17); // 20 - (4 - 1)
    expectFabCard(Seat, sigilOfShelterBlue).toBeIn("graveyard");
  });
});

/**
 * Sigil of Shelter (TER020) — Instant.
 *
 * Printed: The next time you would be dealt damage this turn, prevent 2 of that damage.
 */

describe("Sigil of Shelter (TER020) AAA", () => {
  it("happy: the shield prevents 2 of the incoming 4-power swing", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: kano,
        hand: [sigilOfShelterYellow],
        resourcePoints: 2,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Seat = game.as(kano);

    Bravo.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Bravo.pass();
    Seat.play(sigilOfShelterYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Seat).toHaveLife(18); // 20 - (4 - 2)
    expectFabCard(Seat, sigilOfShelterYellow).toBeIn("graveyard");
  });
});
