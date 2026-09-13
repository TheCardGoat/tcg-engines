/**
 * CR 8.5.1c: an object banished "until <condition>" is returned to its
 * previous zone as a delayed discrete effect when the condition is met.
 *
 * Modeled via the `until` field on the banish effect, which stamps
 * `returnAtEndPhase: true` on the banish event (the same mechanism intimidate
 * uses). The card returns to its previous zone at end of turn. (Ceases-to-exist
 * failure is handled by the move-zone reducer's instance lookup.)
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, heartOfFyendal, nimblismBlue } from "../../../fixtures.ts";
import { hitTrainer } from "../../../test-trainers.ts";

describe("effect: banish — CR 8.5.1c banish-until returns at end of turn", () => {
  it("returns the banished hand card to hand at end of turn", () => {
    const attack = hitTrainer({
      slug: "fx-banish-until-eot",
      power: 4,
      effect: {
        type: "banish",
        until: "this-turn",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["hand"],
          count: 1,
        },
      },
    });

    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack, heartOfFyendal], deck: 4 },
      { hero: dash, hand: [nimblismBlue], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    game.as(bravo).attackWith(attack);
    game.helpers.resolveRestOfCombat();

    // Mid-turn: a card is in dash's banished zone (banished-until).
    expect(game.as(dash).zone("banished").length).toBe(1);

    // End the turn → the delayed return fires (CR 8.5.1c).
    game.as(bravo).endTurn();

    expect(game.as(dash).zone("banished").length).toBe(0);
    expect(game.as(dash).zone("hand")).toContain(nimblismBlue.canonicalId);
    expect(game.as(dash).handCount()).toBe(4);
  });

  it("returns a banished graveyard card to its previous zone (graveyard), not hand (CR 8.5.1c)", () => {
    const attack = hitTrainer({
      slug: "fx-banish-until-eot-gy",
      power: 4,
      effect: {
        type: "banish",
        until: "this-turn",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["graveyard"],
          count: 1,
        },
      },
    });

    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack, heartOfFyendal], deck: 4 },
      { hero: dash, graveyard: [nimblismBlue], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    const handBefore = game.as(dash).handCount();

    game.as(bravo).attackWith(attack);
    game.helpers.resolveRestOfCombat();

    // Mid-turn: the graveyard card was banished-until.
    expect(game.as(dash).zone("banished").length).toBe(1);
    expect(game.as(dash).zone("graveyard")).not.toContain(nimblismBlue.canonicalId);

    // End the turn → CR 8.5.1c: returns to its PREVIOUS zone (graveyard), not hand.
    game.as(bravo).endTurn();

    expect(game.as(dash).zone("banished").length).toBe(0);
    expect(game.as(dash).zone("graveyard")).toContain(nimblismBlue.canonicalId);
    // It must NOT have been routed to hand (the pre-fix intimidate path).
    expect(game.as(dash).handCount()).toBe(handBefore);
  });

  it("drops the return ledger when a banished-until card leaves banished via another effect", () => {
    // The return-ledger entry must be cleared whenever its card leaves the
    // banished zone — not only on the synthetic end-phase return. Otherwise the
    // writer's instanceId dedup retains a stale {returnToZone} and a SECOND
    // banish-until of the same instance (from a different zone) is misrouted at
    // end of turn. Reproduction needs three cost-0 attacks (the first two carry
    // go-again to fund the later action points):
    //   1. banish-until nimblismBlue from hand        → ledger {nimb, hand}
    //   2. move nimb out of banished into graveyard   → entry must clear
    //   3. banish-until nimb again, this time from gy → ledger {nimb, graveyard}
    // End of turn must return it to graveyard (the second origin), not hand.
    const banishHand = hitTrainer({
      slug: "fx-banish-until-hand",
      power: 4,
      keywords: [{ name: "go-again" }],
      effect: {
        type: "banish",
        until: "this-turn",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["hand"],
          count: 1,
        },
      },
    });
    const moveFromBanished = hitTrainer({
      slug: "fx-move-from-banished",
      power: 4,
      keywords: [{ name: "go-again" }],
      effect: {
        type: "move-card",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["banished"],
          count: 1,
        },
        to: { zone: "graveyard" },
      },
    });
    const banishGraveyard = hitTrainer({
      slug: "fx-banish-until-gy",
      power: 4,
      effect: {
        type: "banish",
        until: "this-turn",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["graveyard"],
          count: 1,
        },
      },
    });

    const game = FabTestEngine.start(
      { hero: bravo, hand: [banishHand, moveFromBanished, banishGraveyard], deck: 4 },
      { hero: dash, hand: [nimblismBlue], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    // 1. banish-until from hand.
    game.as(bravo).attackWith(banishHand);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).zone("banished").length).toBe(1);

    // 2. move the card out of banished → graveyard. Leaving banished must clear
    //    the ledger entry (the fix under test).
    game.as(bravo).attackWith(moveFromBanished);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).zone("banished").length).toBe(0);
    expect(game.as(dash).zone("graveyard")).toContain(nimblismBlue.canonicalId);

    // 3. banish-until the SAME instance again, now from the graveyard.
    game.as(bravo).attackWith(banishGraveyard);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).zone("banished").length).toBe(1);
    expect(game.as(dash).zone("graveyard")).not.toContain(nimblismBlue.canonicalId);

    // End of turn → CR 8.5.1c: returns to the SECOND origin (graveyard). Without
    // the fix the stale {hand} entry would have survived step 2, suppressed the
    // fresh {graveyard} write in step 3 (instanceId dedup), and routed it to hand.
    game.as(bravo).endTurn();
    expect(game.as(dash).zone("graveyard")).toContain(nimblismBlue.canonicalId);
    expect(game.as(dash).zone("banished").length).toBe(0);
    expect(game.as(dash).zone("hand")).not.toContain(nimblismBlue.canonicalId);
  });
});
