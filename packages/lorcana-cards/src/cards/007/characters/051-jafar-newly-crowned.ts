import type { CharacterCard } from "@tcg/lorcana-types";

export const jafarNewlyCrowned: CharacterCard = {
  id: "1i1",
  cardType: "character",
  name: "Jafar",
  version: "Newly Crowned",
  fullName: "Jafar - Newly Crowned",
  inkType: ["amethyst", "steel"],
  franchise: "Aladdin",
  set: "007",
  text: "THIS IS NOT DONE YET During an opponent's turn, whenever one of your Illusion characters is banished, you may return that card to your hand.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 51,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c2c99cc57b2bf9c36b9c67847831c8544b963b06",
  },
  abilities: [],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { wheneverOneOfYouCharactersIsBanished } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const jafarNewlyCrowned: LorcanitoCharacterCard = {
//   id: "zb8",
//   name: "Jafar",
//   title: "Newly Crowned",
//   characteristics: ["dreamborn", "villain", "sorcerer"],
//   text: "THIS IS NOT DONE YET During an opponent’s turn, whenever one of your Illusion characters is banished, you may return that card to your hand.",
//   type: "character",
//   abilities: [
//     wheneverOneOfYouCharactersIsBanished({
//       name: "THIS IS NOT DONE YET",
//       text: "During an opponent's turn, whenever one of your Illusion characters is banished, you may return that card to your hand.",
//       optional: true,
//       conditions: [{ type: "during-turn", value: "opponent" }],
//       triggerTarget: [
//         { filter: "type", value: "character" },
//         { filter: "characteristics", value: ["illusion"] },
//         { filter: "owner", value: "self" },
//       ],
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "source", value: "trigger" }],
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//
//   colors: ["amethyst", "steel"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   illustrator: "John Loren / Nicholas Kole",
//   number: 51,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618173,
//   },
//   rarity: "super_rare",
//   lore: 2,
// };
//
