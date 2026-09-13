import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { katsu } from "../heroes/katsu.ts";
import { dash } from "../heroes/dash.ts";
import { blackoutKickRed } from "../actions/blackout-kick.ts";
import { breezeRiderBoots } from "./breeze-rider-boots.ts";

/**
 * Breeze Rider Boots (1HP097) — Ninja Legs, Battleworn.
 * Printed: "When a Ninja attack action card you control hits, you may
 * destroy this. If you do, attack action cards with combo gain go again
 * this turn."
 */

describe("Breeze Rider Boots (1HP097) AAA", () => {
  it("happy: destroying the boots on a Ninja combo hit gives the attack go again", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        legs: [breezeRiderBoots],
        hand: [blackoutKickRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(blackoutKickRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.toReaction("attacker");
    Katsu.pass();
    game.as(dash).pass();
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabCard(Katsu, breezeRiderBoots).toBeIn("graveyard");
    // The attack spent the action point; go again refunds it.
    expectFabPlayer(Katsu).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: declining keeps the boots and spends the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        legs: [breezeRiderBoots],
        hand: [blackoutKickRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(blackoutKickRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.toReaction("attacker");
    Katsu.pass();
    game.as(dash).pass();
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Katsu, breezeRiderBoots).toBeIn("legs");
    expectFabPlayer(Katsu).toHaveAP(0);
  });
});
