import type { ActionCard } from "@tcg/lorcana-types";

export const heffalumpsAndWoozles: ActionCard = {
  id: "10y",
  cardType: "action",
  name: "Heffalumps and Woozles",
  inkType: ["emerald"],
  franchise: "Winnie the Pooh",
  set: "006",
  text: "Chosen opposing character can't quest during their next turn. Draw a card.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 95,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "852f102ef952d51be8cdcfe9a21537a060be160a",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenOpposingCharacterCantQuestNextTurn,
//   drawACard,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const heffalumpsAndWoozles: LorcanitoActionCard = {
//   id: "kml",
//   name: "Heffalumps And Woozles",
//   characteristics: ["song", "action"],
//   text: "(A character with cost 2 or more can {E} to sing this song for free.)\nChosen opposing character can't quest during their next turn. Draw a card.",
//   type: "action",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   illustrator: "Domenico Russo",
//   number: 95,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 587355,
//   },
//   rarity: "common",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Heffalumps And Woozles",
//       text: "Chosen opposing character can't quest during their next turn. Draw a card.",
//       resolveEffectsIndividually: true,
//       effects: [drawACard, chosenOpposingCharacterCantQuestNextTurn],
//     },
//   ],
// };
//
