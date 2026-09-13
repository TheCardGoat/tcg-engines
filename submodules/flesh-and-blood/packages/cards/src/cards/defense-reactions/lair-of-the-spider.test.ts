import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { phoenixFlameRed } from "../actions/phoenix-flame.ts";
import { snatchRed } from "../actions/snatch.ts";
import { lairOfTheSpiderRed } from "./lair-of-the-spider.ts";

/**
 * Lair of the Spider Red (HNT191) — Assassin / Ninja Defense Reaction Trap.
 *
 * Printed: When this defends an attack with go again, mark the attacking hero.
 */

describe("Lair of the Spider (HNT191) AAA", () => {
  it("happy: defending a go-again attack marks the attacking hero", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [phoenixFlameRed], actionPoints: 1, deck: 6 },
      { hero: arakni, hand: [lairOfTheSpiderRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Arakni = game.as(arakni);

    Dash.attackWith(phoenixFlameRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Arakni.play(lairOfTheSpiderRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toBeMarked();
    expectFabCard(Arakni, lairOfTheSpiderRed).toBeIn("graveyard");
  });

  it("boundary: defending an attack without go again does not mark", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: arakni, hand: [lairOfTheSpiderRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Arakni = game.as(arakni);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Arakni.play(lairOfTheSpiderRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).notToBeMarked();
  });

  it("timing: cannot play Lair of the Spider outside the reaction step", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [lairOfTheSpiderRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabUnplayable(
      () => game.as(arakni).play(lairOfTheSpiderRed),
      /not legal in the current reaction step/i,
    );
    expectFabCard(game.as(arakni), lairOfTheSpiderRed).toBeIn("hand");
  });
});
