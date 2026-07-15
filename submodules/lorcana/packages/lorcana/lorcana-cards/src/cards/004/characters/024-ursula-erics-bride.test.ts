// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import { opponentRevealHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const ursulaEricsBride: LorcanitoCharacterCard = {
//   Id: "hvg",
//   MissingTestCase: true,
//   Name: "Ursula",
//   Title: "Eric's Bride",
//   Characteristics: ["floodborn", "sorcerer", "villain", "princess"],
//   Text: "**Shift: Discard a song card** _(You may discard a song card to play this on top of one of your characters named Ursula.)_\n\n**VANESSA'S DESIGN** Whenever this character quests, chosen opponent reveals their hand and discards a non-character card of your choice.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(
//       [
//         {
//           Type: "card",
//           Action: "discard",
//           Amount: 1,
//           Filters: [
//             { filter: "zone", value: "hand" },
//             { filter: "owner", value: "self" },
//             { filter: "type", value: "action" },
//             { filter: "characteristics", value: ["song"] },
//           ],
//         },
//       ],
//       "ursula",
//       "**Shift: Discard a song card**",
//     ),
//     WheneverQuests({
//       Name: "VANESSA'S DESIGN",
//       Text: "Whenever this character quests, chosen opponent reveals their hand and discards a non-character card of your choice.",
//       ResolveEffectsIndividually: true,
//       Effects: [
//         {
//           Type: "discard",
//           Amount: 1,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: ["location", "item", "action"] },
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "opponent" },
//             ],
//           },
//         },
//         OpponentRevealHand,
//       ],
//     }),
//   ],
//   Colors: ["amber"],
//   Cost: 4,
//   Strength: 2,
//   Willpower: 4,
//   Lore: 2,
//   Illustrator: "Lisanne Koeteeuw",
//   Number: 24,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 547763,
//   },
//   Rarity: "rare",
// };
//

import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { ursulaEricsBride } from "./024-ursula-erics-bride";
import { mickeyMouseTrueFriend } from "../../001";

// A song card to use as shift cost / opponent hand target
const songCard = createMockSong({
  id: "erics-bride-test-song",
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

// A non-character, non-song card (an action) in opponent's hand
const actionCard = createMockSong({
  id: "erics-bride-test-action",
  name: "Test Action Card",
  cost: 1,
  text: "Gain 1 lore.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
});

// A lower-cost Ursula to shift onto
const ursulaBase = createMockCharacter({
  id: "erics-bride-test-ursula-base",
  name: "Ursula",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

describe("Ursula - Eric's Bride", () => {
  describe("Shift: Discard a song card", () => {
    it("can shift onto an Ursula character by discarding a song card from hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 0,
        play: [ursulaBase],
        hand: [songCard, ursulaEricsBride],
      });

      const shiftTarget = testEngine.findCardInstanceId(ursulaBase, "play", PLAYER_ONE);
      const songToDiscard = testEngine.findCardInstanceId(songCard, "hand", PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(ursulaEricsBride, {
          cost: {
            cost: "shift",
            shiftTarget,
            discardCards: [songToDiscard],
          },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(ursulaEricsBride)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(songCard)).toBe("discard");
    });

    it("cannot shift by discarding a non-song card", () => {
      const nonSong = createMockCharacter({
        id: "erics-bride-non-song",
        name: "Non Song Card",
        cost: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 0,
        play: [ursulaBase],
        hand: [nonSong, ursulaEricsBride],
      });

      const shiftTarget = testEngine.findCardInstanceId(ursulaBase, "play", PLAYER_ONE);
      const nonSongId = testEngine.findCardInstanceId(nonSong, "hand", PLAYER_ONE);

      const result = testEngine.asPlayerOne().playCard(ursulaEricsBride, {
        cost: {
          cost: "shift",
          shiftTarget,
          discardCards: [nonSongId],
        },
      });

      expect(result.success).toBe(false);
    });

    it("cannot shift onto a non-Ursula character", () => {
      const nonUrsula = createMockCharacter({
        id: "erics-bride-non-ursula",
        name: "Mickey Mouse",
        cost: 2,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 0,
        play: [nonUrsula],
        hand: [songCard, ursulaEricsBride],
      });

      const shiftTarget = testEngine.findCardInstanceId(nonUrsula, "play", PLAYER_ONE);
      const songToDiscard = testEngine.findCardInstanceId(songCard, "hand", PLAYER_ONE);

      const result = testEngine.asPlayerOne().playCard(ursulaEricsBride, {
        cost: {
          cost: "shift",
          shiftTarget,
          discardCards: [songToDiscard],
        },
      });

      expect(result.success).toBe(false);
    });
  });

  describe("VANESSA'S DESIGN - Whenever this character quests, chosen opponent reveals their hand and discards a non-character card of your choice.", () => {
    it("reveals the opponent's hand and discards a non-character card chosen by the controller when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: ursulaEricsBride, isDrying: false }],
          deck: 2,
        },
        {
          hand: [actionCard, mickeyMouseTrueFriend],
        },
      );

      const opponentHandIds = testEngine.getCardInstanceIdsInZone("hand", PLAYER_TWO);
      const actionCardId = testEngine.findCardInstanceId(actionCard, "hand", "p2");

      expect(testEngine.asPlayerOne().quest(ursulaEricsBride)).toBeSuccessfulCommand();

      // Controller chooses the non-character card to discard
      expect(testEngine.asPlayerOne().respondWith(actionCardId)).toBeSuccessfulCommand();

      // Opponent's hand cards should have been revealed
      const cardMeta = testEngine.getAuthoritativeState().ctx.zones.private.cardMeta;
      for (const cardId of opponentHandIds) {
        expect(cardMeta[cardId]?.revealed).toBe(true);
      }

      // Non-character card should be discarded
      expect(testEngine.asPlayerTwo().getCardZone(actionCard)).toBe("discard");

      // Character card remains in hand
      expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("hand");

      // Should gain lore from questing
      expect(testEngine.getLore(PLAYER_ONE)).toBe(ursulaEricsBride.lore);
    });

    it("does not discard character cards when no non-character cards exist in opponent hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: ursulaEricsBride, isDrying: false }],
          deck: 2,
        },
        {
          hand: [mickeyMouseTrueFriend],
        },
      );

      const opponentHandIds = testEngine.getCardInstanceIdsInZone("hand", PLAYER_TWO);

      expect(testEngine.asPlayerOne().quest(ursulaEricsBride)).toBeSuccessfulCommand();

      // Opponent's hand should have been revealed even when there are no valid targets
      const cardMeta = testEngine.getAuthoritativeState().ctx.zones.private.cardMeta;
      for (const cardId of opponentHandIds) {
        expect(cardMeta[cardId]?.revealed).toBe(true);
      }

      // Character card stays in hand (no valid targets for discard, effect auto-resolves)
      expect(testEngine.asPlayerTwo().getCardZone(mickeyMouseTrueFriend)).toBe("hand");
    });
  });
});
