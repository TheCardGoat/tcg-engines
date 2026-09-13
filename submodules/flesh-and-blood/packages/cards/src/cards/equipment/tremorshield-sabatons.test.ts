import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { iyslander } from "../heroes/iyslander.ts";
import { tremorshieldSabatons } from "./tremorshield-sabatons.ts";
import { seismicSurge } from "../tokens/seismic-surge.ts";
import { flashBoltYellow } from "../instants/flash-bolt.ts";

/**
 * Tremorshield Sabatons (HNT247) — Guardian Equipment - Legs, Blade Break.
 *
 * Printed: "Instant - Destroy this: Prevent the next 1 arcane damage that
 * would be dealt to you this turn. If you've controlled a Seismic Surge token
 * this turn, instead prevent the next 2."
 */
describe("Tremorshield Sabatons (HNT247) AAA", () => {
  it("happy: with a Seismic Surge token this turn the shield prevents 2 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [tremorshieldSabatons],
        arena: [seismicSurge],
        life: 20,
        hand: [],
        deck: 6,
      },
      {
        hero: iyslander,
        hand: [flashBoltYellow],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Iyslander = game.as(iyslander);

    // Instant - destroy this: with the token controlled, prevent the next 2.
    Bravo.activate(tremorshieldSabatons);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, tremorshieldSabatons).toBeIn("graveyard");

    game.helpers.passPriorityTo(Iyslander);
    Iyslander.play(flashBoltYellow, { target: Bravo.id });
    game.passBoth();

    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("boundary: without a Seismic Surge token this turn only 1 arcane is prevented", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [tremorshieldSabatons],
        life: 20,
        hand: [],
        deck: 6,
      },
      {
        hero: iyslander,
        hand: [flashBoltYellow],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Iyslander = game.as(iyslander);

    Bravo.activate(tremorshieldSabatons);
    game.helpers.resolveUntilIdle();

    game.helpers.passPriorityTo(Iyslander);
    Iyslander.play(flashBoltYellow, { target: Bravo.id });
    game.passBoth();

    expectFabPlayer(Bravo).toHaveLife(19);
  });
});
