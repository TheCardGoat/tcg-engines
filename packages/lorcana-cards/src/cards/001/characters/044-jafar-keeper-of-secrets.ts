import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarKeeperOfSecrets: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "rau-1",
      text: "**HIDDEN WONDERS** This character gets +1 {S} for each card in your hand.",
      type: "action",
    },
  ],
  cardNumber: 44,
  cardType: "character",
  classifications: ["Dreamborn", "Sorcerer", "Villain"],
  cost: 4,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Jafar - Keeper of Secrets",
  id: "rau",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  name: "Jafar",
  set: "001",
  strength: 0,
  text: "**HIDDEN WONDERS** This character gets +1 {S} for each card in your hand.",
  version: "Keeper of Secrets",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const jafarKeeperOfSecrets: LorcanitoCharacterCard = {
//   Id: "rau",
//   Reprints: ["f6f"],
//   Name: "Jafar",
//   Title: "Keeper of Secrets",
//   Characteristics: ["dreamborn", "sorcerer", "villain"],
//   Text: "**HIDDEN WONDERS** This character gets +1 {S} for each card in your hand.",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "static",
//       Ability: "effects",
//       Name: "Hidden Wonders",
//       Text: "This character gets +1 {S} for each card in your hand.",
//       Effects: [
//         {
//           Type: "attribute",
//           Attribute: "strength",
//           Amount: {
//             Dynamic: true,
//             Filters: [
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//           Modifier: "add",
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [{ filter: "source", value: "self" }],
//           },
//         },
//       ],
//     },
//   ],
//   Flavour: "There's more than one way to bury secrets.",
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 4,
//   Willpower: 5,
//   Strength: 0,
//   Lore: 2,
//   Illustrator: "Marcel Berg",
//   Number: 44,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 507719,
//   },
//   Rarity: "rare",
// };
//
