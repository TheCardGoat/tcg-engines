import type { CharacterCard } from "@tcg/lorcana-types";

export const maximusRelentlessPursuer: CharacterCard = {
  abilities: [
    {
      id: "2z0-1",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      id: "2z0-2",
      name: "HORSE KICK",
      text: "HORSE KICK When you play this character, chosen character gets -2 {S} this turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 11,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "0ab6dfaa2b7d68e702c7a1f3f1ea67f1e2789b76",
  },
  franchise: "Tangled",
  fullName: "Maximus - Relentless Pursuer",
  id: "2z0",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  name: "Maximus",
  set: "001",
  strength: 3,
  text: "Rush HORSE KICK When you play this character, chosen character gets -2 {S} this turn.",
  version: "Relentless Pursuer",
  willpower: 3,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const maximusRentlessPersuer: LorcanitoCharacterCard = {
//   Id: "ak8",
//
//   Name: "Maximus",
//   Title: "Relentless Pursuer",
//   Characteristics: ["dreamborn", "ally"],
//   Text: "**HORSE KICK** When you play this character, chosen character gets -2 {S} this turn.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "HORSE KICK",
//       Text: "When you play this character, chosen character gets -2 {S} this turn.",
//       Effects: [
//         {
//           Type: "attribute",
//           Attribute: "strength",
//           Amount: 2,
//           Modifier: "subtract",
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
//     "He pursues his quarry with courage, discipline, \rand a touch of class.",
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 3,
//   Strength: 3,
//   Willpower: 3,
//   Lore: 1,
//   Illustrator: "Kendall Hale",
//   Number: 11,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 494101,
//   },
//   Rarity: "uncommon",
// };
//
