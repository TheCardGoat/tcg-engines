import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { barnacleYellow } from "./barnacle.ts";
import { iyslander } from "../heroes/iyslander.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { coldSnapRed } from "./cold-snap.ts";

/**
 * Cold Snap Red (UPR147) — Ice Action, cost 1, go again.
 *
 * Printed: Target hero may pay {r}{r}{r}. If they don't, freeze a card in
 * their arsenal or an ally they control until the start of your next turn.
 * If this is played from arsenal, draw a card.
 */

describe("Cold Snap (UPR147) AAA", () => {
  it("happy: an unpaying opponent's arsenal card is frozen", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [coldSnapRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arsenal: [snatchRed], resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(coldSnapRed, { target: Dash.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Dash, snatchRed).toBeFrozen();
  });

  it("boundary: paying {r}{r}{r} leaves the arsenal unfrozen", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [coldSnapRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arsenal: [snatchRed], resourcePoints: 3, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(coldSnapRed, { target: Dash.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabCard(Dash, snatchRed).notToBeFrozen();
  });

  it("timing: freeze expires at the start of the caster's next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [coldSnapRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arsenal: [snatchRed], resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(coldSnapRed, { target: Dash.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabCard(Dash, snatchRed).toBeFrozen();

    Iyslander.endTurn();
    game.untilIdle();
    expectFabCard(Dash, snatchRed).toBeFrozen();

    Dash.endTurn();
    game.untilIdle();
    expectFabCard(Dash, snatchRed).notToBeFrozen();
  });

  it("happy: the caster may target their own hero and freeze their own ally", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [coldSnapRed],
        arena: [barnacleYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    Iyslander.play(coldSnapRed, { target: Iyslander.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Iyslander, barnacleYellow).toBeFrozen();
  });

  it("timing: playing from arsenal draws before the freeze resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [],
        arsenal: [coldSnapRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], arsenal: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.must.playFromArsenal(coldSnapRed, { target: Dash.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Iyslander, nimblismBlue).toBeIn("hand");
    expectFabCard(Dash, snatchRed).toBeFrozen();
  });
});
