import type { ActionCard } from "@tcg/lorcana-types";

export const breakFree: ActionCard = {
  id: "10c",
  cardType: "action",
  name: "Break Free",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "005",
  text: "Deal 1 damage to chosen character of yours. They gain Rush and get +1 {S} this turn. (They can challenge the turn they're played.)",
  cost: 1,
  cardNumber: 127,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8248c978719b5c75b9b75c52ba7e436f3fc416db",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/targets";
// import { chosenCharacterGainsRush } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const breakFree: LorcanitoActionCard = {
//   id: "qdj",
//   name: "Break Free",
//   characteristics: ["action"],
//   text: "Deal 1 damage to chosen character of yours. They gain **Rush** and get +1 {S} this turn. _(They can challenge the turn they’re played.)_",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Deal 1 damage to chosen character of yours. They gain **Rush** and get +1 {S} this turn. _(They can challenge the turn they’re played.)_",
//       effects: [
//         {
//           type: "damage",
//           amount: 1,
//           target: chosenCharacterOfYours,
//         },
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 1,
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacterOfYours,
//         },
//         chosenCharacterGainsRush,
//       ],
//     },
//   ],
//   flavour: "Tink darted from the shattered lantern in the blink of an eye.",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 1,
//   illustrator: "Brian Kesinger",
//   number: 127,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559717,
//   },
//   rarity: "common",
// };
//
