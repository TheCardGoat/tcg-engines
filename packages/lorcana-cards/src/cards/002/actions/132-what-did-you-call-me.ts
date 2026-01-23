import type { ActionCard } from "@tcg/lorcana-types";

export const whatDidYouCallMe: ActionCard = {
  id: "n3b",
  cardType: "action",
  name: "What Did You Call Me?",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "Chosen damaged character gets +3 {S} this turn.",
  cost: 1,
  cardNumber: 132,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5339a38eed9968c3a46b91a0af5b667b76794ef5",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// const chosenDamagedCharacter: CardEffectTarget = {
//   type: "card",
//   value: 1,
//   filters: [
//     {
//       filter: "status",
//       value: "damage",
//       comparison: { operator: "gte", value: 1 },
//     },
//     { filter: "type", value: "character" },
//     { filter: "zone", value: "play" },
//   ],
// };
//
// export const whatDidYouCallMe: LorcanitoActionCard = {
//   id: "vrt",
//
//   name: "What did you call me?",
//   characteristics: ["action"],
//   text: "Chosen damaged character gets +3 {S} this turn.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "What did you call me?",
//       text: "Chosen damaged character gets +3 {S} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 3,
//           modifier: "add",
//           duration: "turn",
//           target: chosenDamagedCharacter,
//         },
//       ],
//     },
//   ],
//   flavour:
//     "No one can have a higher opinion of you than I have, and I think you're a slimy, contemptible sewer rat! \n−Basil",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 1,
//   illustrator: "Luis Huerta",
//   number: 132,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527760,
//   },
//   rarity: "common",
// };
//
