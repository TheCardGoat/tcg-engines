import type { ActionCard } from "@tcg/lorcana-types";

export const iWillFindMyWay: ActionCard = {
  id: "wyf",
  cardType: "action",
  name: "I Will Find My Way",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "003",
  text: "Chosen character of yours gets +2 {S} this turn. They may move to a location for free.",
  actionSubtype: "song",
  cost: 1,
  cardNumber: 95,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "76c72f7c7ca88688d326fb41bcac4308a48a724a",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   getStrengthThisTurn,
//   moveToLocation,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const iWillFindMyWay: LorcanitoActionCard = {
//   id: "qdn",
//   name: "I Will Find My Way",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 1 or more can {E} to sing this song for free.)_\n\n\nChosen character of yours gets +2 {S} this turn. They may move to a location for free.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         getStrengthThisTurn(2, chosenCharacterOfYours),
//         moveToLocation(chosenCharacterOfYours),
//       ],
//     },
//   ],
//   flavour: "I would go most anywhere \nTo feel like I belong",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 1,
//   illustrator: "Carmine Pucci",
//   number: 95,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 538723,
//   },
//   rarity: "common",
// };
//
