import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { lyathGoldmane } from "../heroes/lyath-goldmane.ts";
import { snatchRed } from "./snatch.ts";
import { cheapShotYellow } from "./cheap-shot.ts";

/**
 * Cheap Shot Yellow (SUP094) — Reviled Action.
 *
 * Printed: If you've been booed this turn, you may play this as though it
 * were an instant.
 * Deal 2 damage to target hero unless they discard a card.
 */

describe("Cheap Shot (SUP094) AAA", () => {
  it("happy: the discard branch resolves — the target discards and takes no damage", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [cheapShotYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(cheapShotYellow, { target: Dash.id });
    game.passBoth();
    Dash.accept(); // the target discards instead of taking damage
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Dash, snatchRed).toBeIn("graveyard"); // discarded
    expectFabPlayer(Dash).toHaveLife(20); // no damage on the discard branch
    expectFabCard(Kano, cheapShotYellow).toBeIn("graveyard");
  });

  it("boundary: without being booed, it cannot be played with no action point", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [cheapShotYellow],
        resourcePoints: 1,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    expectFabUnplayable(
      () => Kano.must.playInstant(cheapShotYellow),
      /action-point cost cannot be paid/i,
    );
    expectFabCard(Kano, cheapShotYellow).toBeIn("hand");
  });

  it("timing: after being booed, it plays with no action point and deals damage when discard is declined", () => {
    const game = FabTestEngine.start(
      {
        hero: lyathGoldmane,
        hand: [cheapShotYellow],
        resourcePoints: 3,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lyath = game.as(lyathGoldmane);
    const Dash = game.as(dash);

    Lyath.activate(lyathGoldmane); // the crowd boos Lyath; 1 resource remains
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expectFabPlayer(Lyath).toHaveCrowdBooedThisTurn();

    Lyath.must.playInstant(cheapShotYellow, { target: Dash.id });
    game.passBoth();
    Dash.decline();
    Lyath.targetRequired(Dash);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Lyath).toHaveAP(0);
    expectFabPlayer(Dash).toHaveLife(18);
    expectFabCard(Dash, snatchRed).toBeIn("hand");
    expectFabCard(Lyath, cheapShotYellow).toBeIn("graveyard");
  });
});
