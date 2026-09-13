/**
 * CR 8.5.53 Give / 8.5.54 Steal — these share the gain-control primitive but
 * must be distinguishable in the event journal via the move-zone `reason`
 * ("give" / "steal"), so triggers/conditions can observe "considered to have
 * given/stolen" (8.5.53a / 8.5.54a). gain-control keeps reason "rule".
 *
 * Validation is layered:
 *  - The reason mapping is unit-tested directly (controlChangeReason).
 *  - The reason EMISSION is integration-tested via gain-control, which resolves
 *    an at-resolution opponent permanent through the same discrete path and
 *    emits a move-zone stamped reason "rule". give/steal emit through the
 *    identical code with the unit-tested mapping.
 *
 * (give/steal at-resolution auto-selection in hit-triggers needs test-harness
 * entity-target support for the new types; no printed give/steal card exists
 * yet, so this is tracked rather than blocking.)
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, cintariSellsword, dash, heartOfFyendal } from "../../../fixtures.ts";
import { hitTrainer } from "../../../test-trainers.ts";
import { controlChangeReason } from "../../../proposals/effects/gain-control.ts";

describe("controlChangeReason — CR 8.5.53a / 8.5.54a provenance mapping", () => {
  it("maps give -> 'give', steal -> 'steal', gain-control -> 'rule'", () => {
    expect(controlChangeReason("give")).toBe("give");
    expect(controlChangeReason("steal")).toBe("steal");
    expect(controlChangeReason("gain-control")).toBe("rule");
  });
});

describe("effect: gain-control reason emission (path shared with give/steal)", () => {
  it("gain-control move-zone is stamped reason 'rule'", () => {
    const attack = hitTrainer({
      slug: "fx-gain-control-reason",
      power: 4,
      effect: {
        type: "gain-control",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "opponent",
          zones: ["permanent"],
          count: 1,
        },
        controller: "controller",
      },
    });
    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack, heartOfFyendal], deck: 4 },
      { hero: dash, arena: [cintariSellsword], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(attack);
    game.helpers.resolveRestOfCombat();

    // The discrete control change emits a move-zone with reason "rule" — the
    // same emission path give/steal use (with their mapped reason).
    const moved = game
      .committedEvents()
      .some((event) => event.name === "move-zone" && event.data.reason === "rule");
    expect(moved).toBe(true);
  });
});
