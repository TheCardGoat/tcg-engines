import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { amethystChromicon } from "@tcg/lorcana-cards/cards/005";
import {
  bePrepared,
  maleficentSorceress,
  marshmallowPersistentGuardian,
  tinkerBellGiantFairy,
} from "@tcg/lorcana-cards/cards/001";
import { belleSnowfieldStrategist } from "@tcg/lorcana-cards/cards/011";
import {
  belleAccomplishedMysticEnchanted,
  kuzcoWantedLlama,
  powerlineWorldsGreatestRockStar,
} from "@tcg/lorcana-cards/cards/009";
import { heiheiPersistentPresence, mufasaBetrayedLeader } from "@tcg/lorcana-cards/cards/002";
import {
  ichabodCraneBookishSchoolmaster,
  ichabodCraneScaredOutOfHisMind,
} from "@tcg/lorcana-cards/cards/010";
import {
  calhounHardnosedLeader,
  mickeyMouseGiantMouse,
  vinnieGreenPigeon,
} from "@tcg/lorcana-cards/cards/008";
import {
  candleheadDedicatedRacer,
  lyleTiberiusRourkeCrystallizedMercenary,
} from "@tcg/lorcana-cards/cards/007";
import { lyleTiberiusRourkeCunningMercenary } from "@tcg/lorcana-cards/cards/003";
import { diabloObedientRaven, theCarpenterDinnerCompanion } from "@tcg/lorcana-cards/cards/006";
import type { LorcanaCardDefinition } from "@tcg/lorcana-types";

function createBePreparedMultipleTriggersEngine() {
  return LorcanaMultiplayerTestEngine.createWithFixture(
    {
      inkwell: bePrepared.cost,
      lore: 10,
      hand: [
        bePrepared, // Song action: Banish all characters
      ],
      play: [
        belleSnowfieldStrategist, // On banish of your character (including self): may put card from discard into inkwell (facedown, exerted) — triggers 10x (7.4.3)
        belleAccomplishedMysticEnchanted, // On play only — no banish trigger
        powerlineWorldsGreatestRockStar, // On sing only — no banish trigger
        marshmallowPersistentGuardian, // On banish IN CHALLENGE ONLY — does NOT trigger from Be Prepared
        heiheiPersistentPresence, // On banish IN CHALLENGE ONLY — does NOT trigger from Be Prepared
        kuzcoWantedLlama, // On banish: may draw a card — triggers 1x
        ichabodCraneBookishSchoolmaster, // On quest only — no banish trigger
        ichabodCraneScaredOutOfHisMind, // On banish: may put this card into inkwell (facedown, exerted) — triggers 1x
        mickeyMouseGiantMouse, // On banish: deal 5 damage to each opposing character — triggers 1x (no targets remain)
        candleheadDedicatedRacer, // On banish: may remove up to 2 damage from chosen character — triggers 1x (no targets remain)
      ],
    },
    {
      play: [
        amethystChromicon, // Item — NOT a character, survives Be Prepared
        mufasaBetrayedLeader, // On banish: reveal top card; if character, play for free (enters exerted) — triggers 1x
        lyleTiberiusRourkeCrystallizedMercenary, // On ink (your turn only) — does NOT trigger from Be Prepared
        lyleTiberiusRourkeCunningMercenary, // On banish of your other character: each opponent loses 1 lore — triggers 6x (7.4.3)
        calhounHardnosedLeader, // On banish: gain 1 lore — triggers 1x
        theCarpenterDinnerCompanion, // On banish: may exert chosen character — triggers 1x (no character targets remain)
        diabloObedientRaven, // On banish: may draw a card — triggers 1x
        vinnieGreenPigeon, // On banish of your other character (opponent's turn only): gain 1 lore — triggers 6x
      ],
      deck: [
        maleficentSorceress, // Mufasa reveals this, then its on-play draw pulls Tinker Bell
        tinkerBellGiantFairy,
      ],
    },
  );
}

