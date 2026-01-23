import type { ActionCard } from "@tcg/lorcana-types";

export const nightHowlerRage: ActionCard = {
  id: "1mw",
  cardType: "action",
  name: "Night Howler Rage",
  inkType: ["emerald"],
  franchise: "Zootropolis",
  set: "005",
  text: "Draw a card. Chosen character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  cost: 3,
  cardNumber: 95,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d25d7ef8b4fe1c826e2faa544124363358944a73",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenCharacterGainsRecklessDuringNextTurn,
//   drawACard,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const nightHowlerRage: LorcanitoActionCard = {
//   id: "g2v",
//   name: "Night Howler Rage",
//   characteristics: ["action"],
//   text: "Draw a card. Chosen character gains **Reckless** during their next turn._(They can’t quest and must challenge if able.)_",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Draw a card. Chosen character gains **Reckless** during their next turn._(They can’t quest and must challenge if able.)_",
//       effects: [chosenCharacterGainsRecklessDuringNextTurn, drawACard],
//     },
//   ],
//   flavour:
//     '"I think someone is targeting predators on purpose and making them go savage!" \n−Judy Hopps',
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   illustrator: "Antoine Couttolenc",
//   number: 95,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560541,
//   },
//   rarity: "common",
// };
//
