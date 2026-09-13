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
import { cosmicSuture } from "./cosmic-suture.ts";

describe("Cosmic Suture (OMN127-129) AAA", () => {
  it.each([
    ["red", 20],
    ["yellow", 19],
    ["blue", 18],
  ] as const)("%s: shields its printed amount and resolves Starfall", (color, life) => {
    const card = cosmicSuture.cards[color];
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: kano,
        hand: [flashBoltRed, card],
        resourcePoints: 4,
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
    Seat.play(flashBoltRed, {
      targetInstanceId: game.getState().players[Bravo.id]!.heroCardId!,
    });
    game.passBoth();
    expectFabCard(Seat, flashBoltRed).toBeIn("graveyard");
    Bravo.pass();
    Seat.play(card);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Seat).toHaveLife(life);
    expectFabPlayer(Bravo).toHaveLife(16); // 3 from Flash Bolt + 1 Starfall
    expectFabCard(Seat, card).toBeIn("graveyard");
  });
});