/**
 * Multiple Triggers Scenario — Be Prepared Board Wipe
 *
 * Rules under test:
 * - CR 6.7.3: Triggered abilities during effect resolution wait in bag until effect finishes
 * - CR 7.4.3: Cards leaving play simultaneously "see" each other leaving
 * - CR 7.7.4: Active player resolves all their bag triggers first, then passes to opponent
 * - CR 7.7.5: New triggers from currently resolving player are seen by next bag check
 * - CR 1.8: Game state check occurs after each effect resolves
 */
describe("Multiple Triggers Scenario", () => {
  it("should properly sequence triggers when Be Prepared banishes all characters", () => {
    const testEngine = createBePreparedMultipleTriggersEngine();

    // Helper: count bag triggers from a specific card definition
    const countBagTriggersFromCard = (card: LorcanaCardDefinition) =>
      testEngine
        .asPlayerOne()
        .getBagEffects()
        .filter((e) => e.sourceId && testEngine.getCardDefinitionId(e.sourceId) === card.id).length;

    // Helper: resolve all bag triggers from a specific card (for multi-trigger cards)
    const resolveAllTriggersFromCard = (
      player: ReturnType<typeof testEngine.asPlayerOne>,
      card: LorcanaCardDefinition,
      opts: Parameters<typeof player.resolvePendingByCard>[1] = {},
    ) => {
      const maxIterations = player.getBagCount() + 10;
      for (let iteration = 0; iteration < maxIterations; iteration += 1) {
        const effect = player
          .getBagEffects()
          .find((e) => e.sourceId && testEngine.getCardDefinitionId(e.sourceId) === card.id);
        if (!effect) {
          break;
        }

        expect(player.resolveBag(effect.id, opts)).toBeSuccessfulCommand();
      }

      expect(
        player
          .getBagEffects()
          .some((e) => e.sourceId && testEngine.getCardDefinitionId(e.sourceId) === card.id),
      ).toBe(false);
    };

    // ──────────────────────────────────────────
    // Play Be Prepared — banishes ALL characters
    // ──────────────────────────────────────────
    expect(testEngine.asPlayerOne().playCard(bePrepared)).toBeSuccessfulCommand();

    // Amethyst Chromicon (item) must survive — Be Prepared only banishes characters
    expect(testEngine.asPlayerTwo().getCardZone(amethystChromicon)).toBe("play");

    // ──────────────────────────────────────────
    // Verify bag contents after Be Prepared resolves
    // ──────────────────────────────────────────
    const bagEffects = testEngine.asPlayerOne().getBagEffects();

    const p1Triggers = bagEffects.filter((e) => e.controllerId === PLAYER_ONE);
    const p2Triggers = bagEffects.filter((e) => e.controllerId === PLAYER_TWO);

    // P1 triggers:
    // - Belle Snowfield × 10 (sees all 10 P1 characters banished, including herself — CR 7.4.3)
    // - Kuzco × 1
    // - Ichabod Crane Scared × 1
    // - Mickey Mouse × 1
    // - Candlehead × 1
    // Total: 14
    expect(p1Triggers.length).toBe(14);

    // P2 triggers:
    // - Lyle Cunning × 6 (sees 6 other P2 characters banished with him — CR 7.4.3)
    // - Calhoun × 1
    // - Carpenter × 1
    // - Diablo × 1
    // - Vinnie × 6 (sees 6 other P2 characters banished, opponent's-turn condition met)
    // - Mufasa × 1
    // Total: 16
    expect(p2Triggers.length).toBe(16);

    // Marshmallow and Heihei did NOT trigger — in-challenge restriction, Be Prepared is not a challenge
    expect(countBagTriggersFromCard(marshmallowPersistentGuardian)).toBe(0);
    expect(countBagTriggersFromCard(heiheiPersistentPresence)).toBe(0);

    // Lyle Crystallized did NOT trigger — on-ink, wrong event
    expect(countBagTriggersFromCard(lyleTiberiusRourkeCrystallizedMercenary)).toBe(0);

    // Belle fired exactly 10× (one per P1 character including herself — CR 7.4.3)
    expect(countBagTriggersFromCard(belleSnowfieldStrategist)).toBe(10);

    // Lyle Cunning fired exactly 6× (one per other P2 character — CR 7.4.3)
    expect(countBagTriggersFromCard(lyleTiberiusRourkeCunningMercenary)).toBe(6);

    // Vinnie fired exactly 6× (opponent's-turn condition met since P1 is active)
    expect(countBagTriggersFromCard(vinnieGreenPigeon)).toBe(6);

    // ──────────────────────────────────────────
    // Phase 1: Active player (P1) resolves all their triggers first (CR 7.7.4.2)
    // ──────────────────────────────────────────

    // Belle × 10 — optional (may put from discard into inkwell); decline each
    resolveAllTriggersFromCard(testEngine.asPlayerOne(), belleSnowfieldStrategist, {
      resolveOptional: false,
    });

    // Kuzco — optional draw; decline
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(kuzcoWantedLlama, { resolveOptional: false }),
    ).toBeSuccessfulCommand();

    // Ichabod Scared — optional inkwell; decline
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(ichabodCraneScaredOutOfHisMind, { resolveOptional: false }),
    ).toBeSuccessfulCommand();

    // Mickey Mouse — mandatory deal-5-damage to each opposing character;
    // all P2 characters are banished, only Amethyst Chromicon (item) remains — no valid targets, resolves with no effect
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mickeyMouseGiantMouse),
    ).toBeSuccessfulCommand();

    // Candlehead — optional remove-up-to-2-damage from chosen character; no characters remain.
    // BUG-3 fix: the engine auto-resolves (drains) optional bag effects when no valid targets
    // exist at bag-decision time, so the player never sees a prompt for Candlehead's ability.
    // The bag entry was still created (CR 6.2.3) but is drained immediately on the next auto-
    // drain pass following Mickey Mouse's resolution.

    // P1 triggers all resolved; P2 triggers still wait (CR 7.7.4.4)
    expect(
      testEngine
        .asPlayerOne()
        .getBagEffects()
        .filter((e) => e.controllerId === PLAYER_ONE).length,
    ).toBe(0);
    expect(
      testEngine
        .asPlayerOne()
        .getBagEffects()
        .filter((e) => e.controllerId === PLAYER_TWO).length,
    ).toBeGreaterThan(0);

    // ──────────────────────────────────────────
    // Phase 2: Bag passes to P2 (CR 7.7.4.4)
    // ──────────────────────────────────────────

    // Assert that no PR triggers were resolved yet
    expect(bagEffects.filter((e) => e.controllerId === PLAYER_TWO).length).toBe(16);

    const p2StartLore = testEngine.asPlayerTwo().getLore(PLAYER_TWO);
    const p1LoreBeforeP2 = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    // Lyle Cunning × 6 — mandatory: each opponent loses 1 lore
    resolveAllTriggersFromCard(testEngine.asPlayerTwo(), lyleTiberiusRourkeCunningMercenary);

    // Lyle Cunning × 6: each opponent loses 1 lore → P1 lost 6 lore
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(p1LoreBeforeP2 - 6);

    // Calhoun — mandatory: gain 1 lore
    expect(
      testEngine.asPlayerTwo().resolvePendingByCard(calhounHardnosedLeader),
    ).toBeSuccessfulCommand();

    // Vinnie × 6 — mandatory: gain 1 lore each
    resolveAllTriggersFromCard(testEngine.asPlayerTwo(), vinnieGreenPigeon);

    // Calhoun × 1 gain + Vinnie × 6 gain = P2 gained 7 lore total
    expect(testEngine.asPlayerTwo().getLore(PLAYER_TWO)).toBe(p2StartLore + 7);

    // Carpenter — optional exert chosen character; no characters remain, decline
    expect(
      testEngine
        .asPlayerTwo()
        .resolvePendingByCard(theCarpenterDinnerCompanion, { resolveOptional: false }),
    ).toBeSuccessfulCommand();

    // Diablo — optional draw; decline
    expect(
      testEngine
        .asPlayerTwo()
        .resolvePendingByCard(diabloObedientRaven, { resolveOptional: false }),
    ).toBeSuccessfulCommand();

    // Mufasa — two-step scry: step 1 starts the scry, step 2 chooses destination
    // Step 1: resolve the bag trigger (reveals top card = Tinker Bell)
    expect(
      testEngine.asPlayerTwo().resolvePendingByCard(mufasaBetrayedLeader),
    ).toBeSuccessfulCommand();

    // Step 2: choose to play Tinker Bell for free (enters exerted) — pending scry still keyed to Mufasa's sourceCardId
    expect(
      testEngine.asPlayerTwo().resolvePendingByCard(mufasaBetrayedLeader, {
        destinations: [{ zone: "play", cards: [tinkerBellGiantFairy] }],
      }),
    ).toBeSuccessfulCommand();

    // Tinker Bell's on-play trigger (ROCK THE BOAT: deal 1 damage to each opposing character)
    // is mandatory with no player choices — the engine auto-resolves it immediately.
    // All P1 characters are already banished, so it deals 0 damage (for-each over empty set).

    // ──────────────────────────────────────────
    // Final assertions
    // ──────────────────────────────────────────

    // Bag should be completely empty
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    // Tinker Bell is in play (entered via Mufasa's trigger, enters exerted)
    expect(testEngine.asPlayerTwo().getCardZone(tinkerBellGiantFairy)).toBe("play");
    expect(testEngine.isExerted(tinkerBellGiantFairy)).toBe(true);

    // Amethyst Chromicon survived (item, not banished by Be Prepared)
    expect(testEngine.asPlayerTwo().getCardZone(amethystChromicon)).toBe("play");
  });

  it("lets automation resolve the Be Prepared trigger window without conceding", () => {
    const testEngine = createBePreparedMultipleTriggersEngine();
    expect(testEngine.asPlayerOne().playCard(bePrepared)).toBeSuccessfulCommand();
    const mufasaBagId = testEngine
      .asPlayerOne()
      .getBagEffects()
      .find(
        (effect) =>
          effect.sourceId &&
          testEngine.getCardDefinitionId(effect.sourceId) === mufasaBetrayedLeader.id,
      )?.id;

    let sawTriggerWindow = false;
    let mufasaResolutionCandidate:
      | {
          family: "resolveBag";
          bagId: string;
          destinations?: Array<{ zone: string; cards: string[] }>;
        }
      | undefined;
    let stepsTaken = 0;
    const maxSteps = 40;

    for (; stepsTaken < maxSteps && !testEngine.asServer().isGameOver(); stepsTaken += 1) {
      const result = testEngine.asServer().takeAutomatedActionForCurrentActor();
      const state = testEngine.asServer().getState();
      const bagCount = state.G.triggeredAbilities?.bag.items.length ?? 0;
      const pendingEffectCount = state.G.pendingEffects.length;
      const inTriggerWindow = bagCount > 0 || pendingEffectCount > 0;

      if (inTriggerWindow) {
        sawTriggerWindow = true;
        expect(result.fallbackTaken).not.toBe("concede");
      }

      if (
        result.selectedCandidate?.family === "resolveBag" &&
        result.selectedCandidate.bagId === mufasaBagId
      ) {
        mufasaResolutionCandidate = result.selectedCandidate;
      }

      if (sawTriggerWindow && bagCount === 0 && pendingEffectCount === 0) {
        break;
      }
    }

    expect(mufasaBagId).toBeDefined();
    expect(sawTriggerWindow).toBe(true);
    expect(mufasaResolutionCandidate?.family).toBe("resolveBag");
    expect(mufasaResolutionCandidate?.bagId).toBe(mufasaBagId);
    expect(
      mufasaResolutionCandidate?.destinations?.some((destination) => destination.zone === "play"),
    ).toBe(true);
    expect(stepsTaken).toBeLessThan(maxSteps);
    expect(testEngine.asServer().isGameOver()).toBe(false);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asServer().getState().G.pendingEffects).toHaveLength(0);
    expect(testEngine.asPlayerTwo().getCardZone(amethystChromicon)).toBe("play");
  });
});
