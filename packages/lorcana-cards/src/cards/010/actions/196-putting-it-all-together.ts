import type { ActionCard } from "@tcg/lorcana-types";

export const puttingItAllTogether: ActionCard = {
  id: "1du",
  cardType: "action",
  name: "Putting It All Together",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "010",
  text: "Chosen opposing character can't challenge during their next turn. Draw a card.",
  cost: 2,
  cardNumber: 196,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b33e8cb6e3bd48c4ba843a6e1f9a62094435ba7b",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
// import type { CardRestrictionEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// export const chosenOpposingCharacterCantChallengeDuringNextTurn: CardRestrictionEffect =
//   {
//     type: "restriction",
//     restriction: "challenge",
//     duration: "next_turn",
//     target: chosenOpposingCharacter,
//   };
//
// export const puttingItAllTogether: LorcanitoActionCard = {
//   id: "sva",
//   name: "Putting It All Together",
//   characteristics: ["action"],
//   text: "Chosen opposing character can't challenge during their next turn. Draw a card.",
//   type: "action",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   illustrator: "Kevin Sidharta",
//   number: 196,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 653912,
//   },
//   rarity: "common",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [chosenOpposingCharacterCantChallengeDuringNextTurn, drawACard],
//     },
//   ],
// };
//
