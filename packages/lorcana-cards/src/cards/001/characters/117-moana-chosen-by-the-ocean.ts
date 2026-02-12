import type { CharacterCard } from "@tcg/lorcana-types";

export const moanaChosenByTheOcean: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      id: "176-1",
      name: "THIS IS NOT WHO YOU ARE",
      text: "THIS IS NOT WHO YOU ARE When you play this character, you may banish chosen character named Te Kā.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 117,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 5,
  externalIds: {
    ravensburger: "045c9d82ec1f6de1fc7e93d21807204b5adf2985",
  },
  franchise: "Moana",
  fullName: "Moana - Chosen by the Ocean",
  id: "176",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  name: "Moana",
  set: "001",
  strength: 2,
  text: "THIS IS NOT WHO YOU ARE When you play this character, you may banish chosen character named Te Kā.",
  version: "Chosen by the Ocean",
  willpower: 6,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const moanChosenByTheOcean: LorcanitoCharacterCard = {
//   Id: "w14",
//   Name: "Moana",
//   Title: "Chosen by the Ocean",
//   Characteristics: ["hero", "storyborn", "princess"],
//   Text: "**THIS IS NOT WHO YOU ARE** When you play this character, you may banish chosen character named Te Ka.",
//   Type: "character",
//   Illustrator: "Tanisha Cherislin",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Optional: true,
//       Name: "THIS IS NOT WHO YOU ARE",
//       Text: "When you play this character, you may banish chosen character named Te Ka.",
//       Type: "resolution",
//       Effects: [
//         {
//           Type: "banish",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               {
//                 Filter: "attribute",
//                 Value: "name",
//                 Comparison: { operator: "eq", value: "Te Ka" },
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Flavour: "You know who you are.",
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 5,
//   Strength: 2,
//   Willpower: 6,
//   Lore: 2,
//   Number: 117,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508786,
//   },
//   Rarity: "uncommon",
// };
//
