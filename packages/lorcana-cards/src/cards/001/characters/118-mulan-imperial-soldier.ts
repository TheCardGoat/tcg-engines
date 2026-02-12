import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanImperialSoldier: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
        duration: "this-turn",
      },
      id: "nsp-1",
      name: "LEAD BY EXAMPLE",
      text: "LEAD BY EXAMPLE During your turn, whenever this character banishes another character in a challenge, your other characters get +1 {L} this turn.",
      type: "static",
    },
  ],
  cardNumber: 118,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 5,
  externalIds: {
    ravensburger: "55c43a8042650d3b7d79099e5ff68e2941e49d7f",
  },
  franchise: "Mulan",
  fullName: "Mulan - Imperial Soldier",
  id: "nsp",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  name: "Mulan",
  set: "001",
  strength: 4,
  text: "LEAD BY EXAMPLE During your turn, whenever this character banishes another character in a challenge, your other characters get +1 {L} this turn.",
  version: "Imperial Soldier",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { wheneverBanishesAnotherCharacterInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const mulanImperialSoldier: LorcanitoCharacterCard = {
//   Id: "cqk",
//   Name: "Mulan",
//   Title: "Imperial Soldier",
//   Characteristics: ["hero", "storyborn", "princess"],
//   Text: "**Lead by example** During your turn, whenever this character banishes another character in a challenge, your other characters get +1 {L} this turn.",
//   Type: "character",
//   Abilities: [
//     WheneverBanishesAnotherCharacterInChallenge({
//       Name: "Lead by example",
//       Text: "During your turn, whenever this character banishes another character in a challenge, your other characters get +1 {L} this turn.",
//       Effects: [
//         {
//           Type: "attribute",
//           Attribute: "lore",
//           Amount: 1,
//           Modifier: "add",
//           Duration: "turn",
//           Target: {
//             Type: "card",
//             Value: "all",
//             ExcludeSelf: true,
//             Filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 5,
//   Strength: 4,
//   Willpower: 5,
//   Lore: 1,
//   Illustrator: "Mel Milton",
//   Number: 118,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 516778,
//   },
//   Rarity: "super_rare",
// };
//
