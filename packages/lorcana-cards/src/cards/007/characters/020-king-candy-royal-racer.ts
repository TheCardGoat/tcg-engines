import type { CharacterCard } from "@tcg/lorcana-types";

export const kingCandyRoyalRacer: CharacterCard = {
  id: "6oo",
  cardType: "character",
  name: "King Candy",
  version: "Royal Racer",
  fullName: "King Candy - Royal Racer",
  inkType: ["amber", "ruby"],
  franchise: "Wreck It Ralph",
  set: "007",
  text: "SWEET REVENGE Whenever one of your other Racer characters is banished, each opponent chooses and banishes one of their characters.",
  cost: 4,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 20,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1818b1dcc9d7128736de392808ddbc8d6ee9a6ef",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "King", "Racer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { opponent } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYourOtherCharactersIsBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const kingCandyRoyalRacer: LorcanitoCharacterCard = {
//   id: "fv1",
//   name: "King Candy",
//   title: "Royal Racer",
//   characteristics: ["storyborn", "villain", "king", "racer"],
//   text: "SWEET REVENGE Whenever one of your other Racer characters is banished, each opponent chooses and banishes one of their characters.",
//   type: "character",
//   abilities: [
//     whenYourOtherCharactersIsBanished({
//       name: "SWEET REVENGE",
//       text: "Whenever one of your other Racer characters is banished, each opponent chooses and banishes one of their characters.",
//       triggerTarget: [
//         { filter: "type", value: "character" },
//         { filter: "characteristics", value: ["racer"] },
//         { filter: "owner", value: "self" },
//       ],
//       effects: [
//         {
//           type: "create-layer-for-player",
//           target: opponent,
//           layer: {
//             type: "resolution",
//             name: "Sweet Revenge",
//             text: "Choose and banish one of your characters.",
//             responder: "opponent",
//             effects: [
//               {
//                 type: "banish",
//                 target: {
//                   type: "card",
//                   value: 1,
//                   filters: [
//                     { filter: "type", value: "character" },
//                     { filter: "zone", value: "play" },
//                     { filter: "owner", value: "self" },
//                   ],
//                 },
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//
//   colors: ["amber", "ruby"],
//   cost: 4,
//   strength: 2,
//   willpower: 2,
//   illustrator: "Stefano Spagnuolo",
//   number: 20,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618737,
//   },
//   rarity: "super_rare",
//   lore: 2,
// };
//
