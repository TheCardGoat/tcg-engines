import type { CharacterCard } from "@tcg/lorcana-types";

export const gantuGalacticFederationCaptain: CharacterCard = {
  abilities: [
    {
      effect: {
        restriction: "cant-challenge",
        target: "SELF",
        type: "restriction",
      },
      id: "c3k-1",
      name: "UNDER ARREST",
      text: "UNDER ARREST Characters with cost 2 or less can't challenge your characters.",
      type: "static",
    },
  ],
  cardNumber: 178,
  cardType: "character",
  classifications: ["Storyborn", "Alien", "Captain"],
  cost: 8,
  externalIds: {
    ravensburger: "2b9addfb94c8f45cfa1bb249ef2d1021ddee733e",
  },
  franchise: "Lilo and Stitch",
  fullName: "Gantu - Galactic Federation Captain",
  id: "c3k",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  name: "Gantu",
  set: "001",
  strength: 6,
  text: "UNDER ARREST Characters with cost 2 or less can't challenge your characters.",
  version: "Galactic Federation Captain",
  willpower: 6,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { charactersWithCostXorLessCantChallenge } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const gantuGalacticFederationCaptain: LorcanitoCharacterCard = {
//   Id: "ucw",
//
//   Name: "Gantu",
//   Title: "Galactic Federation Captain",
//   Characteristics: ["alien", "storyborn", "captain"],
//   Text: "**Under arrest** Characters with cost 2 or less can't challenge your characters.",
//   Type: "character",
//   Abilities: [
//     CharactersWithCostXorLessCantChallenge({
//       Name: "Under arrest",
//       Text: "Characters with cost 2 or less can't challenge your characters.",
//       Cost: 2,
//     }),
//   ],
//   Flavour: '"Relax, enjoy the trip... and don\'t get any ideas!"',
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 8,
//   Strength: 6,
//   Willpower: 6,
//   Lore: 2,
//   Illustrator: "Luis Huerta",
//   Number: 178,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 488097,
//   },
//   Rarity: "legendary",
// };
//
