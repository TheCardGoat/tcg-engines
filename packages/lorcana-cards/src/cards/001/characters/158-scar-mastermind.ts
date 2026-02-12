import type { CharacterCard } from "@tcg/lorcana-types";

export const scarMastermind: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -5,
        target: "CHOSEN_OPPOSING_CHARACTER",
        duration: "this-turn",
      },
      id: "1nb-1",
      name: "INSIDIOUS PLOT",
      text: "INSIDIOUS PLOT When you play this character, chosen opposing character gets -5 {S} this turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 158,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 6,
  externalIds: {
    ravensburger: "d58028e0439679ccda27077c066677d60f1cba4c",
  },
  franchise: "Lion King",
  fullName: "Scar - Mastermind",
  id: "1nb",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  name: "Scar",
  set: "001",
  strength: 5,
  text: "INSIDIOUS PLOT When you play this character, chosen opposing character gets -5 {S} this turn.",
  version: "Mastermind",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const scarMastermind: LorcanitoCharacterCard = {
//   Id: "l2a",
//   Name: "Scar",
//   Title: "Mastermind",
//   Characteristics: ["storyborn", "villain"],
//   Text: "**Insidious plot** When you play this character, chosen opposing character gets -5 {S} this turn.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "Insidious plot",
//       Text: "When you play this character, chosen opposing character gets -5 {S} this turn.",
//       Effects: [
//         {
//           Type: "attribute",
//           Attribute: "strength",
//           Amount: 5,
//           Modifier: "subtract",
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
//     }),
//   ],
//   Flavour: '"The best plans involve a little danger. Just not for me."',
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 6,
//   Strength: 5,
//   Willpower: 4,
//   Lore: 2,
//   Illustrator: "Bill Robinson",
//   Number: 158,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 485360,
//   },
//   Rarity: "rare",
// };
//
