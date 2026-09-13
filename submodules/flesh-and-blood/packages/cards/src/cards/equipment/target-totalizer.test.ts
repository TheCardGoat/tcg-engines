import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { targetTotalizer } from "./target-totalizer.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";
import { lineItUpYellow } from "../actions/line-it-up.ts";
import { headShotYellow } from "../actions/head-shot.ts";

/**
 * Target Totalizer (AAZ004) — Ranger Equipment - Head.
 *
 * Printed: "Action - Destroy this: Whenever an arrow with an aim counter hits
 * this turn, draw a card. Go again"
 */
describe("Target Totalizer (AAZ004) AAA", () => {
  it("happy: the aimed arrow that hits draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        head: [targetTotalizer],
        weapon1: [deathDealer],
        arsenal: [{ card: searingShotRed, state: { faceDown: true } }],
        hand: [lineItUpYellow],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    // Aim the arsenal arrow: face-up + one aim counter (+3{p} on the next arrow).
    Azalea.play(lineItUpYellow);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: searingShotRed.canonicalId,
    });

    // Action - destroy this, go again: the spent action point is refunded.
    Azalea.activate(targetTotalizer);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Azalea).toHaveAP(2);

    // The aimed arrow hits.
    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    game.closeCombat({ ordering: "listed" });

    // 4{p} + 3{p} from Line It Up, then Searing Shot's hit makes Dash lose 1{h}.
    expectFabPlayer(Dash).toHaveLife(12);
    expectFabPlayer(Azalea).toHaveHandCount(1);
    expectFabCard(Azalea, targetTotalizer).toBeIn("graveyard");
  });

  it("boundary: an arrow without an aim counter hitting draws nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        head: [targetTotalizer],
        weapon1: [deathDealer],
        arsenal: [
          { card: headShotYellow, state: { faceUp: true } },
          { card: searingShotRed, state: { faceDown: true } },
        ],
        hand: [lineItUpYellow],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    // Only the face-down red gets the aim counter; Head Shot stays clean.
    Azalea.play(lineItUpYellow);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: searingShotRed.canonicalId,
    });
    Azalea.activate(targetTotalizer);
    game.helpers.resolveUntilIdle();

    // The un-aimed arrow hits — the totalizer's window only counts aimed arrows.
    Azalea.attackWith(headShotYellow, { from: "arsenal" });
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabPlayer(Azalea).toHaveHandCount(0);
  });
});
