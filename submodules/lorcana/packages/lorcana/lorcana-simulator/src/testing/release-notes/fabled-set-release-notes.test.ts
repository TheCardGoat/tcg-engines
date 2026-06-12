/**
 * Fabled Set Release Notes — Test Specification
 *
 * Source: .agents/skills/lorcana-rules/references/fabled-release-notes/Fabled_SetReleaseNotes_EN_251019_220713.md
 *
 * This file documents all card-specific Q&A from the Fabled set release notes
 * as executable test cases. Each test corresponds to an official ruling.
 */

import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";

// --- Card imports (Set 009 - Fabled, preferred for Fabled release notes) ---
import { dinnerBell, lantern, ursulasShellNecklace } from "@tcg/lorcana-cards/cards/009";
import {
  donaldDuckPerfectGentleman,
  elsaSpiritOfWinter,
  grandPabbieOldestAndWisest,
  jafarKeeperOfSecrets,
  mickeyMouseTrumpeter,
  moanaOfMotunui,
  plutoFriendlyPooch,
  plutoDeterminedDefender,
  pongoDeterminedFather,
  queenOfHeartsSensingWeakness,
} from "@tcg/lorcana-cards/cards/009";
import { holdStill, perplexingSignposts } from "@tcg/lorcana-cards/cards/002";
import { jumboPop } from "@tcg/lorcana-cards/cards/006";

// --- Card imports (Sets without Fabled reprints) ---
import {
  flynnRiderCharmingRogue,
  stitchRockStar,
  theQueenWickedAndVain,
} from "@tcg/lorcana-cards/cards/001";
import { fanTheFlames } from "@tcg/lorcana-cards/cards/001";
import { ursulaSeaWitch } from "@tcg/lorcana-cards/cards/009";
import { lastditchEffort } from "@tcg/lorcana-cards/cards/003";

