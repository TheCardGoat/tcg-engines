import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { describe, expect, it } from "bun:test";
import { robinHoodSharpshooter } from "@tcg/lorcana-cards/cards/005";
import { daisyDuckSapphireChampion } from "@tcg/lorcana-cards/cards/010";
import {
  aurelianGyrosensor,
  julietaMadrigalExcellentCook,
  powerlineWorldsGreatestRockStar,
} from "@tcg/lorcana-cards/cards/009";
import { dragonFire, hakunaMatata, reflection, suddenChill } from "@tcg/lorcana-cards/cards/001";
import { liloEscapeArtist, loseTheWay } from "@tcg/lorcana-cards/cards/006";
import { madamMimRivalOfMerlin } from "@tcg/lorcana-cards/cards/002";
import { darkwingDuckCoolUnderPressure } from "@tcg/lorcana-cards/cards/011";

describe("Robin Hood - Sharpshooter: MY GREATEST PERFORMANCE - Whenever this character quests, look at the top 4 cards of your deck. You may reveal an action card with cost 6 or less and play it for free. Put the rest in your discard.", () => {
  it("When multiple triggers are in the bag, while an own effect is pending resolution. Action card's effect must be fully resolved first", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: [
          hakunaMatata,
          reflection,
          loseTheWay,
          dragonFire,
          suddenChill,
          julietaMadrigalExcellentCook,
        ],
        play: [
          robinHoodSharpshooter,
          daisyDuckSapphireChampion,
          aurelianGyrosensor,
          liloEscapeArtist,
        ],
      },
      {
        hand: [
          madamMimRivalOfMerlin,
          darkwingDuckCoolUnderPressure,
          powerlineWorldsGreatestRockStar,
        ],
      },
    );

    // Step 1: Robin Hood quests
    expect(testEngine.asPlayerOne().quest(robinHoodSharpshooter)).toBeSuccessfulCommand();

    // 2 triggers in bag: Robin Hood (MY GREATEST PERFORMANCE) + Aurelian Gyrosensor (SEEKING KNOWLEDGE)
    // Daisy Duck does NOT trigger — her LOOK AHEAD requires "other Sapphire characters" and Robin Hood is Ruby
    expect(testEngine.asPlayerOne().getBagCount()).toBe(2);

    // Step 2: Resolve Robin Hood's trigger specifically (choose which bag trigger to resolve first)
    // ENGINE GAP: resolvePendingByCard is NOT IMPLEMENTED (lorcana-engine-base.ts:1685-1693)
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(robinHoodSharpshooter, {
        destinations: [
          { zone: "play", cards: [dragonFire] },
          { zone: "discard", cards: [hakunaMatata, reflection, loseTheWay] },
        ],
      }),
    ).toBeSuccessfulCommand();

    // Verify the projected board exposes the pending effect so the UI auto-opens target selection
    expect(testEngine.asPlayerOne().enumerateMoves()).toContain("resolveEffect");
    expect(testEngine.asPlayerOne().enumerateMoves()).not.toContain("resolveBag");
    expect(testEngine.asPlayerOne().getBoard().pendingChoice?.requestID).toBeDefined();

    // Step 3: Dragon Fire is played from scry — it needs a target (banish chosen character)
    // While Dragon Fire's target selection is pending, other bag triggers must NOT be resolvable
    // Rule 6.7.7: effects of a card played during resolution must fully resolve first
    // ENGINE GAP: resolveBag.available does not check for active pending effects (resolve-bag.ts ~line 678)
    const aurelianBagEffects = testEngine
      .asPlayerOne()
      .getBagEffects()
      .filter((e) => e.sourceId !== testEngine.asPlayerOne().getCard(robinHoodSharpshooter).id);
    expect(aurelianBagEffects).toHaveLength(1);

    // Attempting to resolve Aurelian's trigger should fail while Dragon Fire is pending
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(aurelianBagEffects[0]!.sourceId, { resolveOptional: true }),
    ).not.toBeSuccessfulCommand();

    // Step 4: Resolve Dragon Fire — target Daisy Duck for banish
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [daisyDuckSapphireChampion] }),
    ).toBeSuccessfulCommand();

    // Daisy should be banished (damage >= willpower via banish)
    expect(testEngine.asPlayerOne().getCardZone(daisyDuckSapphireChampion)).toBe("discard");

    // Dragon Fire should be in discard (action cards go to discard after resolution)
    expect(testEngine.asPlayerOne().getCardZone(dragonFire)).toBe("discard");

    // Step 5: Now Aurelian's SEEKING KNOWLEDGE trigger can be resolved
    // The trigger persists in the bag even though other board state changed
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    // Aurelian's trigger: look at top card, put on top or bottom
    // Top of deck after scry discard: suddenChill, julietaMadrigalExcellentCook
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({
        resolveOptional: true,
        destinations: [{ zone: "deck-top", cards: [suddenChill] }],
      }),
    ).toBeSuccessfulCommand();

    // All bag effects should be resolved
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
