import type { CharacterCard } from "@tcg/lorcana-types";

export const genieWishFulfilled: CharacterCard = {
  abilities: [
    {
      id: "n6c-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      id: "n6c-2",
      name: "WHAT HAPPENS NOW?",
      text: "WHAT HAPPENS NOW? When you play this character, draw a card.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 53,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "53873ab78cd68666de74c7d32546d4290f86353b",
  },
  franchise: "Aladdin",
  fullName: "Genie - Wish Fulfilled",
  id: "n6c",
  inkType: ["amethyst"],
  inkable: false,
  lore: 2,
  name: "Genie",
  set: "006",
  strength: 2,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nWHAT HAPPENS NOW? When you play this character, draw a card.",
  version: "Wish Fulfilled",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { whenYouPlayMayDrawACard } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// Export const genieWishFulfilled: LorcanitoCharacterCard = {
//   Id: "xl7",
//   MissingTestCase: true,
//   Name: "Genie",
//   Title: "Wish Fulfilled",
//   Characteristics: ["dreamborn", "ally"],
//   Text: "Evasive (Only characters with Evasive can challenge this character.)\nWHAT COMES NEXT? When you play this character, draw a card.",
//   Type: "character",
//   Abilities: [
//     EvasiveAbility,
//     {
//       ...whenYouPlayMayDrawACard,
//       Name: "What Comes Next?",
//       Text: "When you play this character, you may draw a card.",
//       Optional: false,
//     },
//   ],
//   Inkwell: false,
//   Colors: ["amethyst"],
//   Cost: 4,
//   Strength: 2,
//   Willpower: 4,
//   Lore: 2,
//   Illustrator: "Veronica Di Lorenzo / Livio Cacciatore",
//   Number: 53,
//   Set: "006",
//   ExternalIds: {
//     TcgPlayer: 593007,
//   },
//   Rarity: "rare",
// };
//