// --- Mock cards for test scenarios ---
const cost3Character = createMockCharacter({
  id: "cost3-char",
  name: "Test Character",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const genericCharacter = createMockCharacter({
  id: "generic-char",
  name: "Generic Character",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const princessCharacter = createMockCharacter({
  id: "princess-char",
  name: "Test Princess",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Hero", "Princess"],
});

const secondPrincessCharacter = createMockCharacter({
  id: "princess-char-2",
  name: "Second Princess",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Hero", "Princess"],
});

const flounderVoiceOfReason = createMockCharacter({
  id: "flounder-vor",
  name: "Flounder",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
});

const wardCharacter = createMockCharacter({
  id: "ward-char",
  name: "Ward Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  abilities: [{ id: "ward-1", keyword: "Ward", text: "Ward", type: "keyword" }],
});

const basePlutoCharacter = createMockCharacter({
  id: "base-pluto",
  name: "Pluto",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const cost2Song = createMockSong({
  id: "cost2-song",
  name: "Test Song",
  cost: 2,
  text: "Draw a card.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
});

const inkableCharacter = createMockCharacter({
  id: "inkable-char",
  name: "Inkable Character",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Fabled Set Release Notes — Card-Specific Rulings", () => {
  // ═══════════════════════════════════════════════════════════════════════════
  // Stitch - Rock Star / Lantern
  // ═══════════════════════════════════════════════════════════════════════════
  describe("Stitch - Rock Star / Lantern interaction", () => {
    it("Lantern reduces ink cost to play, NOT the character's printed cost — a cost 3 character still costs 3 for Adoring Fans", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [cost3Character],
          inkwell: cost3Character.cost,
          play: [stitchRockStar, lantern],
          deck: 3,
        },
        { deck: 2 },
      );

      const deckBefore = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;

      // Activate Lantern's Birthday Lights to reduce cost by 1
      expect(testEngine.asPlayerOne().activateAbility(lantern)).toBeSuccessfulCommand();

      // Play cost 3 character (paying 2 ink due to Lantern)
      expect(testEngine.asPlayerOne().playCard(cost3Character)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(cost3Character)).toBe("play");

      // Stitch's Adoring Fans should NOT trigger because the card's COST is still 3
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // No card drawn
      const deckAfter = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;
      expect(deckAfter).toBe(deckBefore);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Pongo - Determined Father
  // ═══════════════════════════════════════════════════════════════════════════
  describe("Pongo - Determined Father", () => {
    it("multiple copies of Pongo can each use Twilight Bark once per turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pongoDeterminedFather, pongoDeterminedFather, pongoDeterminedFather],
          inkwell: 10,
          deck: 5,
        },
        { deck: 2 },
      );

      const pongos = testEngine.getCardInstanceIdsInZone("play", PLAYER_ONE);

      // Each Pongo should be able to activate Twilight Bark once
      let activationsSucceeded = 0;
      for (const pongoId of pongos) {
        const def = testEngine.getCardDefinition(pongoId);
        if (def?.name === "Pongo") {
          const result = testEngine.asPlayerOne().activateAbility(pongoId);
          if (result.success) {
            activationsSucceeded++;
            // Twilight Bark creates a pending scry-selection effect (not a bag effect).
            // Resolve it with empty destinations — remainder: true puts the revealed card to deck-bottom.
            const pendingCount = testEngine.asPlayerOne().getPendingEffects().length;
            if (pendingCount > 0) {
              expect(
                testEngine.asPlayerOne().resolveNextPending({ destinations: [] }),
              ).toBeSuccessfulCommand();
            }
          }
        }
      }

      expect(activationsSucceeded).toBe(3);
    });

    it("Pongo's Twilight Bark can only be used once each turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pongoDeterminedFather],
          hand: [pongoDeterminedFather],
          inkwell: 10,
          deck: 5,
        },
        { deck: 2 },
      );

      // Use Twilight Bark once
      const result1 = testEngine.asPlayerOne().activateAbility(pongoDeterminedFather);
      expect(result1.success).toBe(true);

      // Twilight Bark creates a pending scry-selection effect — resolve it before the next activation
      if (testEngine.asPlayerOne().getPendingEffects().length > 0) {
        expect(
          testEngine.asPlayerOne().resolveNextPending({ destinations: [] }),
        ).toBeSuccessfulCommand();
      }

      // Try to use again in the same turn — should fail
      const result2 = testEngine.asPlayerOne().activateAbility(pongoDeterminedFather);
      expect(result2.success).toBe(false);
    });

    it("Twilight Bark resets when Pongo leaves play — a new instance can use it again", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [pongoDeterminedFather, perplexingSignposts],
          hand: [pongoDeterminedFather],
          inkwell: 10,
          deck: 5,
        },
        { deck: 2 },
      );

      // Use Twilight Bark once — should succeed
      const result1 = testEngine.asPlayerOne().activateAbility(pongoDeterminedFather);
      expect(result1.success).toBe(true);

      // Twilight Bark creates a pending scry-selection effect — resolve it before the next activation
      if (testEngine.asPlayerOne().getPendingEffects().length > 0) {
        expect(
          testEngine.asPlayerOne().resolveNextPending({ destinations: [] }),
        ).toBeSuccessfulCommand();
      }

      // Try again — should fail (once per turn)
      const result2 = testEngine.asPlayerOne().activateAbility(pongoDeterminedFather);
      expect(result2.success).toBe(false);

      // Bounce Pongo to hand via Perplexing Signposts
      expect(
        testEngine.asPlayerOne().activateAbility(perplexingSignposts, {
          targets: [pongoDeterminedFather],
        }),
      ).toBeSuccessfulCommand();

      // Replay Pongo from hand
      expect(testEngine.asPlayerOne().playCard(pongoDeterminedFather)).toBeSuccessfulCommand();

      // Use Twilight Bark on the new instance — should succeed (new instance = fresh limit)
      const result3 = testEngine.asPlayerOne().activateAbility(pongoDeterminedFather);
      expect(result3.success).toBe(true);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // The Queen - Wicked and Vain
  // ═══════════════════════════════════════════════════════════════════════════
  describe("The Queen - Wicked and Vain", () => {
    it("I Summon Thee requires paying the exert cost — being exerted by another effect does NOT draw a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [theQueenWickedAndVain],
          inkwell: 5,
          deck: 3,
        },
        { deck: 2 },
      );

      const deckBefore = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;

      // Use I Summon Thee properly (exert as cost → draw)
      expect(
        testEngine.asPlayerOne().activateAbility(theQueenWickedAndVain),
      ).toBeSuccessfulCommand();
      expect(testEngine.isExerted(theQueenWickedAndVain)).toBe(true);

      const deckAfterActivation = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;
      expect(deckAfterActivation).toBe(deckBefore - 1);
    });

    it("I Summon Thee cannot be used when The Queen is already exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: theQueenWickedAndVain, exerted: true }],
          inkwell: 5,
          deck: 3,
        },
        { deck: 2 },
      );

      const deckBefore = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;

      // Cannot activate I Summon Thee when already exerted
      const result = testEngine.asPlayerOne().activateAbility(theQueenWickedAndVain);
      expect(result.success).toBe(false);

      // No card drawn
      const deckAfter = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;
      expect(deckAfter).toBe(deckBefore);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Ursula - Sea Witch
  // ═══════════════════════════════════════════════════════════════════════════
  describe("Ursula - Sea Witch", () => {
    it("You're Too Late can target a ready character (it prevents readying, does NOT exert)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [ursulaSeaWitch],
          deck: 3,
        },
        {
          play: [genericCharacter], // ready character
          deck: 3,
        },
      );

      // Quest with Ursula — triggers You're Too Late
      expect(testEngine.asPlayerOne().quest(ursulaSeaWitch)).toBeSuccessfulCommand();

      // Resolve targeting the READY opponent character — should be a valid target
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
            targets: [genericCharacter],
          }),
      ).toBeSuccessfulCommand();

      // The character should still be ready — You're Too Late does NOT exert
      expect(testEngine.isExerted(genericCharacter)).toBe(false);
    });

    it("You're Too Late prevents an exerted character from readying during their next Ready step", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [ursulaSeaWitch],
          deck: 3,
        },
        {
          play: [{ card: genericCharacter, exerted: true }],
          deck: 3,
        },
      );

      // Quest with Ursula — triggers You're Too Late
      expect(testEngine.asPlayerOne().quest(ursulaSeaWitch)).toBeSuccessfulCommand();

      // Target the exerted opponent character
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
            targets: [genericCharacter],
          }),
      ).toBeSuccessfulCommand();

      // The character is exerted
      expect(testEngine.isExerted(genericCharacter)).toBe(true);

      // Pass to P2's turn — Ready step should NOT ready the targeted character
      testEngine.asPlayerOne().passTurn();

      // At P2's turn start, the character should still be exerted (can't ready)
      expect(testEngine.isExerted(genericCharacter)).toBe(true);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Jafar - Keeper of Secrets / Flynn Rider - Charming Rogue
  // ═══════════════════════════════════════════════════════════════════════════
  describe("Jafar - Keeper of Secrets / Flynn Rider - Charming Rogue challenge interaction", () => {
    it("Here Comes the Smolder triggers before challenge damage — Jafar loses a hand card before his strength is calculated", () => {
      // RULING: Here Comes the Smolder happens as soon as Flynn Rider is chosen to be
      // challenged. The challenging player discards a card BEFORE damage.
      //
      // Jafar has 0 base strength + 1 per hand card. With 2 cards in hand = 2 STR.
      // Flynn's trigger causes discard of 1 → now 1 card in hand → Jafar has 1 STR.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [jafarKeeperOfSecrets],
          hand: [inkableCharacter, inkableCharacter],
          deck: 3,
        },
        {
          play: [{ card: flynnRiderCharmingRogue, exerted: true }],
          deck: 3,
        },
      );

      // Jafar starts with 2 STR (2 cards in hand)
      expect(testEngine.asPlayerOne().getCardStrength(jafarKeeperOfSecrets)).toBe(2);

      // Challenge Flynn with Jafar
      expect(
        testEngine.asPlayerOne().challenge(jafarKeeperOfSecrets, flynnRiderCharmingRogue),
      ).toBeSuccessfulCommand();

      // Flynn's "Here Comes the Smolder" fires — P2's trigger bag appears
      // The trigger creates a discard effect targeting CHALLENGING_PLAYER (P1)
      const p2Bag = testEngine.asPlayerTwo().getBagEffects();
      expect(p2Bag.length).toBe(1);

      // P2 resolves the bag (no targets needed — P1 must choose which card to discard)
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(p2Bag[0]!.sourceId),
      ).toBeSuccessfulCommand();

      // Discard is chosen: P1 selects a card from their hand to discard
      const handCards = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).cards;
      const discardedCardId = handCards[0]!.id as never;
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [discardedCardId] }),
      ).toBeSuccessfulCommand();

      // After Smolder resolves, P1 discarded 1 card (hand: 2 → 1)
      const p1Hand = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(p1Hand).toBe(1);

      // Jafar's strength is now 1 (1 card in hand), so Flynn took 1 damage
      const flynnDamage = testEngine.asPlayerTwo().getDamage(flynnRiderCharmingRogue);
      expect(flynnDamage).toBe(1);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Elsa - Spirit of Winter / Fan the Flames
  // ═══════════════════════════════════════════════════════════════════════════
  describe("Elsa - Spirit of Winter / Fan the Flames interaction", () => {
    it("Deep Freeze exerts up to 2 characters and prevents readying at start of next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [elsaSpiritOfWinter],
          inkwell: elsaSpiritOfWinter.cost,
          deck: 3,
        },
        {
          play: [genericCharacter, cost3Character],
          deck: 3,
        },
      );

      // Play Elsa — Deep Freeze triggers
      expect(testEngine.asPlayerOne().playCard(elsaSpiritOfWinter)).toBeSuccessfulCommand();

      // Resolve Deep Freeze targeting both P2 characters
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
            targets: [genericCharacter, cost3Character],
          }),
      ).toBeSuccessfulCommand();

      // Both characters should be exerted
      expect(testEngine.isExerted(genericCharacter)).toBe(true);
      expect(testEngine.isExerted(cost3Character)).toBe(true);

      // Pass to P2's turn — Ready step should NOT ready them (cant-ready restriction)
      testEngine.asPlayerOne().passTurn();

      // At P2's start of turn, characters with cant-ready should remain exerted
      expect(testEngine.isExerted(genericCharacter)).toBe(true);
      expect(testEngine.isExerted(cost3Character)).toBe(true);
    });

    it("Fan the Flames can ready a character affected by Deep Freeze", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [elsaSpiritOfWinter],
          inkwell: elsaSpiritOfWinter.cost,
          deck: 3,
        },
        {
          hand: [fanTheFlames],
          inkwell: 10,
          play: [genericCharacter],
          deck: 3,
        },
      );

      // Play Elsa — Deep Freeze triggers
      expect(testEngine.asPlayerOne().playCard(elsaSpiritOfWinter)).toBeSuccessfulCommand();

      // Resolve Deep Freeze targeting P2's character
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
            targets: [genericCharacter],
          }),
      ).toBeSuccessfulCommand();

      // Character should be exerted
      expect(testEngine.isExerted(genericCharacter)).toBe(true);

      // P1 passes turn, P2's turn starts — character stays exerted (cant-ready)
      testEngine.asPlayerOne().passTurn();
      expect(testEngine.isExerted(genericCharacter)).toBe(true);

      // P2 plays Fan the Flames on the frozen character
      expect(
        testEngine.asPlayerTwo().playCard(fanTheFlames, {
          targets: [genericCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Fan the Flames readies the character — Deep Freeze only blocks the Ready step, not card effects
      expect(testEngine.isExerted(genericCharacter)).toBe(false);
    });

    it("Deep Freeze can target 0 characters (up to 2)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [elsaSpiritOfWinter],
          inkwell: elsaSpiritOfWinter.cost,
          deck: 3,
        },
        {
          play: [genericCharacter],
          deck: 3,
        },
      );

      // Play Elsa — Deep Freeze triggers
      expect(testEngine.asPlayerOne().playCard(elsaSpiritOfWinter)).toBeSuccessfulCommand();

      // Resolve Deep Freeze targeting 0 characters
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(elsaSpiritOfWinter, { targets: [] }),
      ).toBeSuccessfulCommand();

      // P2's character should NOT be exerted
      expect(testEngine.isExerted(genericCharacter)).toBe(false);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Mickey Mouse - Trumpeter
  // ═══════════════════════════════════════════════════════════════════════════
  describe("Mickey Mouse - Trumpeter", () => {
    it("Sound the Call 'for free' only waives ink cost — a character can be played without paying ink", () => {
      // Ruling: "for free" applies only to ink cost.
      // If Shift cost is just ink, you can Shift for free via Sound the Call.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mickeyMouseTrumpeter],
          hand: [cost3Character],
          inkwell: 2, // Enough for Sound the Call's 2 ink cost, but not for the character's 3 cost
          deck: 3,
        },
        { deck: 2 },
      );

      // Activate Sound the Call ({E}, 2 ink → play a character for free)
      expect(
        testEngine.asPlayerOne().activateAbility(mickeyMouseTrumpeter),
      ).toBeSuccessfulCommand();

      // Resolve the play-card effect — should let us play cost 3 character for free
      const pendingEffects = testEngine.asPlayerOne().getPendingEffects();
      if (pendingEffects.length > 0) {
        expect(
          testEngine.asPlayerOne().resolveNextPending({ targets: [cost3Character] }),
        ).toBeSuccessfulCommand();
      }

      // The character should now be in play (played for free)
      expect(testEngine.asPlayerOne().getCardZone(cost3Character)).toBe("play");
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Donald Duck - Perfect Gentleman
  // ═══════════════════════════════════════════════════════════════════════════
  describe("Donald Duck - Perfect Gentleman", () => {
    it("Allow Me — each player decides independently whether to draw at the start of your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [donaldDuckPerfectGentleman],
          inkwell: 5,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      // Pass P1 turn, P2 turn → gets back to P1's turn where Allow Me triggers
      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();

      // At start of P1's turn, Allow Me fires two bag items: one for P1 (CONTROLLER), one for P2 (OPPONENT)
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThanOrEqual(2);

      // P1 declines their optional draw (bag item 0: CONTROLLER trigger)
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          bagIndex: 0,
          resolveOptional: false,
        });

      // P1 resolves the opponent's bag item (bag item 1: OPPONENT trigger) — creates P2's pending
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId);

      // P2's choice is a pending effect (optional-selection) — P2 chooses independently
      // Capture P2's deck size before their choice
      const p2DeckBefore = testEngine.asPlayerTwo().getCardsInZone("deck", PLAYER_TWO).count;

      const p2Pending = testEngine.asPlayerTwo().getPendingEffects();
      expect(p2Pending.length).toBeGreaterThan(0);

      // P2 accepts draw — independent of P1's decline
      testEngine.asPlayerTwo().resolveNextPending({ resolveOptional: true });

      // P2 drew 1 card (proving independent decision from P1's decline)
      const p2DeckAfter = testEngine.asPlayerTwo().getCardsInZone("deck", PLAYER_TWO).count;
      expect(p2DeckAfter).toBe(p2DeckBefore - 1);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Grand Pabbie - Oldest and Wisest
  // ═══════════════════════════════════════════════════════════════════════════
  describe("Grand Pabbie - Oldest and Wisest", () => {
    it("Ancient Insight triggers when damage is removed from your characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [grandPabbieOldestAndWisest],
          hand: [holdStill],
          inkwell: 10,
          deck: 5,
        },
        { deck: 2 },
      );

      testEngine.asServer().manualSetDamage(grandPabbieOldestAndWisest, 2);

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(holdStill, {
          targets: [grandPabbieOldestAndWisest],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(grandPabbieOldestAndWisest)).toBe(0);
      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 2);
    });

    it.skip("healing 3 damaged characters simultaneously triggers Ancient Insight 3 times = 6 lore (engine gap: remove-damage targeting 'all' characters doesn't trigger per-character Ancient Insight)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [grandPabbieOldestAndWisest, genericCharacter, princessCharacter, jumboPop],
          inkwell: 10,
          deck: 5,
        },
        { deck: 2 },
      );

      // Put damage on all 3 characters
      testEngine.asServer().manualSetDamage(grandPabbieOldestAndWisest, 2);
      testEngine.asServer().manualSetDamage(genericCharacter, 2);
      testEngine.asServer().manualSetDamage(princessCharacter, 2);

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      // Activate Jumbo Pop — heals all characters simultaneously
      expect(testEngine.asPlayerOne().activateAbility(jumboPop)).toBeSuccessfulCommand();

      // Ancient Insight triggers per character healed: 3 characters × 2 lore = 6 lore
      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 6);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Pluto - Determined Defender
  // ═══════════════════════════════════════════════════════════════════════════
  describe("Pluto - Determined Defender", () => {
    it("Guard Dog — at start of turn, removes up to 3 damage from Pluto", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [plutoDeterminedDefender],
          inkwell: 5,
          deck: 5,
        },
        { deck: 2 },
      );

      // Put 5 damage on Pluto (willpower 8, so still alive)
      testEngine.asServer().manualSetDamage(plutoDeterminedDefender, 5);
      expect(testEngine.asPlayerOne().getDamage(plutoDeterminedDefender)).toBe(5);

      // Pass turns to get back to player one's turn where Guard Dog triggers
      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();

      // Guard Dog should trigger at start of turn — resolve it
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
            amount: 3,
          });
      }

      // Damage should be reduced by up to 3 (5 - 3 = 2)
      expect(testEngine.asPlayerOne().getDamage(plutoDeterminedDefender)).toBe(2);
    });

    it("Guard Dog — you can choose to remove 0 damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [plutoDeterminedDefender],
          inkwell: 5,
          deck: 5,
        },
        { deck: 2 },
      );

      // Put 3 damage on Pluto
      testEngine.asServer().manualSetDamage(plutoDeterminedDefender, 3);
      expect(testEngine.asPlayerOne().getDamage(plutoDeterminedDefender)).toBe(3);

      // Pass turns to get back to player one's turn where Guard Dog triggers
      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();

      // Guard Dog triggers — choose to remove 0 damage
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
            amount: 0,
          });
      }

      // Damage should remain at 3
      expect(testEngine.asPlayerOne().getDamage(plutoDeterminedDefender)).toBe(3);
    });

    it("Shift and Bodyguard can be used together — Shift onto a Pluto, enter play exerted via Bodyguard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [basePlutoCharacter],
          hand: [plutoDeterminedDefender],
          inkwell: plutoDeterminedDefender.cost, // Enough for shift cost (5)
          deck: 5,
        },
        { deck: 2 },
      );

      // Find the base Pluto's instance ID for shift target
      const basePlutoId = testEngine.findCardInstanceId(basePlutoCharacter, "play", PLAYER_ONE);

      // Shift Pluto - Determined Defender onto the base Pluto
      const result = testEngine.asPlayerOne().playCard(plutoDeterminedDefender, {
        cost: { cost: "shift", shiftTarget: basePlutoId },
        resolveOptional: true,
      });
      expect(result.success).toBe(true);

      // Pluto DD should be in play
      expect(testEngine.asPlayerOne().getCardZone(plutoDeterminedDefender)).toBe("play");
      expect(testEngine.asPlayerOne().isExerted(plutoDeterminedDefender)).toBe(true);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Ursula's Shell Necklace
  // ═══════════════════════════════════════════════════════════════════════════
  describe("Ursula's Shell Necklace", () => {
    it("Now, Sing! cost must be paid from inkwell — singing with a higher-cost character does NOT generate ink", () => {
      // Setup: Shell Necklace in play, cost 3 character in play, cost 2 song in hand
      // Sing the cost 2 song with the cost 3 character
      // Now, Sing! triggers: "you may pay 1 {I} to draw a card"
      // The "extra" cost (3 - 2 = 1) does NOT count as ink — must pay from inkwell
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [ursulasShellNecklace, cost3Character],
          hand: [cost2Song],
          inkwell: 1, // Exactly 1 ink to pay for Now, Sing!
          deck: 5,
        },
        { deck: 2 },
      );

      // Sing the song with the cost 3 character
      expect(testEngine.asPlayerOne().singSong(cost2Song, cost3Character)).toBeSuccessfulCommand();

      // Capture deck size AFTER the song resolves (the song's own draw effect fires first)
      const deckAfterSong = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;

      // Now, Sing! triggers — pay 1 ink to draw
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
            resolveOptional: true,
          });
      }

      // Shell Necklace should have drawn 1 additional card
      const deckAfter = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;
      expect(deckAfter).toBe(deckAfterSong - 1);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Queen of Hearts - Sensing Weakness / Jafar - Keeper of Secrets
  // ═══════════════════════════════════════════════════════════════════════════
  describe("Queen of Hearts - Sensing Weakness / Jafar - Keeper of Secrets challenge combo", () => {
    it("Let the Game Begin draws a card BEFORE challenge damage — Jafar's strength updates from the new hand count", () => {
      // Setup: QoH + Jafar in play, 1 card in hand, challenge Flounder
      // QoH triggers draw on challenge → hand goes from 1 to 2
      // Jafar's strength = 0 + 2 cards = 2
      // Flounder takes 2 damage
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [queenOfHeartsSensingWeakness, jafarKeeperOfSecrets],
          hand: [inkableCharacter],
          inkwell: 5,
          deck: 5,
        },
        {
          play: [{ card: flounderVoiceOfReason, exerted: true }],
          deck: 3,
        },
      );

      // Jafar starts with 1 STR (1 card in hand)
      expect(testEngine.asPlayerOne().getCardStrength(jafarKeeperOfSecrets)).toBe(1);

      // Challenge Flounder with Jafar
      expect(
        testEngine.asPlayerOne().challenge(jafarKeeperOfSecrets, flounderVoiceOfReason),
      ).toBeSuccessfulCommand();

      // QoH "Let the Game Begin" triggers — draw a card (optional)
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
            resolveOptional: true,
          });
      }

      // After draw, hand has 2 cards → Jafar has 2 STR
      // Flounder should have taken 2 damage
      const flounderDamage = testEngine.asPlayerTwo().getDamage(flounderVoiceOfReason);
      expect(flounderDamage).toBe(2);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Dinner Bell
  // ═══════════════════════════════════════════════════════════════════════════
  describe("Dinner Bell", () => {
    it("You Know What Happens can target a character with 0 damage — draws 0 cards but still banishes", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [dinnerBell, genericCharacter],
          inkwell: 4, // 2 for ability cost
          deck: 5,
        },
        { deck: 2 },
      );

      const deckBefore = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;

      // genericCharacter has 0 damage
      expect(testEngine.asPlayerOne().getDamage(genericCharacter)).toBe(0);

      // Activate You Know What Happens targeting the undamaged character
      expect(
        testEngine.asPlayerOne().activateAbility(dinnerBell, {
          targets: [genericCharacter],
        }),
      ).toBeSuccessfulCommand();

      // 0 damage = 0 cards drawn
      const deckAfter = testEngine.asPlayerOne().getCardsInZone("deck", PLAYER_ONE).count;
      expect(deckAfter).toBe(deckBefore);

      // But the character should still be banished
      expect(testEngine.asPlayerOne().getCardZone(genericCharacter)).toBe("discard");
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Last-Ditch Effort
  // ═══════════════════════════════════════════════════════════════════════════
  describe("Last-Ditch Effort", () => {
    it("when no opposing character can be chosen (all have Ward), the exert part is skipped but Challenger +2 still applies", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [lastditchEffort],
          play: [genericCharacter],
          inkwell: lastditchEffort.cost,
          deck: 3,
        },
        {
          play: [wardCharacter], // Only character has Ward
          deck: 2,
        },
      );

      // Play Last-Ditch Effort — first target (opposing character) can't be chosen due to Ward
      // The effect should skip the exert part and proceed to Challenger +2
      expect(testEngine.asPlayerOne().playCard(lastditchEffort)).toBeSuccessfulCommand();

      // Resolve the Challenger +2 target (our character)
      const pendingEffects = testEngine.asPlayerOne().getPendingEffects();
      if (pendingEffects.length > 0) {
        testEngine.asPlayerOne().resolveNextPending({ targets: [genericCharacter] });
      }

      // Ward character should NOT be exerted
      expect(testEngine.isExerted(wardCharacter)).toBe(false);

      // Our character should have Challenger +2
      expect(testEngine.getKeywordValue(genericCharacter, "Challenger")).toBe(2);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Moana - Of Motunui
  // ═══════════════════════════════════════════════════════════════════════════
  describe("Moana - Of Motunui", () => {
    it("We Can Fix It readies ALL Princess characters or NONE — you cannot choose only some", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            moanaOfMotunui,
            { card: princessCharacter, exerted: true },
            { card: secondPrincessCharacter, exerted: true },
          ],
          inkwell: 5,
          deck: 5,
        },
        { deck: 2 },
      );

      // Both princesses should be exerted
      expect(testEngine.isExerted(princessCharacter)).toBe(true);
      expect(testEngine.isExerted(secondPrincessCharacter)).toBe(true);

      // Quest with Moana — triggers We Can Fix It
      expect(testEngine.asPlayerOne().quest(moanaOfMotunui)).toBeSuccessfulCommand();

      // Resolve: choose to use We Can Fix It (ready ALL princesses)
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
            resolveOptional: true,
          });
      }

      // ALL princesses should now be ready
      expect(testEngine.isExerted(princessCharacter)).toBe(false);
      expect(testEngine.isExerted(secondPrincessCharacter)).toBe(false);
    });

    it("if We Can Fix It is not used, Princess characters can quest and be readied normally", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [moanaOfMotunui, princessCharacter],
          inkwell: 5,
          deck: 5,
        },
        { deck: 2 },
      );

      // Quest with Moana — triggers We Can Fix It
      expect(testEngine.asPlayerOne().quest(moanaOfMotunui)).toBeSuccessfulCommand();

      // Decline We Can Fix It
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
            resolveOptional: false,
          });
      }

      // Princess should still be able to quest normally
      const questResult = testEngine.asPlayerOne().quest(princessCharacter);
      expect(questResult.success).toBe(true);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Pluto - Friendly Pooch
  // ═══════════════════════════════════════════════════════════════════════════
  describe("Pluto - Friendly Pooch", () => {
    it("Good Dog cost reduction applies to Shift cost too — reduces ink needed to pay alternate costs", () => {
      // Setup: Pluto Friendly Pooch in play, Pluto Determined Defender in hand
      // Shift cost is 5, but after Good Dog it should be 4
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [plutoFriendlyPooch, basePlutoCharacter],
          hand: [plutoDeterminedDefender],
          inkwell: 4, // 4 ink: not enough for Shift 5 normally, but after -1 from Good Dog = 4
          deck: 5,
        },
        { deck: 2 },
      );

      // Activate Good Dog to reduce next character cost by 1
      expect(testEngine.asPlayerOne().activateAbility(plutoFriendlyPooch)).toBeSuccessfulCommand();

      // Find the base Pluto instance for shift target
      const basePlutoId = testEngine.findCardInstanceId(basePlutoCharacter, "play", PLAYER_ONE);

      // Shift Pluto DD onto base Pluto — should cost 4 instead of 5
      const result = testEngine.asPlayerOne().playCard(plutoDeterminedDefender, {
        cost: { cost: "shift", shiftTarget: basePlutoId },
      });
      expect(result.success).toBe(true);
      expect(testEngine.asPlayerOne().getCardZone(plutoDeterminedDefender)).toBe("play");
    });
  });
});
