import type { CharacterCard } from "@tcg/lorcana-types";

export const beastWolfsbane: CharacterCard = {
  abilities: [],
  cardNumber: 70,
  cardType: "character",
  classifications: ["Hero", "Dreamborn", "Prince"],
  cost: 5,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Beast - Wolfsbane",
  id: "njm",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  name: "Beast",
  set: "001",
  strength: 4,
  text: "**Rush** _(This character can challenge the turn they",
  version: "Wolfsbane",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { rushAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const beastWolfbane: LorcanitoCharacterCard = {
//   Id: "njm",
//   Name: "Beast",
//   Title: "Wolfsbane",
//   Characteristics: ["hero", "dreamborn", "prince"],
//   Text: "**Rush** _(This character can challenge the turn they're played.)_\n**Roar** When you play this character, exert all opposing damaged characters.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "ROAR",
//       Text: "When you play this character, exert all opposing damaged characters.",
//       Effects: [
//         {
//           Type: "exert",
//           Exert: true,
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [
//               {
//                 Filter: "status",
//                 Value: "damage",
//                 Comparison: { operator: "gte", value: 1 },
//               },
//               { filter: "owner", value: "opponent" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         },
//       ],
//     }),
//     RushAbility,
//   ],
//   Flavour: "I'll take on all of you if I have to!",
//   Colors: ["emerald"],
//   Cost: 5,
//   Strength: 4,
//   Willpower: 4,
//   Lore: 2,
//   Illustrator: "Jeff Murchie",
//   Number: 70,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 501404,
//   },
//   Rarity: "legendary",
// };
//
