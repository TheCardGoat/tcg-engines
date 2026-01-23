import type { ActionCard } from "@tcg/lorcana-types";

export const onYourFeetNow: ActionCard = {
  id: "1hc",
  cardType: "action",
  name: "On Your Feet! Now!",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "003",
  text: "Ready all your characters and deal 1 damage to each of them. They can't quest for the rest of this turn.",
  cost: 4,
  cardNumber: 130,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c2489a966a450b41881a99cd9bb1f009bd92d32d",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   allYourCharacters,
//   eachOfYourCharacters,
// } from "@lorcanito/lorcana-engine/abilities/targets";
// import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const onYourFeetNow: LorcanitoActionCard = {
//   id: "wna",
//   missingTestCase: true,
//   name: "On Your Feet! Now!",
//   characteristics: ["action"],
//   text: "Ready all your characters and deal 1 damage to each of them. They can't quest for the rest of this turn.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Ready all your characters and deal 1 damage to each of them. They can't quest for the rest of this turn.",
//       effects: [
//         ...readyAndCantQuest(allYourCharacters),
//         {
//           type: "damage",
//           amount: 1,
//           target: eachOfYourCharacters,
//         },
//       ],
//     },
//   ],
//   flavour: "Catch them! Before they get away!",
//   colors: ["ruby"],
//   illustrator: "Lisanne Koeteeuw",
//   number: 130,
//   cost: 4,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 539093,
//   },
//   rarity: "rare",
// };
//
