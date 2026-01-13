import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseDetective: CharacterCard = {
  id: "1wh",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Detective",
  fullName: "Mickey Mouse - Detective",
  inkType: ["sapphire"],
  set: "010",
  text: "GET A CLUE When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 160,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f6d5d539a411651374ae418f08e3d379fcb13ff5",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenYouPlayThisCharacter } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { mickeyMouseDetective as ogMickeyMouseDetective } from "@lorcanito/lorcana-engine/cards/001/characters/154-mickey-mouse-detective";
//
// export const mickeyMouseDetective: LorcanitoCharacterCard = {
//   id: "crp",
//   reprints: [ogMickeyMouseDetective.id],
//   name: "Mickey Mouse",
//   title: "Detective",
//   characteristics: ["dreamborn", "hero", "detective"],
//   text: "GET A CLUE When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
//   type: "character",
//   inkwell: false,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 1,
//   willpower: 3,
//   illustrator: "Victor 'Yano' Covarrubias / Bryan Turner",
//   number: 160,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659388,
//   },
//   rarity: "common",
//   abilities: [
//     whenYouPlayThisCharacter({
//       name: "GET A CLUE",
//       text: "When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
//       optional: true,
//       effects: [
//         {
//           type: "move",
//           to: "inkwell",
//           amount: 1,
//           exerted: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               {
//                 filter: "top-deck",
//                 value: "self",
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   lore: 1,
// };
//
