import type { ActionCard } from "@tcg/lorcana-types";

export const imStillHere: ActionCard = {
  id: "7tt",
  cardType: "action",
  name: "I'm Still Here",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "006",
  text: "Chosen character gains Resist +2 until the start of your next turn. Draw a card. (Damage dealt to them is reduced by 2.)",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 196,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1c3668b9f7832219a19073b3d34479279d7ea3bc",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const imStillHere: LorcanitoActionCard = {
//   id: "aht",
//   missingTestCase: true,
//   name: "I'm Still Here",
//   characteristics: ["song", "action"],
//   text: "(A character with cost 3 or more can {E} to sing this song for free.)\nChosen character gains Resist +2 until the start of your next turn. Draw a card. (Damage dealt to them is reduced by 2.)",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       resolveEffectsIndividually: true,
//       effects: [
//         {
//           type: "ability",
//           ability: "resist",
//           modifier: "add",
//           amount: 2,
//           until: true,
//           duration: "next_turn",
//           target: chosenCharacter,
//         },
//         drawACard,
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 0,
//   illustrator: "Mike Packer",
//   number: 196,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 588151,
//   },
//   rarity: "uncommon",
// };
//
