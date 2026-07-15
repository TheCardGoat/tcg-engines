import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import type { LorcanaProjectedBagEffect } from "@tcg/lorcana-engine";
import { omnidroidV9 } from "./184-omnidroid-v9";
import { syndromeOutForRevenge } from "./172-syndrome-out-for-revenge";

function hasAbilityName(bagEffect: LorcanaProjectedBagEffect, abilityName: string): boolean {
  const payload = bagEffect.payload;
  if (typeof payload !== "object" || payload === null || !("abilityName" in payload)) {
    return false;
  }
  return payload.abilityName === abilityName;
}

// Shift base must share the same name as Omnidroid V.9
const omnidroidShiftBase = createMockCharacter({
  id: "omnidroid-v9-shift-base",
  name: "Omnidroid",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Robot"],
});

const opponentTarget = createMockCharacter({
  id: "omnidroid-v9-opp-target",
  name: "Hapless Bystander",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("Omnidroid - V.9", () => {
  describe("ENEMY DETECTED — When you play this character, if you used Shift to play it, you may deal 2 damage to chosen character.", () => {
    it("deals 2 damage to chosen character when played via Shift", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [omnidroidShiftBase],
          hand: [omnidroidV9],
          inkwell: 2,
        },
        {
          play: [opponentTarget],
          deck: 1,
        },
      );

      const shiftTarget = testEngine.findCardInstanceId(omnidroidShiftBase, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(omnidroidV9, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(omnidroidV9, {
          resolveOptional: true,
          targets: [opponentTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(opponentTarget)).toBe(2);
    });

    it("fires ENEMY DETECTED when v9 is shift-played via Syndrome's GOT ME MONOLOGUING (P1 — bug bugrepeGnIWtt1Ah-_BPuVw3SPk)", () => {
      // Replay evidence: gameId mg_SXedZOqjWx2hs_2rixbx turn 8. Player quested
      // Syndrome — Out for Revenge, returned v9 to hand via the trigger's
      // step 1, then resolved the optional step 2 with playMethod="either"
      // shifting v9 onto an existing Robot base. After the shift-play
      // resolution, triggeredAbilities.pendingEvents was `[]` and v9's
      // ENEMY DETECTED never fired.
      //
      // Per CR 6.7 + the ability's `condition: { type: "used-shift" }`,
      // ENEMY DETECTED must fire on play when playedViaShift is set,
      // regardless of whether the play came from a `playCard` move or from
      // a `play-card` action-effect's "shift" route.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: syndromeOutForRevenge }, // already in play, will quest to trigger
            omnidroidShiftBase, // Robot base for v9 to shift onto
          ],
          hand: [],
          discard: [omnidroidV9], // v9 is in discard so GOT ME MONOLOGUING returns it
          inkwell: 0,
          deck: 5,
        },
        {
          play: [opponentTarget],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(syndromeOutForRevenge)).toBeSuccessfulCommand();

      const trigger = testEngine
        .asPlayerOne()
        .getBagEffects()
        .find((b) => hasAbilityName(b, "GOT ME MONOLOGUING!"));
      expect(trigger).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolveBag(trigger!.id, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Step 1 — return v9 from discard.
      const v9InDiscard = testEngine.findCardInstanceId(omnidroidV9, "discard", PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [v9InDiscard] }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(omnidroidV9)).toBe("hand");

      // Step 2 — accept optional, target v9 (hand) + shift base (play).
      const baseInPlay = testEngine.findCardInstanceId(omnidroidShiftBase, "play", PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [omnidroidV9, omnidroidShiftBase],
        }),
      ).toBeSuccessfulCommand();

      // v9 must now be in play, on top of the base, via shift.
      expect(testEngine.asPlayerOne().getCardZone(omnidroidV9)).toBe("play");
      const v9Projected = testEngine.asPlayerOne().getCard(omnidroidV9);
      expect(v9Projected.cardsUnder).toContain(baseInPlay);
      expect(v9Projected.playedViaShift).toBe(true);

      // ENEMY DETECTED must be queued as a bag trigger from the shift-play.
      const enemyDetected = testEngine
        .asPlayerOne()
        .getBagEffects()
        .find((b) => hasAbilityName(b, "ENEMY DETECTED"));
      expect(enemyDetected).toBeDefined();

      // Resolve it and deal 2 to opponent's char.
      expect(
        testEngine.asPlayerOne().resolveBag(enemyDetected!.id, {
          resolveOptional: true,
          targets: [opponentTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(opponentTarget)).toBe(2);
    });

    it("does not deal damage when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [omnidroidShiftBase],
          hand: [omnidroidV9],
          inkwell: 2,
        },
        {
          play: [opponentTarget],
          deck: 1,
        },
      );

      const shiftTarget = testEngine.findCardInstanceId(omnidroidShiftBase, "play", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(omnidroidV9, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(omnidroidV9, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(opponentTarget)).toBe(0);
    });
  });
});
