import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimTinyAdversary: CharacterCard = {
  id: "jgv",
  cardType: "character",
  name: "Madam Mim",
  version: "Tiny Adversary",
  fullName: "Madam Mim - Tiny Adversary",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "006",
  text: "Challenger +1 (While challenging, this character gets +1 {S}.)\nZIM ZABBERIM ZIM Your other characters gain Challenger +1.",
  cost: 2,
  strength: 0,
  willpower: 3,
  lore: 1,
  cardNumber: 37,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "462aeda1519544194de59f6734300225a5c89003",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { challengerAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const madamMimTinyAdversary: LorcanitoCharacterCard = {
//   id: "mha",
//   name: "Madam Mim",
//   title: "Tiny Adversary",
//   characteristics: ["storyborn", "villain", "sorcerer"],
//   text: "Challenger +1 (While challenging, this character gets +1 {S}.)\nZIM ZABBERIM ZIM Your other characters gain Challenger +1.",
//   type: "character",
//   abilities: [
//     challengerAbility(1),
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "Zim Zabberim Zim",
//       text: "Your other characters gain Challenger +1.",
//       gainedAbility: challengerAbility(1),
//       target: {
//         type: "card",
//         value: "all",
//         excludeSelf: true,
//         filters: [
//           { filter: "zone", value: "play" },
//           { filter: "type", value: "character" },
//           { filter: "owner", value: "self" },
//         ],
//       },
//     },
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   strength: 0,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Moniek Schilder",
//   number: 37,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593023,
//   },
//   rarity: "rare",
// };
//
