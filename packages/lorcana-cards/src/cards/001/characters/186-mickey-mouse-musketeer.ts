import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseMusketeer: CharacterCard = {
  abilities: [
    {
      id: "9h9-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      id: "9h9-2",
      name: "ALL FOR ONE",
      text: "ALL FOR ONE Your other Musketeer characters get +1 {S}.",
      type: "static",
    },
  ],
  cardNumber: 186,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Musketeer"],
  cost: 6,
  externalIds: {
    ravensburger: "222a49ab00ebfa5c98e9df4f600b676cbbeb4f6d",
  },
  fullName: "Mickey Mouse - Musketeer",
  id: "9h9",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  name: "Mickey Mouse",
  set: "001",
  strength: 2,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nALL FOR ONE Your other Musketeer characters get +1 {S}.",
  version: "Musketeer",
  willpower: 7,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const mickeyMouseMusketeer: LorcanitoCharacterCard = {
//   Id: "o71",
//   Name: "Mickey Mouse",
//   Title: "Musketeer",
//   Characteristics: ["hero", "dreamborn", "musketeer"],
//   Text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_\n**ALL FOR ONE** Your other Musketeer characters\rget +1 {S}.",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "static",
//       Ability: "effects",
//       Name: "All For One",
//       Text: "Your other Musketeer characters get +1 {S}.",
//       Effects: [
//         {
//           Type: "attribute",
//           Attribute: "strength",
//           Amount: 1,
//           Modifier: "add",
//           Duration: "turn",
//           Target: {
//             Type: "card",
//             Value: "all",
//             ExcludeSelf: true,
//             Filters: [
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//               { filter: "characteristics", value: ["musketeer"] },
//             ],
//           },
//         },
//       ],
//     },
//     BodyguardAbility,
//   ],
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 6,
//   Strength: 2,
//   Willpower: 7,
//   Lore: 2,
//   Illustrator: "Jochem Van Gool",
//   Number: 186,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 494141,
//   },
//   Rarity: "rare",
// };
//
