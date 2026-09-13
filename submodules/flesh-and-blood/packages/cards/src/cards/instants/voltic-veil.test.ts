import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { bravo } from "../heroes/bravo.ts";
import { flashBoltRed } from "./flash-bolt.ts";
import { snatchRed } from "../actions/snatch.ts";
import { volticVeilRed } from "./voltic-veil.ts";

/**
 * Voltic Veil (PEN204) — Instant.
 *
 * Printed: Prevent the next 4 damage that would be dealt to you this turn. Lightning Bond - If a Lightning card was pitched to play this, deal 1 arcane damage to all opposing heroes.
 */

describe("Voltic Veil (PEN204) AAA", () => {
  it("happy+pin: shields the next 4 damage with its rider resolved", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: kano,
        hand: [flashBoltRed, volticVeilRed],
        resourcePoints: 0,
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
    Seat.must.pitch(flashBoltRed).play(volticVeilRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Seat).toHaveLife(20); // 20 - (4 - 4)
    expectFabPlayer(Bravo).toHaveLife(19); // Lightning Bond
    expectFabCard(Seat, volticVeilRed).toBeIn("graveyard");
  });
});
