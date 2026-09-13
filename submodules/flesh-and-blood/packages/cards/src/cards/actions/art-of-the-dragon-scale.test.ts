import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { brandWithCinderclawRed } from "./brand-with-cinderclaw.ts";
import { ironrotHelm } from "../equipment/ironrot-helm.ts";
import { artOfTheDragonScaleRed } from "./art-of-the-dragon-scale.ts";

/**
 * Art of the Dragon: Scale (HNT076) — Ninja Action - Attack, cost 1, 5{p}.
 *
 * Printed: When this attacks, if it is Draconic, it gets "When this hits a
 * hero, put a -1{d} counter on an equipment they control. Then if it has 0{d},
 * destroy it."
 */

describe("Art of the Dragon: Scale (HNT076) AAA", () => {
  it("happy: Draconic hit puts -1{d} on 1{d} helm then destroys it", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [brandWithCinderclawRed, artOfTheDragonScaleRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], head: [ironrotHelm], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.playAttack(brandWithCinderclawRed);
    game.advanceCombatTo("resolution");
    Fai.playAttack(artOfTheDragonScaleRed);
    game.closeCombat({ entityTargets: "minimum", ordering: "listed" });

    // Pin: add-counter then destroy-if-0{d} does not leave the helm.
    expectFabCard(Dash, ironrotHelm).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(12);
  });

  it("boundary: without Draconic a hit leaves the helm", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [artOfTheDragonScaleRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], head: [ironrotHelm], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.playAttack(artOfTheDragonScaleRed);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Dash, ironrotHelm).toBeIn("head");
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("timing: the grant is on-attack; helm is still equipped at Defend", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [brandWithCinderclawRed, artOfTheDragonScaleRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], head: [ironrotHelm], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.playAttack(brandWithCinderclawRed);
    game.advanceCombatTo("resolution");
    Fai.playAttack(artOfTheDragonScaleRed);
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toBeOpen();
    expectFabCard(Dash, ironrotHelm).toBeIn("head");
    game.closeCombat({ entityTargets: "minimum", ordering: "listed" });
    expectFabCard(Dash, ironrotHelm).toBeIn("graveyard");
  });
});
