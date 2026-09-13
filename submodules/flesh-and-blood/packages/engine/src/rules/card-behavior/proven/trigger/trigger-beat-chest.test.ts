/**
 * AAA test for trigger:beat-chest.
 * Representative card: Alpha Instinct Blue (ARR022) — Rhinar Specialization.
 * Triggered ability: "When this is discard to beat chest, create a Might token."
 * The beat-chest event is produced by the reversible play-card beat-chest keyword
 * procedure (CR 8.3.33) and carries the discarded card in its affected array.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { dash } from "../../../fixtures.ts";
import { rhinar } from "../../../../../../cards/src/cards/heroes/rhinar.ts";
import { bareDestructionRed } from "../../../../../../cards/src/cards/actions/bare-destruction.ts";
import { alphaInstinctBlue } from "../../../../../../cards/src/cards/actions/alpha-instinct.ts";

describe("trigger: beat-chest", () => {
  it("AAA: Alpha Instinct creates a Might token when discarded to beat chest (CR 8.3.33)", () => {
    // Arrange — Rhinar has Bare Destruction (beat-chest keyword) plus
    // Alpha Instinct (power 6, the beat-chest discard that fires its own trigger).
    const game = FabTestEngine.start(
      { hero: rhinar, hand: [bareDestructionRed, alphaInstinctBlue], deck: 4, resourcePoints: 2 },
      { hero: dash, hand: 2, deck: 4 },
    );
    const Rhinar = game.as(rhinar);
    const alphaId = Rhinar.findCardInZone("hand", alphaInstinctBlue);

    // Act — play Bare Destruction with beat chest, discarding Alpha Instinct.
    Rhinar.play(bareDestructionRed, {
      beatChest: true,
      beatChestInstanceId: alphaId,
      target: game.as(dash).id,
    });
    // The default harness resolves the play and its triggered layer, creating
    // the Might token.

    // Assert — a Might token was created in Rhinar's arena.
    expect(Rhinar.zone("arena").some((id) => /might/i.test(id))).toBe(true);
  });

  it("AAA boundary: no Might token when beat chest is not used", () => {
    const game = FabTestEngine.start(
      { hero: rhinar, hand: [bareDestructionRed, alphaInstinctBlue], deck: 4, resourcePoints: 2 },
      { hero: dash, hand: 2, deck: 4 },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(bareDestructionRed, { target: game.as(dash).id });
    game.passBoth();
    game.passBoth();

    expect(Rhinar.zone("arena").some((id) => /might/i.test(id))).toBe(false);
  });
});
