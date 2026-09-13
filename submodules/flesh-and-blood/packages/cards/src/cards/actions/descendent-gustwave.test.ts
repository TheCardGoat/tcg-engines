import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { benjiThePiercingWind } from "../heroes/benji-the-piercing-wind.ts";
import { dash } from "../heroes/dash.ts";
import { surgingStrikeRed } from "./surging-strike.ts";
import { descendentGustwaveRed } from "./descendent-gustwave.ts";

/**
 * Action behavior acceptance test — Descendent Gustwave, Red (KAT008).
 *
 * AAA trio:
 * - Happy: base play — Ninja Attack with combo keyword, costs 1{r}, p3 d2 go again
 * - Boundary: insufficient resources — cannot play at cost 1{r}
 * - Timing: combo with Surging Strike — costs {r} less (free), +2{p}
 *
 * Hero: Benji, the Piercing Wind (CRU047) — Ninja/Young
 * FLUENT API ONLY.
 */

describe("Descendent Gustwave, Red (KAT008) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: base play — costs 1{r}, deals 3 damage, go again", () => {
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        hand: [descendentGustwaveRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Benji = game.as(benjiThePiercingWind);
    const Dash = game.as(dash);

    Benji.must.playAttack(descendentGustwaveRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17); // 20 − 3
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: no resources — cannot play", () => {
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        hand: [descendentGustwaveRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Benji = game.as(benjiThePiercingWind);

    expect(() => Benji.must.playAttack(descendentGustwaveRed)).toThrow();
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: after Surging Strike, costs 0{r} and has +2{p} (combo chain)", () => {
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        hand: [surgingStrikeRed, descendentGustwaveRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Benji = game.as(benjiThePiercingWind);

    Benji.play(surgingStrikeRed);
    game.advanceCombatTo("resolution");
    Benji.play(descendentGustwaveRed);
    game.passBoth();

    expect(game.combat()?.activeLink?.attackPower).toBe(6);
  });
});
