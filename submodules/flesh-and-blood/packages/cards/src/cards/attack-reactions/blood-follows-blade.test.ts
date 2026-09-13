import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { bloodFollowsBladeYellow } from "./blood-follows-blade.ts";

/**
 * Blood Follows Blade Yellow (SUP252) — Warrior Attack Reaction.
 *
 * Printed: Kassai Specialization. Target sword attack gets go again and
 * "When this hits, create a Cintari Sellsword token."
 */

describe("Blood Follows Blade (SUP252) family AAA", () => {
  it("happy: sword attack gains go again and creates a Cintari Sellsword on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [dawnblade],
        hand: [bloodFollowsBladeYellow],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.must.activate(dawnblade);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(bloodFollowsBladeYellow);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Kassai).toHaveTokenCount("cintari-sellsword", 1);
    // Dawnblade's chain link resolved with go again.
    expectFabPlayer(Kassai).toHaveAP(1);
    expectFabCard(Kassai, bloodFollowsBladeYellow).toBeIn("graveyard");
  });

  it("boundary: cannot be played outside a sword attack's reaction step", () => {
    const game = FabTestEngine.start(
      { hero: kassai, hand: [bloodFollowsBladeYellow], deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expectFabUnplayable(
      () => game.as(kassai).play(bloodFollowsBladeYellow),
      /not legal in the current reaction step/i,
    );
  });
});
