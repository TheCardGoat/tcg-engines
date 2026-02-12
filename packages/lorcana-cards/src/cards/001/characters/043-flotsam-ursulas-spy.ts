import type { CharacterCard } from "@tcg/lorcana-types";

export const flotsamUrsulasSpy: CharacterCard = {
  abilities: [
    {
      id: "4d0-1",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "YOUR_CHARACTERS",
        duration: "this-turn",
      },
      id: "4d0-2",
      name: "DEXTEROUS LUNGE",
      text: "DEXTEROUS LUNGE Your characters named Jetsam gain Rush.",
      type: "static",
    },
  ],
  cardNumber: 43,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "0fb84ba893dbb130cedf653b49ff8e2427440270",
  },
  franchise: "Little Mermaid",
  fullName: "Flotsam - Ursula’s Spy",
  id: "4d0",
  inkType: ["amethyst"],
  inkable: false,
  lore: 2,
  name: "Flotsam",
  set: "001",
  strength: 3,
  text: "Rush (This character can challenge the turn they're played.)\nDEXTEROUS LUNGE Your characters named Jetsam gain Rush.",
  version: "Ursula’s Spy",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import {
//   RushAbility,
//   YourCharactersNamedGain,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const flotsamUrsulaSpy: LorcanitoCharacterCard = {
//   Id: "apr",
//
//   Name: "Flotsam",
//   Title: "Ursula's Spy",
//   Characteristics: ["storyborn", "ally"],
//   Text: "**Rush** _(This character can challenge the turn they're played.)_\nc",
//   Type: "character",
//   Abilities: [
//     RushAbility,
//     YourCharactersNamedGain({
//       Name: "Jetsam",
//       Ability: rushAbility,
//     }),
//   ],
//   Flavour: "We know someone who can help you . . . for a price.",
//   Colors: ["amethyst"],
//   Cost: 5,
//   Strength: 3,
//   Willpower: 4,
//   Lore: 2,
//   Illustrator: "Luis Huerta",
//   Number: 43,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 503318,
//   },
//   Rarity: "rare",
// };
//
