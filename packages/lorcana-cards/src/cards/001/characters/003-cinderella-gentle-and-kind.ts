import type { CharacterCard } from "@tcg/lorcana-types";

export const cinderellaGentleAndKind: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 3,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "remove-damage",
        upTo: true,
      },
      id: "qil-1",
      text: "**Singer** 5 _(This character counts as cost 5 to sing songs.)_\n\n**A WONDERFUL DREAM** {E}− Remove up to 3 damage from chosen Princess character.",
      type: "action",
    },
  ],
  cardNumber: 3,
  cardType: "character",
  classifications: ["Hero", "Storyborn", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Cinderella - Gentle and Kind",
  id: "qil",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  name: "Cinderella",
  set: "001",
  strength: 2,
  text: "**Singer** 5 _(This character counts as cost 5 to sing songs.)_\n\n**A WONDERFUL DREAM** {E}− Remove up to 3 damage from chosen Princess character.",
  version: "Gentle and Kind",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const cinderellaGentleAndKind: LorcanitoCharacterCard = {
//   Id: "qil",
//   Reprints: ["xks"],
//   Name: "Cinderella",
//   Title: "Gentle and Kind",
//   Characteristics: ["hero", "storyborn", "princess"],
//   Text: "**Singer** 5 _(This character counts as cost 5 to sing songs.)_\n\n**A WONDERFUL DREAM** {E}− Remove up to 3 damage from chosen Princess character.",
//   Type: "character",
//   Illustrator: "Javier Salas",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "A WONDERFUL DREAM",
//       Text: "{E}− Remove up to 3 damage from chosen Princess character.",
//       Costs: [{ type: "exert" }],
//       Effects: [
//         {
//           Type: "heal",
//           Amount: 3,
//           UpTo: true,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//               { filter: "characteristics", value: ["princess"] },
//             ],
//           },
//         },
//       ],
//     },
//     {
//       Type: "static",
//       Ability: "singer",
//       Value: 5,
//       Text: "**Singer** 5 _(This character counts as cost 4 to sing songs.)_",
//     },
//   ],
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 4,
//   Strength: 2,
//   Willpower: 5,
//   Lore: 2,
//   Number: 3,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508692,
//   },
//   Rarity: "uncommon",
// };
//
