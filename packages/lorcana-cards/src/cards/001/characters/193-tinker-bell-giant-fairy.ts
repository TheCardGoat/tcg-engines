import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellGiantFairy: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: {
            cardTypes: ["character"],
            count: "all",
            owner: "opponent",
            selector: "all",
            zones: ["play"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "c3s-1",
      text: "**FAIRY DUST** When you play this character, you may deal 1 damage to each opposing character.",
      type: "action",
    },
  ],
  cardNumber: 193,
  cardType: "character",
  classifications: ["Floodborn", "Ally", "Fairy"],
  cost: 6,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Tinker Bell - Giant Fairy",
  id: "kvc",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  name: "Tinker Bell",
  set: "001",
  strength: 4,
  text: "**Shift** 4 (_You may pay 4 {I} to play this on top of one of your characters named Tinker Bell._)\n**ROCK THE BOAT** When you play this character, deal 1 damage to each opposing character.\n\n**PUNY PIRATE!** During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen opposing character.",
  version: "Giant Fairy",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import {
//   ChosenOpposingCharacter,
//   EachOpposingCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { wheneverBanishesAnotherCharacterInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// Export const tinkerBellGiantFairy: LorcanitoCharacterCard = {
//   Id: "kvc",
//   Reprints: ["rtd"],
//   Name: "Tinker Bell",
//   Title: "Giant Fairy",
//   Characteristics: ["floodborn", "ally", "fairy"],
//   Text: "**Shift** 4 (_You may pay 4 {I} to play this on top of one of your characters named Tinker Bell._)\n**ROCK THE BOAT** When you play this character, deal 1 damage to each opposing character.\n\n**PUNY PIRATE!** During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen opposing character.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "Rock the Boat",
//       Text: "When you play this character, deal 1 damage to each opposing character.",
//       Effects: [
//         {
//           Type: "damage",
//           Amount: 1,
//           Target: eachOpposingCharacter,
//         },
//       ],
//     }),
//     WheneverBanishesAnotherCharacterInChallenge({
//       Name: "Puny Pirate!",
//       Text: "During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen opposing character.",
//       Optional: true,
//       Effects: [
//         {
//           Type: "damage",
//           Amount: 2,
//           Target: chosenOpposingCharacter,
//         },
//       ],
//     }),
//     ShiftAbility(4, "Tinker Bell"),
//   ],
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 6,
//   Strength: 4,
//   Willpower: 5,
//   Lore: 2,
//   Illustrator: "Cookie",
//   Number: 193,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 503357,
//   },
//   Rarity: "super_rare",
// };
//
