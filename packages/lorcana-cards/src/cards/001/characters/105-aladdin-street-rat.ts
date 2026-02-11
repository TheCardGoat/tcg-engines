import type { CharacterCard } from "@tcg/lorcana-types";

export const aladdinStreetRat: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
      id: "ec0-1",
      name: "IMPROVISE",
      text: "IMPROVISE When you play this character, each opponent loses 1 lore.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 105,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "33a8b4eedbcab6c827f3eb65178e48bf29d42142",
  },
  franchise: "Aladdin",
  fullName: "Aladdin - Street Rat",
  id: "ec0",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  name: "Aladdin",
  set: "001",
  strength: 2,
  text: "IMPROVISE When you play this character, each opponent loses 1 lore.",
  version: "Street Rat",
  willpower: 2,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { opponent } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const aladdinStreetRat: LorcanitoCharacterCard = {
//   Id: "d9z",
//
//   Name: "Aladdin",
//   Title: "Street Rat",
//   Characteristics: ["hero", "storyborn"],
//   Text: "**IMPROVISE** When you play this character each opponent loses 1 lore.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "IMPROVISE",
//       Text: "When you play this character each opponent loses 1 lore.",
//       Effects: [
//         {
//           Type: "lore",
//           Modifier: "subtract",
//           Amount: 1,
//           Target: opponent,
//         },
//       ],
//     }),
//   ],
//   Flavour:
//     "It can be hard to tell the difference between a diamond in the rough and someone who's just, well, rough.",
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 3,
//   Strength: 2,
//   Willpower: 2,
//   Lore: 1,
//   Illustrator: "Peter Brockhammer",
//   Number: 105,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 505947,
//   },
//   Rarity: "common",
// };
//
