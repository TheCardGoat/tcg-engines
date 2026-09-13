import { describe, expect, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { fai } from "../heroes/fai.ts";
import { dash } from "../heroes/dash.ts";
import { roninRenegadeRed } from "./ronin-renegade.ts";
import { snatchRed } from "./snatch.ts";
import { devotionNeverDiesRed } from "./devotion-never-dies.ts";

/**
 * Devotion Never Dies, Red (HNT072) — Ninja Attack Action, cost 1, 4{p}, 2{d}.
 *
 * Printed: "When this hits, if a Draconic attack was the last attack this
 * combat chain, banish this. If you do, you may play it this turn.
 * Go again"
 *
 * Last-attack uses `filter.typeBox` Draconic+Attack, never `names:["Draconic Attack"]`.
 * Banish stamps `it` for the this-turn play permission.
 */

describe("Devotion Never Dies (HNT072) AAA", () => {
  it("happy: after a Draconic last attack, a hit banishes this and you may play it this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [roninRenegadeRed, devotionNeverDiesRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.must.playAttack(roninRenegadeRed);
    game.advanceCombatTo("resolution");

    Fai.must.playAttack(devotionNeverDiesRed);
    game.untilIdle({ optionals: "accept" });

    expect(Fai.zone("banished")).toContain(devotionNeverDiesRed.canonicalId);
    expect(Fai.zone("graveyard")).not.toContain(devotionNeverDiesRed.canonicalId);
    expectFabPlayer(Dash).toHaveLife(13); // 3 (Ronin) + 4 (Devotion)

    Fai.attackWith(devotionNeverDiesRed, { from: "banished" });
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(9);
  });

  it("boundary: as the first link a hit does not banish — the attack goes to the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [devotionNeverDiesRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.attackWith(devotionNeverDiesRed);
    game.helpers.resolveRestOfCombat();

    expect(Fai.zone("graveyard")).toContain(devotionNeverDiesRed.canonicalId);
    expect(Fai.zone("banished")).not.toContain(devotionNeverDiesRed.canonicalId);
    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Fai).toHaveAP(1);
  });

  it("boundary: a non-Draconic last attack (Snatch) grants no banish on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [snatchRed, devotionNeverDiesRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.must.playAttack(snatchRed);
    game.advanceCombatTo("resolution");

    Fai.must.playAttack(devotionNeverDiesRed);
    game.helpers.resolveRestOfCombat();

    expect(Fai.zone("graveyard")).toContain(devotionNeverDiesRed.canonicalId);
    expect(Fai.zone("banished")).not.toContain(devotionNeverDiesRed.canonicalId);
    expectFabPlayer(Dash).toHaveLife(12); // 4 (Snatch) + 4 (Devotion)
  });
});
