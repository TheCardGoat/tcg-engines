import type { ItemCard } from "@tcg/lorcana-types";

export const recordPlayer: ItemCard = {
  id: "1nm",
  cardType: "item",
  name: "Record Player",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "004",
  text: "LOOK AT THIS! Whenever you play a song, chosen character gets -2 {S} until the start of your next turn.\nHIT PARADE Your characters named Stitch count as having +1 cost to sing songs.",
  cost: 2,
  cardNumber: 32,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d6a087b851dcb654bb021e9fe5c60c69ddb6c769",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverYouPlayASong } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { propertyStaticAbilities } from "../../../abilities/propertyStaticAbilities";
//
// export const recordPlayer: LorcanitoItemCard = {
//   id: "jvf",
//   name: "Record Player",
//   characteristics: ["item"],
//   text: "**LOOK AT THIS!** Whenever you play a song, chosen character gets -2 {S} until the start of your next turn.\n\n**HIT PARADE** Your characters named Stitch count as having +1 cost to sing songs.",
//   type: "item",
//   abilities: [
//     wheneverYouPlayASong({
//       name: "LOOK AT THIS!",
//       text: "Whenever you play a song, chosen character gets -2 {S} until the start of your next turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           modifier: "subtract",
//           amount: 2,
//           duration: "next_turn",
//           until: true,
//           target: chosenCharacter,
//         },
//       ],
//     }),
//     propertyStaticAbilities({
//       name: "HIT PARADE",
//       text: "Your characters named Stitch count as having +1 cost to sing songs.",
//       attribute: "singCost",
//       amount: 1,
//       target: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "owner", value: "self" },
//           { filter: "zone", value: "play" },
//           {
//             filter: "attribute",
//             value: "name",
//             comparison: { operator: "eq", value: "stitch" },
//           },
//         ],
//       },
//     }),
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   illustrator: "Simone Buonfantino",
//   number: 32,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 546696,
//   },
//   rarity: "common",
// };
//
