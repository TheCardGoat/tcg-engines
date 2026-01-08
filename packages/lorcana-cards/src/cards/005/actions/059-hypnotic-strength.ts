import type { ActionCard } from "@tcg/lorcana-types";

export const hypnoticStrength: ActionCard = {
  id: "tu0",
  cardType: "action",
  name: "Hypnotic Strength",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "005",
  text: "Draw a card. Chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
  cost: 2,
  cardNumber: 59,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "02fc9a9247b0b6880e17a7e30bd4b6da98fd0d70",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const hypnoticStrength: LorcanitoActionCard = {
//   id: "ron",
//   name: "Hypnotic Strength",
//   characteristics: ["action"],
//   text: "Draw a card. Chosen character gains **Challenger** +2 this turn. _(They get +2 {S} while challenging.)_",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Draw a card. ",
//       effects: [drawACard],
//     },
//     {
//       type: "resolution",
//       text: "Chosen character gains **Challenger** +2 this turn. _(They get +2 {S} while challenging.)_",
//       effects: [
//         {
//           type: "ability",
//           ability: "challenger",
//           amount: 2,
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   flavour: "Suddenly, Basil felt a strong desire to find the broken crown.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   illustrator: "Giulia Riva",
//   number: 59,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561345,
//   },
//   rarity: "common",
// };
//
