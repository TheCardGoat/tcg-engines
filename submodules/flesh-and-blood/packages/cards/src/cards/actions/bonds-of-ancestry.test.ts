import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { benjiThePiercingWind } from "../heroes/benji-the-piercing-wind.ts";
import { dash } from "../heroes/dash.ts";
import { descendentGustwaveRed } from "./descendent-gustwave.ts";
import { bondsOfAncestryRed } from "./bonds-of-ancestry.ts";

/**
 * Action behavior acceptance test — Bonds of Ancestry, Red (KAT007).
 *
 * AAA trio:
 * - Happy: base play — Ninja Attack with combo keyword, costs 2{r}, p4 d3 go again
 * - Boundary: last attack was Gustwave — costs {r}{r} less (free), gains go again + attack trigger
 * - Timing: combo label requires Gustwave in last attack name
 *
 * Hero: Benji, the Piercing Wind (CRU047) — Ninja/Young
 * FLUENT API ONLY.
 */

describe("Bonds of Ancestry, Red (KAT007) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: base play — costs 2{r}, deals 4 damage, go again", () => {
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        hand: [bondsOfAncestryRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Benji = game.as(benjiThePiercingWind);
    const Dash = game.as(dash);

    Benji.must.playAttack(bondsOfAncestryRed);
    game.helpers.resolveRestOfCombat();

    // p4 dealt to opposing hero.
    expectFabPlayer(Dash).toHaveLife(16); // 20 − 4
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: insufficient resources — cannot play without combo discount", () => {
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        hand: [bondsOfAncestryRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Benji = game.as(benjiThePiercingWind);

    // Costs 2{r} at base — 1{r} is not enough.
    expect(() => Benji.must.playAttack(bondsOfAncestryRed)).toThrow();
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: after Gustwave attack, costs 0{r} and remains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        hand: [descendentGustwaveRed, bondsOfAncestryRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Benji = game.as(benjiThePiercingWind);

    Benji.play(descendentGustwaveRed);
    game.advanceCombatTo("resolution");
    Benji.play(bondsOfAncestryRed);
    game.passBoth();

    expect(game.combat()?.activeLink?.attackPower).toBe(5);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });
});
