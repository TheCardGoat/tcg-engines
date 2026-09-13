import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectFabUnplayable,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { frostbite } from "./frostbite.ts";

/**
 * Frostbite (AJV029) — Elemental Token - Aura.
 * Printed: "Cards and abilities cost you an additional {r} to play or
 * activate. When you play a card or activate an ability, destroy this.
 * At the beginning of your end phase, destroy this."
 */
describe("Frostbite (AJV029) AAA", () => {
  it("happy: the controller pays {r} more for their card and the Frostbite is destroyed by playing it", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [frostbite],
        hand: [brutalAssaultBlue],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    // Brutal Assault costs 2 — the Frostbite tax lifts it to 3.
    Bravo.playAttack(brutalAssaultBlue);
    game.as(dash).defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Bravo).toHaveResourceCount(0);
    expectFabPlayer(Bravo).toHaveTokenCount("frostbite", 0);
    expect(Bravo.zone("arena")).not.toContain(frostbite.canonicalId);
  });

  it("boundary: without the extra {r} the taxed card is unpayable and the Frostbite persists", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [frostbite],
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    expectFabUnplayable(
      () => Bravo.playAttack(brutalAssaultBlue),
      /couldn't be played|unpayable|cannot be paid/i,
    );
    expectFabCard(Bravo, frostbite).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveResourceCount(2);
  });

  it("timing: surviving the action phase, the Frostbite is still destroyed at the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [frostbite],
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.helpers.untilIdle();

    expectFabPlayer(Bravo).toHaveTokenCount("frostbite", 0);
    expect(Bravo.zone("arena")).not.toContain(frostbite.canonicalId);
  });
});
