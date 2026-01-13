import type { CharacterCard } from "@tcg/lorcana-types";

export const ursulaPowerHungry: CharacterCard = {
  id: "z61",
  cardType: "character",
  name: "Ursula",
  version: "Power Hungry",
  fullName: "Ursula - Power Hungry",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**IT",
  cost: 7,
  strength: 2,
  willpower: 8,
  lore: 3,
  cardNumber: 59,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [],
  classifications: ["Sorcerer", "Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { opponent, self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const ursulaPowerHungry: LorcanitoCharacterCard = {
//   id: "z61",
//   name: "Ursula",
//   title: "Power Hungry",
//   characteristics: ["sorcerer", "storyborn", "villain"],
//   text: "**IT'S TOO EASY!** When you play this character, each opponent loses 1 lore. You may draw a card for each 1 lore lost this way.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisCharAbility({
//       type: "resolution",
//       name: "It's Too Easy",
//       text: "Each opponent loses 1 lore. You may draw a card for each 1 lore lost this way.",
//       effects: [
//         {
//           type: "draw",
//           amount: 1,
//           target: self,
//         },
//         {
//           type: "lore",
//           modifier: "subtract",
//           amount: 1,
//           target: opponent,
//         },
//       ],
//     }),
//   ],
//   flavour:
//     "The first Rule of Villainy: If you're going to be evil, you've got to have <b>style</b>.",
//   colors: ["amethyst"],
//   cost: 7,
//   strength: 2,
//   willpower: 8,
//   lore: 3,
//   illustrator: "Simangaliso Sibaya",
//   number: 59,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508755,
//   },
//   rarity: "legendary",
// };
//
