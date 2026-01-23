import type { CharacterCard } from "@tcg/lorcana-types";

export const nickWildeWilyFox: CharacterCard = {
  id: "1uh",
  cardType: "character",
  name: "Nick Wilde",
  version: "Wily Fox",
  fullName: "Nick Wilde - Wily Fox",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "002",
  text: "IT'S CALLED A HUSTLE When you play this character, you may return an item card named Pawpsicle from your discard to your hand.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 154,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ef92275edba74ffeb10fbecd5ba1ae1a4ba84c2a",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const nickWildeWilyFox: LorcanitoCharacterCard = {
//   id: "eql",
//   name: "Nick Wilde",
//   title: "Wily Fox",
//   characteristics: ["storyborn", "ally"],
//   text: "**IT'S CALLED A HUSTLE** When you play this character, you may return an item card named Pawpsicle from your discard to your hand.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       optional: true,
//       name: "It's called a Hustle",
//       text: "When you play this character, you may return an item card named Pawpsicle from your discard to your hand.",
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               {
//                 filter: "attribute",
//                 value: "name",
//                 comparison: { operator: "eq", value: "Pawpsicle" },
//               },
//               { filter: "zone", value: "discard" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "It's criminal how good these things taste!",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Grace Tran",
//   number: 154,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527534,
//   },
//   rarity: "uncommon",
// };
//
