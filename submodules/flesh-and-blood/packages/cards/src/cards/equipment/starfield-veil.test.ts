import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { dash } from "../heroes/dash.ts";
import { starfieldVeil } from "./starfield-veil.ts";
import { shatteringStardustRed } from "../actions/shattering-stardust.ts";
import { auricShardsBlue, auricShardsYellow } from "../instants/auric-shards.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Starfield Veil (AZS003) — Lightning Illusionist Equipment - Head.
 *
 * Printed: "Instant - Destroy this: The next aura you play this turn enters
 * the arena with a holo counter. Activate this only if an attack has
 * fragmented this turn. Guardwell"
 *
 * Distinct clause vs. its cycle: the Veil holos the NEXT aura played this
 * turn (Carapace buffs Aphrodias, Touch untaps it).
 */
describe("Starfield Veil (AZS003) AAA", () => {
  it("happy: after a fragment, the next aura played enters the arena with a holo counter", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        head: [starfieldVeil],
        hand: [shatteringStardustRed, auricShardsBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    // A fragment attack defended by a 2{d} card fragments: 5{p} - 2 fragment.
    Zyggy.playAttack(shatteringStardustRed);
    Dash.defendWith(snatchRed);
    expectCombat(game).toHaveAttackPower(3);
    game.helpers.resolveRestOfCombat();

    // The fragment this turn licenses the Instant; destroy the veil.
    Zyggy.activate(starfieldVeil);
    game.passBoth();
    expectFabCard(Zyggy, starfieldVeil).toBeIn("graveyard");

    // The next aura played enters the arena with a holo counter.
    Zyggy.play(auricShardsBlue);
    game.helpers.resolveUntilIdle({ ordering: "listed", entityTargets: "minimum" });
    expectFabCard(Zyggy, auricShardsBlue).toBeIn("arena");
    expectFabCard(Zyggy, auricShardsBlue).toHaveCounters(1, "holo");
  });

  it("boundary: without a fragment this turn the Instant is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        head: [starfieldVeil],
        hand: [shatteringStardustRed, auricShardsBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.expectActivationRejected(starfieldVeil);
    expectFabCard(Zyggy, starfieldVeil).toBeIn("head");
  });

  it("timing: only the FIRST aura played this turn is holod", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        head: [starfieldVeil],
        hand: [shatteringStardustRed, auricShardsBlue, auricShardsYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.playAttack(shatteringStardustRed);
    game.as(dash).defendWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    Zyggy.activate(starfieldVeil);
    game.passBoth();

    Zyggy.play(auricShardsBlue);
    game.helpers.resolveUntilIdle({ ordering: "listed", entityTargets: "minimum" });
    Zyggy.play(auricShardsYellow);
    game.helpers.resolveUntilIdle();

    expectFabCard(Zyggy, auricShardsBlue).toHaveCounters(1, "holo");
    expectFabCard(Zyggy, auricShardsYellow).toBeIn("arena");
    expectFabCard(Zyggy, auricShardsYellow).toHaveCounters(0);
  });
});
