import type { CharacterCard } from "@tcg/lorcana-types";

export const hadesKingOfOlympus: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 6,
      },
      id: "1e5-1",
      keyword: "Shift",
      text: "Shift 6",
      type: "keyword",
    },
    {
      effect: {
        modifier: {
          classification: "Villain",
          controller: "you",
          type: "classification-character-count",
        },
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1e5-2",
      name: "SINISTER PLOT",
      text: "SINISTER PLOT This character gets +1 {L} for each other Villain character you have in play.",
      type: "static",
    },
  ],
  cardNumber: 5,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "King", "Deity"],
  cost: 8,
  externalIds: {
    ravensburger: "b49576fe526d49f6abcdf5af9e3eb03f64505194",
  },
  franchise: "Hercules",
  fullName: "Hades - King of Olympus",
  id: "1e5",
  inkType: ["amber"],
  inkable: false,
  lore: 1,
  name: "Hades",
  set: "001",
  strength: 6,
  text: "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Hades.)\nSINISTER PLOT This character gets +1 {L} for each other Villain character you have in play.",
  version: "King of Olympus",
  willpower: 7,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const hadesKingOfOlympus: LorcanitoCharacterCard = {
//   Id: "j9i",
//   Name: "Hades",
//   Title: "King of Olympus",
//   Characteristics: ["floodborn", "villain", "king", "deity"],
//   Text: "**Shift** 6 (_You may pay 6 {I} to play this on top of one of your characters named Hades._)\n**Sinister plot** This character gets +1 {L} for every other Villain character you have in play.",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "static",
//       Ability: "effects",
//       Name: "Sinister plot",
//       Text: "This character gets +1 {L} for every other Villain character you have in play.",
//       Effects: [
//         {
//           Type: "attribute",
//           Attribute: "lore",
//           Modifier: "add",
//           Target: thisCharacter,
//           Amount: {
//             Dynamic: true,
//             Filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "self" },
//               { filter: "characteristics", value: ["villain"] },
//             ],
//           },
//         },
//       ],
//     },
//     ShiftAbility(6, "Hades"),
//   ],
//   Flavour: "Oh hey, I'm gonna need new business cards.",
//   Colors: ["amber"],
//   Cost: 8,
//   Strength: 6,
//   Willpower: 7,
//   Lore: 1,
//   Illustrator: "Alex Accorsi",
//   Number: 5,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 516775,
//   },
//   Rarity: "rare",
// };
//
