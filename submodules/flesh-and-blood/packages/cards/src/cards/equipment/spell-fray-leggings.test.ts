import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prismAwakenerOfSol } from "../heroes/prism-awakener-of-sol.ts";
import { spellFrayLeggings } from "./spell-fray-leggings.ts";

/**
 * Equipment behavior acceptance test — Spell Fray Leggings (PSM007).
 *
 * AAA trio:
 * - Happy: equips in legs slot with Spellvoid 1 keyword
 * - Boundary: no activated abilities to trigger
 * - Timing: persists across turns as equipped legs gear
 *
 * Hero: Prism, Awakener of Sol (DTD001) — Illusionist/Young
 * FLUENT API ONLY.
 */

describe("Spell Fray Leggings (PSM007) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: equips in legs slot with Spellvoid 1", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        legs: [spellFrayLeggings],
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Prism = game.as(prismAwakenerOfSol);

    expect(Prism.zone("legs")).toHaveLength(1);
    expectFabCard(Prism, spellFrayLeggings).toHaveKeyword("spellvoid");
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: no activated abilities to trigger", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        legs: [spellFrayLeggings],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Prism = game.as(prismAwakenerOfSol);

    Prism.expectActivationRejected(spellFrayLeggings);
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: persists in legs slot across turns", () => {
    const game = FabTestEngine.start(
      {
        hero: prismAwakenerOfSol,
        legs: [spellFrayLeggings],
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Prism = game.as(prismAwakenerOfSol);

    expect(Prism.zone("legs")).toHaveLength(1);

    Prism.endTurn();
    game.as(dash).endTurn();

    expect(Prism.zone("legs")).toHaveLength(1);
  });
});
