import type { CharacterCard } from "@tcg/lorcana-types";

export const cruellaDeVilStyleIcon: CharacterCard = {
  id: "1r1",
  cardType: "character",
  name: "Cruella De Vil",
  version: "Style Icon",
  fullName: "Cruella De Vil - Style Icon",
  inkType: ["sapphire"],
  franchise: "101 Dalmatians",
  set: "009",
  text: "OUT OF SEASON Once during your turn, whenever a character with cost 2 or less is banished, put the top card of your deck into your inkwell facedown and exerted.\nINSULTING REMARK During your turn, each opposing character with cost 2 or less gets -1 {S}.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 143,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e5bb1685c01df7b1a16869d418b4b0beac7c54a7",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { yourOtherCharacters } from "@lorcanito/lorcana-engine/abilities/target";
// import { wheneverIsBanished } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { putTopCardOfYourDeckIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const cruellaDeVilStyleIcon: LorcanitoCharacterCard = {
//   id: "mpf",
//   name: "Cruella De Vil",
//   title: "Style Icon",
//   characteristics: ["storyborn", "villain"],
//   text: "OUT OF SEASON Once during your turn, whenever a character with cost 2 or less is banished, put the top card of your deck into your inkwell facedown and exerted.\nINSULTING REMARK During your turn, each opposing character with cost 2 or less gets -1 {S}.",
//   type: "character",
//   inkwell: false,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   illustrator: "Juan Diego León",
//   number: 143,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 650078,
//   },
//   rarity: "common",
//   abilities: [
//     wheneverIsBanished({
//       name: "Out of Season",
//       text: "Once during your turn, whenever a character with cost 2 or less is banished, put the top card of your deck into your inkwell facedown and exerted.",
//       effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
//       conditions: [duringYourTurn],
//       oncePerTurn: true,
//       filters: [
//         { filter: "type", value: "character" },
//         {
//           filter: "attribute",
//           value: "cost",
//           comparison: { operator: "lte", value: 2 },
//         },
//       ],
//     }),
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "INSULTING REMARK",
//       text: "During your turn, each opposing character with cost 2 or less gets -1 {S}.",
//       conditions: [duringYourTurn],
//       gainedAbility: {
//         type: "static",
//         ability: "effects",
//         name: "INSULTING REMARK",
//         text: "This character gets -1 {S}.",
//         conditions: [duringYourTurn],
//         effects: [
//           {
//             type: "attribute",
//             attribute: "strength",
//             amount: 1,
//             modifier: "subtract",
//             target: {
//               type: "card",
//               value: "all",
//               filters: [
//                 { filter: "type", value: "character" },
//                 { filter: "owner", value: "opponent" },
//                 {
//                   filter: "attribute",
//                   value: "cost",
//                   comparison: { operator: "lte", value: 2 },
//                 },
//               ],
//             },
//           },
//         ],
//       },
//       target: yourOtherCharacters,
//     },
//   ],
//   lore: 1,
// };
//
