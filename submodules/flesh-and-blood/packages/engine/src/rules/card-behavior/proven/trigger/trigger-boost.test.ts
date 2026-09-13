/**
 * AAA test for trigger:boost.
 * Representative card: High Octane (ARC006) — Mechanologist Action.
 * Static triggered ability: "Whenever you boost a card this turn, gain 1 action point."
 * The boost event is produced by the reversible play-card boost keyword procedure.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "../../../../index.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { highOctaneRed } from "../../../../../../cards/src/cards/actions/high-octane.ts";
import { hyperDriverRed } from "../../../../../../cards/src/cards/actions/hyper-driver.ts";
import { gasGuzzlerRed } from "../../../../../../cards/src/cards/actions/gas-guzzler.ts";

describe("trigger: boost", () => {
  it("AAA: High Octane grants 1 AP whenever its controller boosts (CR 8.3.9)", () => {
    // Arrange — Dash has High Octane and Hyper Driver in the arena.
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [highOctaneRed, hyperDriverRed],
        hand: [gasGuzzlerRed],
        deck: 4,
        resourcePoints: 3,
      },
      { hero: bravo, deck: 4 },
    );
    const Dash = game.as(dash);

    // Act — Play Gas Guzzler (an attack with boost), banishing top deck card.
    Dash.play(gasGuzzlerRed, { boost: true, target: game.as(bravo).id });

    // Assert — High Octane granted 1 AP (started 1, spent 1 on attack, gained 1).
    expectFabPlayer(Dash).toHaveAP(1);
    expect(Dash.zone("arena")).toContain(hyperDriverRed.canonicalId);
  });

  it("AAA boundary: no AP gain without boost", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [highOctaneRed],
        hand: [gasGuzzlerRed],
        deck: 4,
        resourcePoints: 3,
      },
      { hero: bravo, deck: 4 },
    );
    const Dash = game.as(dash);

    Dash.play(gasGuzzlerRed, { target: game.as(bravo).id });

    expectFabPlayer(Dash).toHaveAP(0);
  });
});
