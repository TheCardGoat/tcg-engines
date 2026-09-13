import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { snatchRed, snatchYellow } from "../actions/snatch.ts";
import { pegLeg } from "./peg-leg.ts";

/**
 * Peg Leg (LGS395) — Pirate Legs d1, Blade Break.
 * Printed: "Action - {r}{r}{r}, destroy this: Your next attack this turn gets
 * go again. Go again."
 */

describe("Peg Leg (LGS395) AAA", () => {
  it("happy: the next attack after activating resolves with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        legs: [pegLeg],
        hand: [snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(pegLeg);
    game.untilIdle();
    // Peg Leg's own go again refunds the action point it cost.
    expectFabPlayer(Gravy).toHaveAP(1);
    expectFabCard(Gravy, pegLeg).toBeIn("graveyard");

    Gravy.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();

    // The granted go again fires when the attack's chain link resolves.
    expectFabPlayer(Gravy).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveLife(16); // 20 - 4
  });

  it("timing: only the next attack gets go again — a second swing spends the point", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        legs: [pegLeg],
        hand: [snatchRed, snatchYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(pegLeg);
    game.untilIdle();

    Gravy.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Gravy).toHaveAP(1); // refunded by the granted go again

    Gravy.playAttack(snatchYellow);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Gravy).toHaveAP(0); // the grant covered only the next attack
    expectFabPlayer(game.as(dash)).toHaveLife(13); // 20 - 4 - 3
  });
});
