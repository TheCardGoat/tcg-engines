import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { bravo } from "../heroes/bravo.ts";
import { forkedLightningRed } from "./forked-lightning.ts";

/**
 * Forked Lightning Red (ARC120) — Wizard Action.
 *
 * Printed:
 *   Deal 2 arcane damage to two target heroes. You may target the same
 *   hero twice.
 *
 * Errata (Bulletin #5): the two target assignments form one simultaneous
 * damage package; the same hero may be targeted twice — in 1v1 that means
 * 4 arcane damage to the sole opposing hero.
 *
 * Fragment verdicts:
 * - BLOCKED (plan §5 engine gap): "two target heroes ... same hero twice" —
 *   the on-stack target (count 2) auto-settles for the single available
 *   hero as ONE assignment, no targeting decision is offered, and only 2
 *   damage lands; the module's allow-same-hero-twice rule-modification is
 *   sequenced AFTER the damage step (and reads an unhandled hasStatus
 *   filter). The happy test pins the under-deal.
 * - RESOLVED: cost-3 legality boundary.
 */

describe("Forked Lightning (ARC120) AAA", () => {
  it("happy: only one 2-damage assignment lands in 1v1 (engine gap)", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [forkedLightningRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Bravo = game.as(bravo);

    Kano.play(forkedLightningRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });

    // Misbehavior pin: printed (Bulletin #5) targets the sole hero twice for
    // 4 arcane damage; the engine settles one assignment and deals 2, with
    // no same-hero-twice targeting decision ever offered.
    expectFabPlayer(Bravo).toHaveLife(18);
    expectWait(game).notToHaveDecision();
    expectFabPlayer(Kano).toHaveResourceCount(0);
    expectFabCard(Kano, forkedLightningRed).toBeIn("graveyard");
  });

  it("boundary: the full 3{r} cost is required", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [forkedLightningRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Bravo = game.as(bravo);

    expect(() => Kano.play(forkedLightningRed)).toThrow();
    expectFabPlayer(Kano).toHaveResourceCount(2);
    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabCard(Kano, forkedLightningRed).toBeIn("hand");
  });
});
