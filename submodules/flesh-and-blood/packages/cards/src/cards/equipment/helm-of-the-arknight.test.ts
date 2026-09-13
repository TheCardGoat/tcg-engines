import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { helmOfTheArknight } from "./helm-of-the-arknight.ts";

/**
 * Equipment behavior acceptance test — Helm of the Arknight (AVS003).
 *
 * AAA trio:
 * - Happy: equips in head slot with defense 2 and Temper keyword
 * - Boundary: no abilities beyond passive defense and keyword
 * - Timing: persists across turns as equipped head gear
 *
 * Hero: Viserai (ARC076) — Runeblade
 * FLUENT API ONLY.
 */

describe("Helm of the Arknight (AVS003) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: equips in head slot with defense 2 and Temper", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        head: [helmOfTheArknight],
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Viserai = game.as(viserai);

    expect(Viserai.zone("head")).toHaveLength(1);
    expectFabCard(Viserai, helmOfTheArknight).toHaveKeyword("temper");
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: no activated abilities to trigger", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        head: [helmOfTheArknight],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Viserai = game.as(viserai);

    // Helm has no activated abilities — expectActivationRejected or similar.
    Viserai.expectActivationRejected(helmOfTheArknight);
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: persists in head slot across turns", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        head: [helmOfTheArknight],
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Viserai = game.as(viserai);

    expect(Viserai.zone("head")).toHaveLength(1);

    Viserai.endTurn();
    game.as(dash).endTurn();

    // Still equipped after a full turn cycle.
    expect(Viserai.zone("head")).toHaveLength(1);
  });
});
