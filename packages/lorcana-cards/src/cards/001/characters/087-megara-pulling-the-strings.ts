import type { CharacterCard } from "@tcg/lorcana-types";

export const megaraPullingTheStrings: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "kv6-1",
      text: "**WONDER BOY** When you play this character, chosen character gets +2 {S} this turn.",
      type: "action",
    },
  ],
  cardNumber: 87,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Megara - Pulling the Strings",
  id: "kv6",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  name: "Megara",
  set: "001",
  strength: 2,
  text: "**WONDER BOY** When you play this character, chosen character gets +2 {S} this turn.",
  version: "Pulling the Strings",
  willpower: 1,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const megaraPullingTheStrings: LorcanitoCharacterCard = {
//   Id: "kv6",
//   Reprints: ["g7m"],
//   Name: "Megara",
//   Title: "Pulling the Strings",
//   Characteristics: ["dreamborn", "ally"],
//   Text: "**WONDER BOY** When you play this character, chosen character gets +2 {S} this turn.",
//   Type: "character",
//   Illustrator: "Aubrey Archer",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "Wonder Boy",
//       Text: "When you play this character, chosen character gets +2 {S} this turn.",
//       Effects: [
//         {
//           Type: "attribute",
//           Attribute: "strength",
//           Amount: 2,
//           Modifier: "add",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Flavour:
//     "A deal's a deal. But falling in love was never supposed to be part of it.",
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 2,
//   Strength: 2,
//   Willpower: 1,
//   Lore: 1,
//   Number: 87,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 507124,
//   },
//   Rarity: "common",
// };
//
