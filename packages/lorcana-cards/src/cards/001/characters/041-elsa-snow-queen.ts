import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaSnowQueen: CharacterCard = {
  abilities: [],
  cardNumber: 41,
  cardType: "character",
  classifications: ["Hero", "Dreamborn", "Queen", "Sorcerer"],
  cost: 3,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Elsa - Snow Queen",
  id: "u2z",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  name: "Elsa",
  set: "001",
  strength: 2,
  text: "**Freeze** {E} - Exert chosen opposing character.",
  version: "Snow Queen",
  willpower: 3,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const elsaSnowQueen: LorcanitoCharacterCard = {
//   Id: "u2z",
//   Reprints: ["hcz"],
//   Name: "Elsa",
//   Title: "Snow Queen",
//   Characteristics: ["hero", "dreamborn", "queen", "sorcerer"],
//   Text: "**Freeze** {E} - Exert chosen opposing character.",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "Freeze",
//       Text: "Exert chosen opposing character.",
//       Costs: [{ type: "exert" }],
//       Effects: [
//         {
//           Type: "exert",
//           Exert: true,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "opponent" },
//             ],
//           },
//         },
//       ],
//     } as ActivatedAbility,
//   ],
//   Flavour:
//     "Recreated by magical ink, Elsa found herself in an unfamiliar new world. Fortunately, ice works the same way everywhere.",
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 3,
//   Strength: 2,
//   Willpower: 3,
//   Lore: 1,
//   Illustrator: "Nicholas Kole",
//   Number: 41,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492705,
//   },
//   Rarity: "uncommon",
// };
//
