import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { nullruneHood } from "../equipment/nullrune-hood.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { scaldingRainRed } from "./scalding-rain.ts";
import { tomeOfDuplicityBlue } from "./tome-of-duplicity.ts";
import { lessonInLavaYellow } from "./lesson-in-lava.ts";

/**
 * Lesson in Lava Yellow (ARC121) — Kano Specialization Wizard Action.
 * "Deal 3 arcane damage to target opposing hero. If Lesson in Lava deals
 * damage, you may search your deck for a Wizard card with {r} cost equal to or
 * less than the damage dealt by Lesson in Lava, reveal it, then shuffle your
 * deck and put it on top of your deck."
 *
 * Mode B (fab-rules): CR 8.5.3a/b arcane damage is the controller's effect
 * damage (no combat chain); CR 8.5.3f Arcane Barrier prevents arcane damage
 * specifically and prevented damage is not dealt, lowering the {r} ceiling;
 * the search pool is Wizard cards affordable under the dealt-damage ceiling.
 *
 * W2-FIX2 replaced the authored pseudo-keyword filter (which no card carries,
 * so the search always found nothing) with the ARC138 cost-ceiling shape
 * `cost: {op: "lte", value: count}` sourced on this card's own damage.
 *
 * Fragment verdicts:
 * - RESOLVED: the cost-ceiling filter — the search decision now offers exactly
 *   the Wizard cards under the ceiling, and the ceiling tracks the DAMAGE
 *   DEALT (Arcane Barrier lowers it), not the printed 3.
 * - BLOCKED (plan §5 engine gap, ARC046 class): "put it on top of your deck" —
 *   the search primitive rejects same-zone destinations ("search destination
 *   must differ from the searched zone"), so choosing a found card aborts the
 *   resolution. The pin test asserts that rejection.
 */

describe("Lesson in Lava (ARC121) AAA", () => {
  it("happy: the search finds the Wizard card under the ceiling and puts it on top", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [lessonInLavaYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [
          scaldingRainRed,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
        ],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(lessonInLavaYellow);
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(17);
    // Effect damage: no combat chain opens (CR 8.5.3b).
    expect(game.combat()).toBeNull();

    // Accept the search optional: the fixed cost-ceiling filter scopes the
    // candidates to exactly the Wizard card with cost 1 <= 3 damage dealt.
    Kano.chooseBoolean(true);
    const search = Kano.expectDecision("entity-target");
    expect(search.candidates.map((candidate) => candidate.instanceId)).toEqual([
      Kano.cardIn("deck", scaldingRainRed).instanceId,
    ]);

    game.helpers.resolveUntilIdle({
      optionalBoolean: false,
      entityTargetCanonicalId: scaldingRainRed.canonicalId,
    });
    expect(Kano.zone("deck").at(-1)).toBe(scaldingRainRed.canonicalId);
    expectFabCard(Kano, lessonInLavaYellow).toBeIn("graveyard");
  });

  it("boundary: Arcane Barrier lowers the dealt damage to 2, excluding a cost-3 Wizard card from the search", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [lessonInLavaYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [
          tomeOfDuplicityBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
        ],
      },
      { hero: dash, life: 20, resourcePoints: 1, head: [nullruneHood], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(lessonInLavaYellow);
    game.passBoth();
    // Arcane Barrier 1 (CR 8.5.3f) prevents 1 of the 3 — only 2 is dealt, so
    // the ceiling is 2 and the Wizard card with cost 3 no longer qualifies.
    const barrier = Dash.expectDecision("option");
    Dash.chooseOptions(barrier.options[0]!.id);
    expectFabPlayer(Dash).toHaveLife(18);
    expectFabPlayer(Dash).toHaveResourceCount(0);

    Kano.chooseBoolean(true);
    // The cost ceiling tracks the DAMAGE DEALT, not the printed 3: no
    // candidate is offered (the only Wizard card costs 3 > 2).
    const search = Kano.expectDecision("entity-target");
    expect(search.candidates).toHaveLength(0);

    // The mayFail search resolves empty: deck intact, Lesson in Lava resolves.
    Kano.target();
    expect(Kano.zone("deck")).toHaveLength(6);
    expect(Kano.zone("deck")).toContain(tomeOfDuplicityBlue.canonicalId);
    expectFabCard(Kano, lessonInLavaYellow).toBeIn("graveyard");
  });

  it("boundary: declining the search optional leaves the deck untouched", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [lessonInLavaYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [
          scaldingRainRed,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
        ],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(lessonInLavaYellow);
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(17);

    Kano.chooseBoolean(false);

    expect(Kano.zone("deck")).toHaveLength(6);
    expect(Kano.zone("deck")).toContain(scaldingRainRed.canonicalId);
    expectFabCard(Kano, lessonInLavaYellow).toBeIn("graveyard");
    expect(game.combat()).toBeNull();
  });

  it("boundary: stacks with another arcane effect in the same turn, both resolving as effects", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [lessonInLavaYellow, scaldingRainRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: [
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
        ],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(lessonInLavaYellow);
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(17);
    Kano.chooseBoolean(false);

    Kano.play(scaldingRainRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(13);
    expectFabCard(Kano, lessonInLavaYellow).toBeIn("graveyard");
    expectFabCard(Kano, scaldingRainRed).toBeIn("graveyard");
    expect(game.combat()).toBeNull();
  });
});
