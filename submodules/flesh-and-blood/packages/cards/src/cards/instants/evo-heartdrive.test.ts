import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { tekloBaseChest } from "../equipment/teklo-base-chest.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { throttleRed } from "../actions/throttle.ts";
import { grindingGearsBlue } from "../actions/grinding-gears.ts";
import { snagBlue } from "../instants/snag.ts";
import { evoHeartdriveBlue } from "./evo-heartdrive.ts";

/**
 * Evo Heartdrive (MST229) — Mechanologist Instant Equipment - Evo Chest.
 * Printed: "If you have a base chest equipped, transform it into this, then
 * equip this. When this is equipped, the next attack action card you play
 * this turn costs {r} less to play. Arcane Barrier 1"
 */
describe("Evo Heartdrive (MST229) AAA", () => {
  it("happy: the base chest transforms into the Heartdrive and the next attack action costs {r} less", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [tekloBaseChest],
        hand: [evoHeartdriveBlue, brutalAssaultBlue],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.play(evoHeartdriveBlue);
    game.helpers.untilIdle();

    expectFabCard(Dash, evoHeartdriveBlue).toBeIn("chest");
    expect(Dash.zone("chest")).toHaveLength(1);

    // Brutal Assault costs 2; the equip latch discount brings it to 1.
    Dash.playAttack(brutalAssaultBlue);
    game.as(bravo).defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveResourceCount(1);
  });

  it("boundary: the discount is spent — the second attack action pays full price", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        chest: [tekloBaseChest],
        hand: [evoHeartdriveBlue, throttleRed, brutalAssaultBlue, snagBlue],
        resourcePoints: 6,
        deck: 6,
        deckTop: [grindingGearsBlue],
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.play(evoHeartdriveBlue);
    game.helpers.untilIdle();

    // The boosted Throttle takes the latch discount (2 -> 1) and its boost
    // go again refunds the action point.
    Dash.playAttack(throttleRed, { boost: true });
    game.as(bravo).defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });

    // Brutal Assault pays its full 2{r} once the latch is spent: 6 - 1 - 2 = 3.
    Dash.playAttack(brutalAssaultBlue);
    game.as(bravo).defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveResourceCount(3);
  });
});
