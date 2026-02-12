import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchRockStar: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "y9k-1",
      keyword: "Shift",
      text: "Shift 4 {I}",
      type: "keyword",
    },
    {
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      id: "y9k-2",
      name: "ADORING FANS",
      text: "ADORING FANS Whenever you play a character with cost 2 or less, you may exert them to draw a card.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
        },
      },
      type: "triggered",
    },
  ],
  cardNumber: 3,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Alien"],
  cost: 6,
  externalIds: {
    ravensburger: "7b7f04e633966caf889d94df0f18c427dd6306f6",
  },
  franchise: "Lilo and Stitch",
  fullName: "Stitch - Rock Star",
  id: "y9k",
  inkType: ["amber"],
  inkable: true,
  lore: 3,
  name: "Stitch",
  set: "009",
  strength: 3,
  text: "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Stitch.)\nADORING FANS Whenever you play a character with cost 2 or less, you may exert them to draw a card.",
  version: "Rock Star",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { stitchRockStar as ogStitchRockStar } from "@lorcanito/lorcana-engine/cards/001/characters/023-stitch-rock-star";
//
// Export const stitchRockStar: LorcanitoCharacterCard = {
//   ...ogStitchRockStar,
//   Id: "yom",
//   Reprints: [ogStitchRockStar.id],
//   Number: 3,
//   Set: "009",
//   ExternalIds: {
//     TcgPlayer: 649952,
//   },
// };
//
