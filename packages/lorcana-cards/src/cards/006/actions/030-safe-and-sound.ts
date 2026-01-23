import type { ActionCard } from "@tcg/lorcana-types";

export const safeAndSound: ActionCard = {
  id: "1po",
  cardType: "action",
  name: "Safe and Sound",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "006",
  text: "Chosen character of yours can’t be challenged until the start of your next turn.",
  cost: 2,
  cardNumber: 30,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "dc0802d2dbfb80d577f530a89334ff27a081f61a",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/target";
// import { allCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const safeAndSound: LorcanitoActionCard = {
//   id: "ypf",
//   name: "Safe And Sound",
//   characteristics: ["action"],
//   text: "Chosen character of yours can't be challenged until the start of your next turn.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Safe And Sound",
//       text: "Chosen character of yours can't be challenged until the start of your next turn.",
//       effects: [
//         {
//           type: "ability",
//           ability: "custom",
//           modifier: "add",
//           duration: "next_turn",
//           until: true,
//           target: chosenCharacterOfYours,
//           customAbility: {
//             type: "static",
//             ability: "effects",
//             effects: [
//               {
//                 type: "protection",
//                 from: "challenge",
//                 target: allCharacters,
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: false,
//   colors: ["amber"],
//   cost: 2,
//   illustrator: "Simone Tentoni",
//   number: 30,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593041,
//   },
//   rarity: "rare",
// };
//
