import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellGiantFairy: CharacterCard = {
  id: "kvc",
  cardType: "character",
  name: "Tinker Bell",
  version: "Giant Fairy",
  fullName: "Tinker Bell - Giant Fairy",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "**Shift** 4 (_You may pay 4 {I} to play this on top of one of your characters named Tinker Bell._)\n**ROCK THE BOAT** When you play this character, deal 1 damage to each opposing character.\n\n**PUNY PIRATE!** During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen opposing character.",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 193,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "c3s-1",
      text: "**FAIRY DUST** When you play this character, you may deal 1 damage to each opposing character.",
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 1,
          target: {
            selector: "all",
            count: "all",
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Floodborn", "Ally", "Fairy"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import {
//   chosenOpposingCharacter,
//   eachOpposingCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { wheneverBanishesAnotherCharacterInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const tinkerBellGiantFairy: LorcanitoCharacterCard = {
//   id: "kvc",
//   reprints: ["rtd"],
//   name: "Tinker Bell",
//   title: "Giant Fairy",
//   characteristics: ["floodborn", "ally", "fairy"],
//   text: "**Shift** 4 (_You may pay 4 {I} to play this on top of one of your characters named Tinker Bell._)\n**ROCK THE BOAT** When you play this character, deal 1 damage to each opposing character.\n\n**PUNY PIRATE!** During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen opposing character.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       name: "Rock the Boat",
//       text: "When you play this character, deal 1 damage to each opposing character.",
//       effects: [
//         {
//           type: "damage",
//           amount: 1,
//           target: eachOpposingCharacter,
//         },
//       ],
//     }),
//     wheneverBanishesAnotherCharacterInChallenge({
//       name: "Puny Pirate!",
//       text: "During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen opposing character.",
//       optional: true,
//       effects: [
//         {
//           type: "damage",
//           amount: 2,
//           target: chosenOpposingCharacter,
//         },
//       ],
//     }),
//     shiftAbility(4, "Tinker Bell"),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 6,
//   strength: 4,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Cookie",
//   number: 193,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 503357,
//   },
//   rarity: "super_rare",
// };
//
