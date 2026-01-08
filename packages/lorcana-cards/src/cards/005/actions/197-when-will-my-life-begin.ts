import type { ActionCard } from "@tcg/lorcana-types";

export const whenWillMyLifeBegin: ActionCard = {
  id: "1ay",
  cardType: "action",
  name: "When Will My Life Begin?",
  inkType: ["steel"],
  franchise: "Tangled",
  set: "005",
  text: "Chosen character can't challenge during their next turn. Draw a card.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 197,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a93a1efecc6c3e773ca5de295729482697c34e24",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenCharacterCantChallengeDuringNextTurn,
//   drawACard,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const whenWillMyLifeBegin: LorcanitoActionCard = {
//   id: "a04",
//   name: "When Will My Life Begin?",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 3 or more can {E} to sing this song for free.)_<br>Chosen character can’t challenge during their next turn. Draw a card.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "When Will My Life Begin?",
//       text: "Chosen character can’t challenge during their next turn. Draw a card.",
//       effects: [drawACard, chosenCharacterCantChallengeDuringNextTurn],
//     },
//   ],
//   flavour: "Stuck in the same place I’ve always been...",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   illustrator: "Javi Salas",
//   number: 197,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559754,
//   },
//   rarity: "common",
// };
//
