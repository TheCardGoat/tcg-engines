/**
 * CR 8.5.33b — part-of-event ignore: "If there are two or more identical parts
 * of an event and the ignore effect does not specify all of those parts, only
 * the specified parts are ignored."
 *
 * In this engine, "identical parts" = N sibling events (e.g., draw-3 = 3 draw
 * events). The unlimited applicationScope (CR 8.5.33b default: "does not
 * specify all" → ignore ALL matching siblings) ensures the ignore replacement
 * cancels every matching draw event, not just the first.
 *
 * Trainer is justified — no printed card uses the ignore effect.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, heartOfFyendal } from "../../../fixtures.ts";
import { hitTrainer } from "../../../test-trainers.ts";

const manualOpts = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

describe("CR 8.5.33b — part-of-event ignore (unlimited scope)", () => {
  it("an ignore-draw replacement cancels ALL sibling draws (not just the first)", () => {
    const attack = hitTrainer({
      slug: "fx-ignore-draw-all",
      power: 4,
      effect: {
        type: "sequence",
        steps: [
          {
            type: "replacement",
            replacementKind: "standard",
            replaces: { name: "draw" },
            modification: { type: "ignore" },
            duration: "this-turn",
          },
          { type: "draw", count: 3, player: "controller" },
        ],
      },
    });

    const game = FabTestEngine.start(
      { hero: bravo, hand: [attack, heartOfFyendal], deck: 6, resourcePoints: 0 },
      { hero: dash, deck: 6 },
      manualOpts,
    );

    const deckBefore = game.as(bravo).zone("deck").length;
    game.as(bravo).attackWith(attack);
    game.helpers.resolveRestOfCombat();

    // CR 8.5.33b: the unlimited ignore cancelled ALL 3 draws — deck is
    // unchanged (no cards drawn) and no draw event was committed.
    expect(game.as(bravo).zone("deck").length).toBe(deckBefore);
    expect(game.committedEvents().some((e) => e.name === "draw")).toBe(false);
  });
});
