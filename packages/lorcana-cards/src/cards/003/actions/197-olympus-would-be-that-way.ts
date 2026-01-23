import type { ActionCard } from "@tcg/lorcana-types";

export const olympusWouldBeThatWay: ActionCard = {
  id: "1w0",
  cardType: "action",
  name: "Olympus Would Be That Way",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "003",
  text: "Your characters get +3 {S} while challenging a location this turn.",
  cost: 1,
  cardNumber: 197,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f51fb976aaf3a4c3f2c10e2249bb2ab155b8072b",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { yourCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const olympusWouldBeThatWay: LorcanitoActionCard = {
//   id: "w88",
//   name: "Olympus Would Be That Way",
//   characteristics: ["action"],
//   text: "Your characters get +3 {S} this turn while challenging a location.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "ability",
//           ability: "challenger",
//           amount: 3,
//           modifier: "add",
//           duration: "turn",
//           target: yourCharacters,
//         },
//       ],
//     },
//   ],
//   flavour:
//     "Now that I set you free, what is the first thing you are going to do? \n–Hades",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 1,
//   illustrator: "Michaela Martin",
//   number: 197,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 539117,
//   },
//   rarity: "common",
// };
//
