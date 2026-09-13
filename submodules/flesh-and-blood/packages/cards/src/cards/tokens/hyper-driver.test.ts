import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { throttleRed, throttleBlue } from "../actions/throttle.ts";
import { grindingGearsBlue } from "../actions/grinding-gears.ts";
import { hyperDriver } from "./hyper-driver.ts";

/**
 * Hyper Driver (AMX028) — Mechanologist Token - Item. Created with steam
 * counters by Maxx Nitro; seated here with its production counters.
 * Printed: "When this has no steam counters, destroy it. Once per turn, when
 * you boost a card, remove a steam counter from this and gain {r}."
 */
describe("Hyper Driver (AMX028) AAA", () => {
  it("happy: boosting Throttle burns a steam counter and gains {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [{ card: hyperDriver, state: { steamCounters: 2 } }],
        hand: [throttleRed],
        resourcePoints: 2,
        deck: 6,
        deckTop: [grindingGearsBlue],
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(throttleRed, { boost: true });
    game.as(bravo).defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Dash, hyperDriver).toHaveCounters(1, "steam");
    // Throttle cost 2 paid from the seeded 2{r}, then the driver refunds 1{r}.
    expectFabPlayer(Dash).toHaveResourceCount(1);
  });

  it("boundary: a second boost the same turn burns nothing extra (once per turn)", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [{ card: hyperDriver, state: { steamCounters: 2 } }],
        hand: [throttleRed, throttleBlue],
        resourcePoints: 4,
        deck: 6,
        deckTop: [grindingGearsBlue],
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(throttleRed, { boost: true });
    game.as(bravo).defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabCard(Dash, hyperDriver).toHaveCounters(1, "steam");

    Dash.playAttack(throttleBlue, { boost: true });
    game.as(bravo).defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });

    // The driver's trigger is once per turn: no second burn, no second {r}
    // (4{r} seeded, two Throttle attacks at 2{r}, one driver refund).
    expectFabCard(Dash, hyperDriver).toHaveCounters(1, "steam");
    expectFabPlayer(Dash).toHaveResourceCount(1);
  });

  it("timing: burning the last steam counter destroys the Hyper Driver", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [{ card: hyperDriver, state: { steamCounters: 1 } }],
        hand: [throttleRed],
        resourcePoints: 2,
        deck: 6,
        deckTop: [grindingGearsBlue],
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.playAttack(throttleRed, { boost: true });
    game.as(bravo).defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });

    expect(Dash.zone("arena")).not.toContain(hyperDriver.canonicalId);
    expectFabPlayer(Dash).toHaveResourceCount(1);
  });
});
