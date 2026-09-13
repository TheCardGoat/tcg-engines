import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { fenderBenderRed } from "./fender-bender.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { tickTockClockRed } from "./tick-tock-clock.ts";

describe("Tick Tock Clock (EVO074) AAA", () => {
  it("happy: a Mechanologist AAC hit destroys this and deals X for items destroyed this way", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [
          { card: tickTockClockRed, state: { steamCounters: 1 } },
          { card: grindingGearsBlue, state: { steamCounters: 1 } },
        ],
        hand: [fenderBenderRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(fenderBenderRed);
    game.closeCombat({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Teklo, tickTockClockRed).toBeIn("graveyard");
  });

  it("boundary: a non-Mechanologist attack hitting does not destroy this", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: tickTockClockRed, state: { steamCounters: 1 } }],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    expectFabCard(Teklo, tickTockClockRed).toBeIn("arena");
  });

  it("timing: start of your turn you may remove steam instead of destroying this", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        arena: [{ card: tickTockClockRed, state: { steamCounters: 1 } }],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.endTurn();
    game.untilIdle();
    expectFabCard(Teklo, tickTockClockRed).toBeIn("arena");
    expectFabPlayer(Teklo).toHaveLife(20);

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });
    expectFabCard(Teklo, tickTockClockRed).toBeIn("arena");
    expectFabPlayer(Teklo).toHaveLife(20);
  });
});
