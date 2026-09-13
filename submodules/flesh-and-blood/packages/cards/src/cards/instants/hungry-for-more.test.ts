import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { hungryForMoreRed } from "./hungry-for-more.ts";

// Printed: "Suspense / When this leaves the arena, gain 3{h}." The red frame
// carries 1 suspense counter, so the aura survives exactly one full turn
// cycle before suspense exhausts it into the leave trigger.
describe("Hungry for More (SUP175) AAA", () => {
  it("happy: suspense exhaustion sends it out of the arena and gains 3 life", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [hungryForMoreRed], resourcePoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(hungryForMoreRed);
    game.helpers.untilIdle();
    expectFabCard(Bravo, hungryForMoreRed).toBeIn("arena");

    // Cycle turns until suspense exhausts it (bounded; red carries few
    // counters but removal cadence is turn-boundary based).
    for (let i = 0; i < 4 && Bravo.zone("arena").includes(hungryForMoreRed.canonicalId); i++) {
      Bravo.endTurn();
      game.helpers.untilIdle();
      Dash.endTurn();
      game.helpers.untilIdle();
    }

    expectFabCard(Bravo, hungryForMoreRed).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(23);
  });

  it("boundary: while it is still in the arena no life is gained", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [hungryForMoreRed], resourcePoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(hungryForMoreRed);
    game.helpers.untilIdle();

    expectFabCard(Bravo, hungryForMoreRed).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("timing: the gain fires exactly once — no second gain after it is gone", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [hungryForMoreRed], resourcePoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(hungryForMoreRed);
    game.helpers.untilIdle();
    for (let i = 0; i < 4 && Bravo.zone("arena").includes(hungryForMoreRed.canonicalId); i++) {
      Bravo.endTurn();
      game.helpers.untilIdle();
      Dash.endTurn();
      game.helpers.untilIdle();
    }
    expectFabPlayer(Bravo).toHaveLife(23);

    // A further full turn cycle with the aura already gone changes nothing.
    Bravo.endTurn();
    game.helpers.untilIdle();
    Dash.endTurn();
    game.helpers.untilIdle();

    expectFabPlayer(Bravo).toHaveLife(23);
    expectFabCard(Bravo, hungryForMoreRed).toBeIn("graveyard");
  });
});
