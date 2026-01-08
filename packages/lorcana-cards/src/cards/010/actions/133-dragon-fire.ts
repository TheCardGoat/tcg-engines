import type { ActionCard } from "@tcg/lorcana-types";

export const dragonFire: ActionCard = {
  id: "1o2",
  cardType: "action",
  name: "Dragon Fire",
  inkType: ["ruby"],
  franchise: "Sleeping Beauty",
  set: "010",
  text: "Banish chosen character.",
  cost: 5,
  cardNumber: 133,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d9ec006d3956dca4006cbf745c589057a0ba0663",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { dragonFire as ogDragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/130-dragon-fire";
//
// export const dragonFire: LorcanitoActionCard = {
//   ...ogDragonFire,
//   id: "nns",
//   reprints: [ogDragonFire.id],
//   number: 133,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659245,
//   },
// };
//
