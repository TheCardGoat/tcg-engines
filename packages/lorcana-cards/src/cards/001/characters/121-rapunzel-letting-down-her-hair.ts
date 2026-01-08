import type { CharacterCard } from "@tcg/lorcana-types";

export const rapunzelLettingDownHerHair: CharacterCard = {
  id: "eqs",
  cardType: "character",
  name: "Rapunzel",
  version: "Letting Down Her Hair",
  fullName: "Rapunzel - Letting Down Her Hair",
  inkType: ["ruby"],
  franchise: "Disney",
  set: "001",
  text: "**TANGLE** When you play this character, each opponent loses 1 lore.",
  cost: 6,
  strength: 5,
  willpower: 4,
  lore: 2,
  cardNumber: 121,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**TANGLE** When you play this character, each opponent loses 1 lore.",
      id: "eqs-1",
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
    },
  ],
  classifications: ["Hero", "Dreamborn", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { LoreEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// export const rapunzelLettingHerHairDown: LorcanitoCharacterCard = {
//   id: "eqs",
//   reprints: ["aq6"],
//
//   name: "Rapunzel",
//   title: "Letting Down Her Hair",
//   characteristics: ["hero", "dreamborn", "princess"],
//   text: "**TANGLE** When you play this character, each opponent loses 1 lore.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       name: "Tangle",
//       text: "When you play this character, each opponent loses 1 lore.",
//       effects: [
//         {
//           type: "lore",
//           modifier: "subtract",
//           amount: 1,
//           target: {
//             type: "player",
//             value: "opponent",
//           },
//         } as LoreEffect,
//       ],
//     }),
//   ],
//   flavour: "Who are you? And how did you find me?",
//   colors: ["ruby"],
//   cost: 6,
//   strength: 5,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Clio Wolfensberger",
//   number: 121,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 502011,
//   },
//   rarity: "uncommon",
// };
//
