import type { CharacterCard } from "@tcg/lorcana-types";

export const ursulaPowerHungry: CharacterCard = {
  abilities: [],
  cardNumber: 59,
  cardType: "character",
  classifications: ["Sorcerer", "Storyborn", "Villain"],
  cost: 7,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Ursula - Power Hungry",
  id: "z61",
  inkType: ["amethyst"],
  inkable: true,
  lore: 3,
  name: "Ursula",
  set: "001",
  strength: 2,
  text: "**IT",
  version: "Power Hungry",
  willpower: 8,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { opponent, self } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const ursulaPowerHungry: LorcanitoCharacterCard = {
//   Id: "z61",
//   Name: "Ursula",
//   Title: "Power Hungry",
//   Characteristics: ["sorcerer", "storyborn", "villain"],
//   Text: "**IT'S TOO EASY!** When you play this character, each opponent loses 1 lore. You may draw a card for each 1 lore lost this way.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "It's Too Easy",
//       Text: "Each opponent loses 1 lore. You may draw a card for each 1 lore lost this way.",
//       Effects: [
//         {
//           Type: "draw",
//           Amount: 1,
//           Target: self,
//         },
//         {
//           Type: "lore",
//           Modifier: "subtract",
//           Amount: 1,
//           Target: opponent,
//         },
//       ],
//     }),
//   ],
//   Flavour:
//     "The first Rule of Villainy: If you're going to be evil, you've got to have <b>style</b>.",
//   Colors: ["amethyst"],
//   Cost: 7,
//   Strength: 2,
//   Willpower: 8,
//   Lore: 3,
//   Illustrator: "Simangaliso Sibaya",
//   Number: 59,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508755,
//   },
//   Rarity: "legendary",
// };
//
